import express from 'express';
const router = express.Router();
import pool from '../db.js';

// POST de la asistencia
router.post("/", async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({ error: "La cédula es requerida" });
    }

    try {
        // 1. Consultar el estudiante
        const consultaEstudiante = "SELECT * FROM app.estudiantes WHERE documento = $1";
        const resultadoEstudiante = await pool.query(consultaEstudiante, [cedula]);

        if (resultadoEstudiante.rows.length === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }

        const estudiante = resultadoEstudiante.rows[0];

        // 2. Consultar el servicio asignado al estudiante

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

        // 3. Registrar la asistencia con el servicio correcto
        const consultaAsistencia = `
            INSERT INTO asistencias (estudiante_id, fecha, hora, servicio, registrado_por)
            VALUES ($1, CURRENT_DATE, CURRENT_TIME, $2, $3)
            RETURNING *
        `;

        await pool.query(consultaAsistencia, [estudiante.id, servicioEstudiante, null]);

        return res.status(200).json({
            message: "Asistencia registrada correctamente",
            estudiante: estudiante.nombre1,
            servicio: servicioEstudiante
        });

    } catch (error) {
        console.error("Error al registrar la asistencia:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;