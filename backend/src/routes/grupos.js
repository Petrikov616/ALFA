import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Crear un grupo

router.post("/", async (req, res) => {
    const { nombre_grupo } = req.body;

    if (!nombre_grupo) {
        return res.status(400).json({ error: "El nombre del grupo es obligatorio" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO app.grupos (nombre_grupo) VALUES ($1) RETURNING *`,
            [nombre_grupo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23505") { // violación de UNIQUE
            return res.status(409).json({ error: "Ese grupo ya existe" });
        }
        console.error(err);
        res.status(500).json({ error: "Error al crear el grupo" });
    }
});

// Listar todos los grupos activos
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM app.grupos WHERE activo = true ORDER BY nombre_grupo`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener los grupos"});
    }
});

// Eliminar grupo
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM app.grupos WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Grupo no encontrado"
            });
        }

        return res.status(200).json({
            message: "Grupo eliminado correctamente",
            grupoEliminado: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Error al eliminar el grupo"});
    }
});

export default router;


