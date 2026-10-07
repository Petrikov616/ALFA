import express from 'express';
const router = express.Router();
import pool from '../db.js';

// POST: Registrar la asistencia de un estudiante
router.post("/", async (req, res) => {
const { cedula } = req.body;

if (!cedula) {
    return res.status(400).json({ error: "La cédula es requerida" });
}

try {
    // 1. Consultar el estudiante por documento
    const consultaEstudiante = "SELECT * FROM app.estudiantes WHERE documento = $1";
    const resultadoEstudiante = await pool.query(consultaEstudiante, [cedula]);

    if (resultadoEstudiante.rows.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    const estudiante = resultadoEstudiante.rows[0];

    // 2. Consultar el servicio activo asignado al estudiante
    const consultaServicio = `
        SELECT servicio 
        FROM app.asignaciones_servicio 
        WHERE estudiante_id = $1 AND fecha_fin IS NULL
        ORDER BY created_at DESC 
        LIMIT 1
    `;
    const resultadoServicio = await pool.query(consultaServicio, [estudiante.id]);

    if (resultadoServicio.rows.length === 0) {
        return res.status(400).json({ error: "El estudiante no tiene un servicio asignado" });
    }

    const servicioEstudiante = resultadoServicio.rows[0].servicio;

    // 3. Verificación con fecha exacta de Colombia (UTC-5)
    const consultaExiste = `
        SELECT id FROM asistencias 
        WHERE estudiante_id = $1 
            AND fecha = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota')::DATE 
            AND servicio = $2
    `;
    const existeRegistro = await pool.query(consultaExiste, [estudiante.id, servicioEstudiante]);

    if (existeRegistro.rows.length > 0) {
        return res.status(400).json({
            error: `El estudiante ${estudiante.nombre1} ya registró asistencia para el servicio '${servicioEstudiante}' el día de hoy.`
        });
    }

    // 4. Inserción con fecha y hora exactas de Colombia
    const consultaAsistencia = `
        INSERT INTO asistencias (estudiante_id, fecha, hora, servicio, registrado_por)
        VALUES (
            $1, 
            (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota')::DATE, 
            (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota')::TIME, 
            $2, 
            $3
        )
        RETURNING *
    `;

    await pool.query(consultaAsistencia, [estudiante.id, servicioEstudiante, null]);

    return res.status(200).json({
        message: "Asistencia registrada correctamente",
        estudiante: estudiante.nombre1,
        servicio: servicioEstudiante
    });

} catch (error) {
    if (error.code === '23505') {
        return res.status(400).json({
            error: "La asistencia para este estudiante y servicio ya fue registrada el día de hoy."
        });
    }

    console.error("Error al registrar la asistencia:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
}

    const registrarAsistencia = async (req, res) => {
        const ahora = new Date();
        const horaActualMinutos = ahora.getHours() * 60 + ahora.getMinutes();

        const horaInicio = 7 * 60;
        const horaFin = 10 * 60;

        if (horaActualMinutos < horaInicio || horaActualMinutos > horaFin) {
            return res.status(400).json({
                ok: false,
                message: "La asistencia solo puede registrar entre las 7:00 AM y las 10:00 AM."
            });
        }

    }
});

// GET: Obtener la matriz de asistencia filtrada por mes y año
router.get("/matriz", async (req, res) => {
const mes = req.query.mes || new Date().getMonth() + 1;
const anio = req.query.anio || new Date().getFullYear();

try {
    const consultaEstudiantes = `
        SELECT e.id, CONCAT(e.nombre1, ' ', COALESCE(e.nombre2, ''), ' ', COALESCE(e.apellido1, '')) AS nombre_completo,
                g.nombre_grupo AS grupo
        FROM app.estudiantes e
        LEFT JOIN app.grupos g ON e.grupo_id = g.id
        WHERE e.activo = TRUE
        ORDER BY e.nombre1 ASC
    `;
    const resEstudiantes = await pool.query(consultaEstudiantes);

    const consultaAsistencias = `
        SELECT estudiante_id, EXTRACT(DAY FROM fecha)::INTEGER AS dia
        FROM asistencias
        WHERE EXTRACT(MONTH FROM fecha) = $1 
            AND EXTRACT(YEAR FROM fecha) = $2
        GROUP BY estudiante_id, dia
    `;
    const resAsistencias = await pool.query(consultaAsistencias, [mes, anio]);

    const asistenciasMap = {};
    resAsistencias.rows.forEach(row => {
        if (!asistenciasMap[row.estudiante_id]) {
            asistenciasMap[row.estudiante_id] = new Set();
        }
        asistenciasMap[row.estudiante_id].add(row.dia);
    });

    const data = resEstudiantes.rows.map(est => {
        const diasAsistidos = Array.from(asistenciasMap[est.id] || []);
        return {
            id: est.id,
            estudiante: est.nombre_completo.trim(),
            grupo: est.grupo || 'Sin grupo',
            diasAsistidos: diasAsistidos
        };
    });

    return res.status(200).json({
        mes: Number(mes),
        anio: Number(anio),
        estudiantes: data
    });

} catch (error) {
    console.error("Error al obtener matriz de asistencias:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
}
});

// EXPORTACIÓN POR DEFECTO REQUERIDA POR index.js
export default router;