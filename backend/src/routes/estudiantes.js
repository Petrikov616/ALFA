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

// PUT Actualizar al estudiante o reactivarlo
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { documento, nombre1, nombre2, apellido1, apellido2, id_grupo, activo } = req.body;

    try {
        // 1. Verificar si el estudiante existe primero
        const checkQuery = 'SELECT * FROM app.estudiantes WHERE id = $1;';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: `No se encontró ningún estudiante con el ID ${id}` });
        }

        const current = checkResult.rows[0];

        // 2. Query mapeando correctamente los 8 valores
        const query = `
            UPDATE app.estudiantes 
            SET 
                documento = $1, 
                nombre1 = $2, 
                nombre2 = $3, 
                apellido1 = $4, 
                apellido2 = $5, 
                grupo_id = $6, 
                activo = $7,
                updated_at = NOW()
            WHERE id = $8
            RETURNING *;
        `;

        // CORREGIDO: Agregado 'id' al final del array para cubrir la posición $8
        const values = [
            documento !== undefined ? documento : current.documento,
            nombre1 !== undefined ? nombre1 : current.nombre1,
            nombre2 !== undefined ? nombre2 : current.nombre2,
            apellido1 !== undefined ? apellido1 : current.apellido1,
            apellido2 !== undefined ? apellido2 : current.apellido2,
            id_grupo !== undefined ? id_grupo : current.grupo_id,
            activo !== undefined ? activo : current.activo,
            id 
        ];

        const result = await pool.query(query, values);

        return res.status(200).json({
            message: "Estudiante actualizado correctamente",
            estudiante: result.rows[0]
        });

    } catch (err) {
        console.error("Error al actualizar el estudiante:", err);
        if (err.code === '23505') {
            return res.status(400).json({ error: "No se puede activar este documento porque ya lo tiene otro estudiante activo." });
        }
        return res.status(500).json({ error: "Error al actualizar el estudiante" });
    }
});

export default router;