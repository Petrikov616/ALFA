import express from "express";
const router = express.Router();
import pool from "../db.js";

// 1. LISTAR REPORTES
router.get("/", async (req, res) => {
    try {
        // CORRECCIÓN: Cambiado e.id_grupo por e.grupo_id
        const query = `
            SELECT 
                r.id, 
                r.servicio, 
                r.alimento, 
                r.nivel, 
                r.observacion,
                r.registrado_por, 
                TO_CHAR(r.created_at, 'HH:MI AM') AS hora,
                e.nombre1, 
                e.nombre2, 
                e.apellido1, 
                e.apellido2,
                g.nombre_grupo AS grupo
            FROM app.reportes_desperdicio r
            LEFT JOIN app.estudiantes e ON r.estudiante_id = e.id
            LEFT JOIN app.grupos g ON e.grupo_id = g.id
            ORDER BY r.created_at DESC;
        `;
        const result = await pool.query(query);

        const reportesFormateados = result.rows.map(row => ({
            id: row.id,
            servicio: row.servicio,
            alimento: row.alimento,
            nivel: row.nivel,
            observacion: row.observacion,
            registrado_por: row.registrado_por,
            hora: row.hora,
            grupo: row.grupo || "N/A",
            estudiante: {
                nombre1: row.nombre1,
                nombre2: row.nombre2,
                apellido1: row.apellido1,
                apellido2: row.apellido2
            }
        }));

        res.status(200).json(reportesFormateados);
    } catch (err) {
        console.error("Error en GET reportes:", err);
        res.status(500).json({ error: "Error al obtener reportes" });
    }
});


// 2. CREAR REPORTE
router.post("/", async (req, res) => {
    const { estudiante_id, servicio, alimento, nivel, observacion } = req.body;

    if (!estudiante_id || !servicio || !alimento || !nivel) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const usuarioDb = await pool.query("SELECT id FROM app.usuarios LIMIT 1");
        const usuarioIdValido = usuarioDb.rows.length > 0 ? usuarioDb.rows[0].id : 1;

        const insertQuery = `
            INSERT INTO app.reportes_desperdicio 
            (estudiante_id, servicio, alimento, nivel, observacion, registrado_por)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        
        const values = [
            estudiante_id, 
            servicio.toLowerCase(), 
            alimento, 
            nivel.toLowerCase(), 
            observacion || "Sin observaciones", 
            usuarioIdValido 
        ];
        
        const insertResult = await pool.query(insertQuery, values);
        const nuevoReporteId = insertResult.rows[0].id;

        // CORRECCIÓN: Cambiado e.id_grupo por e.grupo_id aquí también
        const selectQuery = `
            SELECT 
                r.id, 
                r.servicio, 
                r.alimento, 
                r.nivel, 
                r.observacion,
                r.registrado_por, 
                TO_CHAR(r.created_at, 'HH:MI AM') AS hora,
                e.nombre1, 
                e.nombre2, 
                e.apellido1, 
                e.apellido2,
                g.nombre_grupo AS grupo
            FROM app.reportes_desperdicio r
            LEFT JOIN app.estudiantes e ON r.estudiante_id = e.id
            LEFT JOIN app.grupos g ON e.grupo_id = g.id
            WHERE r.id = $1;
        `;
        
        const selectResult = await pool.query(selectQuery, [nuevoReporteId]);
        const row = selectResult.rows[0];

        const reporteFormateado = {
            id: row.id,
            servicio: row.servicio,
            alimento: row.alimento,
            nivel: row.nivel,
            observacion: row.observacion,
            registrado_por: row.registrado_por,
            hora: row.hora,
            grupo: row.grupo || "N/A",
            estudiante: {
                nombre1: row.nombre1,
                nombre2: row.nombre2,
                apellido1: row.apellido1,
                apellido2: row.apellido2
            }
        };

        res.status(201).json(reporteFormateado);
    } catch (error) {
        console.error("Error en POST reporte:", error);
        res.status(500).json({ error: 'Error interno al guardar' });
    }
});

// 3. ELIMINAR REPORTE
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM app.reportes_desperdicio WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "No encontrado" });
        res.status(200).json({ message: "Eliminado correctamente" });
    } catch (err) {
        console.error("Error en DELETE:", err);
        res.status(500).json({ error: "Error al eliminar" });
    }
});

export default router;