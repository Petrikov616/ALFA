import express from 'express';
const router = express.Router();    
import pool from '../db.js';

// LISTAR
router.get("/", async (req, res) => {
    try {
        const query = 'SELECT * FROM app.estudiantes WHERE activo = true ORDER BY id ASC;';
        const result = await pool.query(query);

        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener los estudiantes"});
    }
});

// BUSCAR POR DOCUMENTO
router.get("/:documento", async (req, res) => { // Corregido el parámetro
    const { documento } = req.params;            // Corregido a 'documento'
    try {
        // Asegúrate de que en Postgres la columna se llame 'documento'
        const query = 'SELECT * FROM app.estudiantes WHERE documento = $1 AND activo = true;';
        const result = await pool.query(query, [documento]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró ningún estudiante con el documento ${documento}`
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener el estudiante"});
    }
});

// CREAR ESTUDIANTE
router.post("/", async (req, res) => {
    // 1. Desestructuramos usando 'id_grupo' desde el JSON de Thunder Client
    const { documento, nombre1, nombre2, apellido1, apellido2, id_grupo } = req.body;

    if (!documento || !nombre1 || !apellido1) {
        return res.status(400).json({ error: "El documento, primer nombre y primer apellido son obligatorios"});
    }

    try {
        // 2. Cambiamos 'id_grupo' por 'grupo_id' dentro del query SQL
        const query = `
            INSERT INTO app.estudiantes (documento, nombre1, nombre2, apellido1, apellido2, grupo_id, activo) 
            VALUES ($1, $2, $3, $4, $5, $6, true) 
            RETURNING *;
        `;
        // Como 'grupo_id' es NOT NULL, nos aseguramos de pasar el valor recibido directamente
        const values = [documento, nombre1, nombre2 || null, apellido1, apellido2 || null, id_grupo];
        const result = await pool.query(query, values);

        return res.status(201).json({
            message: "Estudiante creado correctamente",
            estudiante: result.rows[0]
        });
    } catch (err) {
        console.error("Error al crear el estudiante:", err);
        if (err.code === '23505') {
            return res.status(400).json({ error: "Ya existe un estudiante activo registrado con este documento"}); 
        }
        return res.status(500).json({ error: "Error al crear el estudiante"});
    }
});

// ELIMINAR (SOFT DELETE)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // En lugar de un DELETE, hacemos un UPDATE para cambiar el estado 'activo' a false
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

export default router;