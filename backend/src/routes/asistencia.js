import express from 'express';
const router = express.Router();
import pool from '../db.js';


//POST de la asistencia

router.post("/", async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({ error: "La cedula es requerida" });

    }

    try {
        const cosultaEstudiante = "SELECT * FROM app.estudiantes WHERE documento = $1";
        const resultadoEstudiante = await pool.query(cosultaEstudiante, [cedula]);

        if (resultadoEstudiante.rows.length === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }

        const estudiante = resultadoEstudiante.rows[0];

        const consultaAsistencia = `
            INSERT INTO asistencias (estudiante_id, fecha, hora, servicio, registrado_por)
            VALUES ($1, CURRENT_DATE, CURRENT_TIME, $2, $3)
            RETURNING *
        `;

        // Puedes cambiar 'ALMUERZO' o NULL según el valor por defecto que desees
        await pool.query(consultaAsistencia, [estudiante.id, 'almuerzo', null]);

        return res.status(200).json({
            message: "Asistencia registrada correctamente",
            estudiante: estudiante.nombre1
        });

    } catch (error) {
        console.error("Error al registrar la asistencia:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;

