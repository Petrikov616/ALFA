import express from "express";
const router = express.Router();
import pool from "../db.js";

//LISTAR REPORTES DEL DIA

// ==========================================
// 1. LISTAR REPORTES (Con LEFT JOIN corregido)
// ==========================================
router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT 
                r.id,
                r.servicio,
                r.alimento,
                r.nivel,
                r.observacion,
                r.registrado_por,
                r.created_at,
                e.nombre1,
                e.nombre2,
                e.apellido1,
                e.apellido2,
                g.nombre_grupo AS grupo_nombre
            FROM app.reportes_desperdicio r
            LEFT JOIN app.estudiantes e ON r.estudiante_id = e.id
            LEFT JOIN app.grupos g ON e.grupo_id = g.id
            ORDER BY r.created_at DESC;
        `;
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (err) {
        // Esto nos mostrará el error exacto en la terminal de VS Code para no andar adivinando
        console.error("DETALLE DEL ERROR EN EL GET DE REPORTES:", err);
        return res.status(500).json({ 
            error: "Error al obtener los reportes",
            details: err.message // Nos ayuda a visualizar el error temporalmente en el navegador
        });
    }
});

// CREAR UN REPORTE
router.post("/", async (req, res) => {
    const { estudiante_id, servicio, alimento, nivel, observacion, registrado_por } = req.body;

    if (!estudiante_id || !servicio || !alimento || !nivel || !registrado_por) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        });
    }

    try {
        // Query corregido con los nombres exactos de pgAdmin
        const query = `
            INSERT INTO app.reportes_desperdicio (estudiante_id, servicio, alimento, nivel, observacion, registrado_por)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [
            estudiante_id, 
            servicio, 
            alimento, 
            nivel, 
            observacion || null, 
            registrado_por
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            message: "Reporte creado correctamente",
            reporte: result.rows[0]
        });
    } catch (err) {
        // Esto pintará el error exacto de Postgres en tu consola de VS Code para auditarlo de inmediato
        console.error("Error detallado en la base de datos:", err);
        return res.status(500).json({ 
            error: "Error al crear el reporte",
            details: err.message 
        });
    }
});

//ELIMINAR UN REPORTE

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const query = `DELETE FROM app.reportes_desperdicio WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró el reporte con ID ${id}`
            });
        }

        return res.status(200).json({
            message: "Reporte eliminado correctamente",
        });
    } catch (err) {
        console.error("Error al eliminar el reporte: ", err);
        return res.status(500).json({ error: "Error al eliminar el reporte" });
    }
});

export default router;