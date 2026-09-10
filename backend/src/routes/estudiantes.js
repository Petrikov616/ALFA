import express from 'express';
const router = express.Router();
import pool from '../db.js';

// LISTAR
// LISTAR (Versión corregida usando grupo_id directo para evitar el error 500)
// LISTAR (Versión final corregida con CAST a TEXT para el ENUM)
// LISTAR (Versión definitiva con nombre_grupo y servicio corregidos)
router.get("/", async (req, res) => {
try {
    const query = `
        SELECT 
            e.id,
            TRIM(CONCAT_WS(' ', e.nombre1, e.nombre2, e.apellido1, e.apellido2)) AS nombre,
            e.documento,
            -- Traemos el nombre real del grupo usando la columna correcta
            COALESCE(g.nombre_grupo, 'Sin grupo') AS grupo,
            -- Convertimos el ENUM a TEXT para evitar el error de tipado
            COALESCE(s.servicio::TEXT, 'Ninguno') AS servicio
        FROM app.estudiantes e
        -- Conectamos con app.grupos usando su alias 'g'
        LEFT JOIN app.grupos g ON e.grupo_id = g.id 
        LEFT JOIN LATERAL (
            SELECT servicio 
            FROM app.asignaciones_servicio 
            WHERE estudiante_id = e.id 
            ORDER BY fecha_inicio DESC 
            LIMIT 1
        ) s ON true
        WHERE e.activo = true 
        ORDER BY e.id ASC;
    `;

    const result = await pool.query(query);
    return res.status(200).json(result.rows);
} catch (err) {
    console.error("Error en GET /api/estudiantes:", err);
    return res.status(500).json({ error: "Error al obtener los estudiantes" });
}
});

// CREAR ESTUDIANTE Y ASIGNAR SERVICIO
router.post("/", async (req, res) => {
const { documento, nombreCompleto, id_grupo, servicio } = req.body;

if (!documento || !nombreCompleto || !id_grupo) {
    return res.status(400).json({ error: "El documento, el nombre completo y el grupo son obligatorios" });
}

// --- LÓGICA PARA DIVIDIR EL NOMBRE COMPLETO ---
const partes = nombreCompleto.trim().split(/\s+/);
let nombre1 = null, nombre2 = null, apellido1 = null, apellido2 = null;

if (partes.length === 2) {
    nombre1 = partes[0];
    apellido1 = partes[1];
} else if (partes.length === 3) {
    nombre1 = partes[0];
    apellido1 = partes[1];
    apellido2 = partes[2];
} else if (partes.length >= 4) {
    nombre1 = partes[0];
    nombre2 = partes[1];
    apellido1 = partes[2];
    apellido2 = partes.slice(3).join(" ");
} else {
    nombre1 = partes[0];
    apellido1 = "Asignado";
}

try {
    // Iniciamos la transacción para asegurar que ambas inserciones sean exitosas
    await pool.query('BEGIN');

    // 1. Insertar el estudiante en app.estudiantes
    const estudianteQuery = `
        INSERT INTO app.estudiantes (documento, nombre1, nombre2, apellido1, apellido2, grupo_id, activo) 
        VALUES ($1, $2, $3, $4, $5, $6, true) 
        RETURNING *;
    `;
    const estudianteValues = [documento, nombre1, nombre2, apellido1, apellido2, id_grupo];
    const estudianteResult = await pool.query(estudianteQuery, estudianteValues);
    const nuevoEstudiante = estudianteResult.rows[0];

    // 2. Insertar en app.asignaciones_servicio usando los campos correctos
    if (servicio && servicio !== "Seleccione un servicio") {
        const fechaInicioActual = new Date().toISOString().split('T')[0]; // Genera 'YYYY-MM-DD'

        const servicioQuery = `
            INSERT INTO app.asignaciones_servicio (estudiante_id, servicio, fecha_inicio)
            VALUES ($1, $2, $3);
        `;
        await pool.query(servicioQuery, [nuevoEstudiante.id, servicio, fechaInicioActual]);
    }

    // Si todo sale bien, confirmamos los cambios en Postgres
    await pool.query('COMMIT');

    return res.status(201).json({
        message: "Estudiante y asignación de servicio creados correctamente",
        estudiante: nuevoEstudiante
    });

} catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error en la transacción de creación:", err);

    if (err.code === '23505') {
        return res.status(400).json({ error: "Ya existe un estudiante activo registrado con este documento" });
    }
    return res.status(500).json({ error: "Error al registrar el estudiante y su servicio" });
}
});

// ELIMINAR (SOFT DELETE)
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
    const query = `UPDATE app.estudiantes SET activo = false WHERE id = $1 AND activo = true RETURNING *;`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({
            error: `No se encontró el estudiante con ID ${id} o ya ha sido eliminado`
        });
    }

    return res.status(200).json({
        message: "Estudiante eliminado de forma lógica correctamente"
    });
} catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al eliminar el estudiante" });
}
});

// PUT Actualizar al estudiante y su servicio asignado
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { documento, nombre, grupo, servicio } = req.body;

    // Convertimos el id de la URL a un número entero válido
    const estudianteId = parseInt(id, 10);
    if (isNaN(estudianteId)) {
        return res.status(400).json({ error: "El ID del estudiante debe ser un número entero válido." });
    }

    try {
        await pool.query('BEGIN');

        // 1. Verificar si el estudiante existe
        const checkResult = await pool.query('SELECT * FROM app.estudiantes WHERE id = $1;', [estudianteId]);
        if (checkResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: `No se encontró ningún estudiante con el ID ${estudianteId}` });
        }
        const current = checkResult.rows[0];

        // 2. Procesar la división del nombre completo
        let nombre1 = current.nombre1, nombre2 = current.nombre2, apellido1 = current.apellido1, apellido2 = current.apellido2;

        if (nombre && nombre.trim() !== "") {
            const partes = nombre.trim().split(/\s+/);
            if (partes.length === 2) {
                nombre1 = partes[0]; nombre2 = null; apellido1 = partes[1]; apellido2 = null;
            } else if (partes.length === 3) {
                nombre1 = partes[0]; nombre2 = null; apellido1 = partes[1]; apellido2 = partes[2];
            } else if (partes.length >= 4) {
                nombre1 = partes[0]; nombre2 = partes[1]; apellido1 = partes[2]; apellido2 = partes.slice(3).join(" ");
            } else {
                nombre1 = partes[0]; nombre2 = null; apellido1 = "Asignado"; apellido2 = null;
            }
        }

        // 3. Obtener el grupo_id correspondiente
        let grupoId = current.grupo_id;
        if (grupo && grupo !== "Seleccione un grupo") {
            const grupoRes = await pool.query('SELECT id FROM app.grupos WHERE nombre_grupo = $1 LIMIT 1;', [grupo]);
            if (grupoRes.rows.length > 0) {
                grupoId = grupoRes.rows[0].id;
            }
        }

        // 4. Actualizar tabla app.estudiantes
        const updateEstudianteQuery = `
            UPDATE app.estudiantes 
            SET 
                documento = $1, 
                nombre1 = $2, 
                nombre2 = $3, 
                apellido1 = $4, 
                apellido2 = $5, 
                grupo_id = $6, 
                updated_at = NOW()
            WHERE id = $7
            RETURNING *;
        `;
        const estudianteValues = [
            documento !== undefined ? documento : current.documento,
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            grupoId,
            estudianteId
        ];
        const resultEstudiante = await pool.query(updateEstudianteQuery, estudianteValues);

        // 5. Actualizar o insertar el servicio en app.asignaciones_servicio
        if (servicio && servicio !== "Ninguno") {
            const servicioFormateado = servicio.trim().toLowerCase();
            const fechaInicioActual = new Date().toISOString().split('T')[0];

            // Revisamos si ya tiene alguna asignación de servicio registrada
            const checkServicio = await pool.query(
                'SELECT id FROM app.asignaciones_servicio WHERE estudiante_id = $1 ORDER BY fecha_inicio DESC LIMIT 1;',
                [estudianteId]
            );

            if (checkServicio.rows.length > 0) {
                // Si existe, actualizamos la última asignación
                const updateServicioQuery = `
                    UPDATE app.asignaciones_servicio 
                    SET servicio = $1, fecha_inicio = $2 
                    WHERE id = $3;
                `;
                await pool.query(updateServicioQuery, [servicioFormateado, fechaInicioActual, checkServicio.rows[0].id]);
            } else {
                // Si no existe, creamos el nuevo registro
                const insertServicioQuery = `
                    INSERT INTO app.asignaciones_servicio (estudiante_id, servicio, fecha_inicio)
                    VALUES ($1, $2, $3);
                `;
                await pool.query(insertServicioQuery, [estudianteId, servicioFormateado, fechaInicioActual]);
            }
        }

        await pool.query('COMMIT');

        return res.status(200).json({
            message: "Estudiante y servicio actualizados correctamente en la base de datos",
            estudiante: resultEstudiante.rows[0]
        });

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error al actualizar el estudiante:", err);
        if (err.code === '23505') {
            return res.status(400).json({ error: "No se puede asignar este documento porque ya está en uso." });
        }
        return res.status(500).json({ error: "Error interno al actualizar el estudiante" });
    }
});

export default router;