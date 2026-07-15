import express from "express";
import { createClerkClient } from "@clerk/backend";
import pool from "../db.js";

const router = express.Router();

// Inicializamos el cliente de Clerk de forma moderna
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// ==========================================
// 1. OBTENER TODOS LOS LÍDERES (Para la tabla del Admin)
// ==========================================
router.get("/", async (req, res) => {
    const client = await pool.connect();
    try {
        // Traemos los usuarios que tienen rol 'lider' y concatenamos los nombres de sus grupos en un array
        const queryText = `
            SELECT 
                u.id, 
                u.clerk_id, 
                u.nombre, 
                u.correo, 
                u.documento,
                COALESCE(
                    json_agg(
                        json_build_object('id', g.id, 'nombre_grupo', g.nombre_grupo)
                    ) FILTER (WHERE g.id IS NOT NULL), '[]'
                ) AS grupos
            FROM app.usuarios u
            LEFT JOIN app.lider_grupo lg ON u.id = lg.lider_id
            LEFT JOIN app.grupos g ON lg.grupo_id = g.id
            WHERE u.rol = 'lider'
            GROUP BY u.id
            ORDER BY u.nombre ASC;
        `;
        const result = await client.query(queryText);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error al obtener los líderes:", err);
        res.status(500).json({ error: "Error al obtener la lista de líderes" });
    } finally {
        client.release();
    }
});

// ==========================================
// 2. CREAR UN NUEVO LÍDER (Tu código original intacto)
// ==========================================
router.post("/", async (req, res) => {
    const { nombre, documento, correo, password, grupo_ids } = req.body;

    if (!nombre || !correo || !password || !grupo_ids || grupo_ids.length === 0) {
        return res.status(400).json({ error: "Faltan campos obligatorios (incluye al menos un grupo)" });
    }

    const client = await pool.connect();
    let clerkUser;

    try {
        const [firstName, ...rest] = nombre.split(" ");
        const lastName = rest.join(" ") || "";

        // 1. Crear el usuario en Clerk de forma moderna
        clerkUser = await clerkClient.users.createUser({
            emailAddress: [correo],
            password: password,
            firstName: firstName,
            lastName: lastName,
            publicMetadata: { role: "lider", documento },
        });

        // 2. Insertar en nuestra BD y asignar grupos, todo en una transacción
        await client.query("BEGIN");

        const usuarioResult = await client.query(
            `INSERT INTO app.usuarios (clerk_id, nombre, correo, documento, rol)
            VALUES ($1, $2, $3, $4, 'lider')
            ON CONFLICT (clerk_id) DO UPDATE SET nombre = EXCLUDED.nombre
            RETURNING id`,
            [clerkUser.id, nombre, correo, documento || null]
        );
        const usuarioId = usuarioResult.rows[0].id;

        for (const grupoId of grupo_ids) {
            await client.query(
                `INSERT INTO app.lider_grupo (lider_id, grupo_id) 
                VALUES ($1, $2) 
                ON CONFLICT (lider_id, grupo_id) DO NOTHING`,
                [usuarioId, parseInt(grupoId, 10)]
            );
        }

        await client.query("COMMIT");
        res.status(201).json({ mensaje: "Líder registrado y grupos asignados", usuarioId });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error completo en el registro de líder:", err);

        if (clerkUser) {
            try {
                await clerkClient.users.deleteUser(clerkUser.id);
            } catch (cleanupErr) {
                console.error("No se pudo revertir el usuario en Clerk:", cleanupErr);
            }
        }

        res.status(500).json({ 
            error: "Error al registrar el líder", 
            details: err.message || err 
        });
    } finally {
        client.release();
    }
});

// ==========================================
// 3. ELIMINAR UN LÍDER (Sincronizado con Clerk y Base de Datos)
// ==========================================
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        // 1. Obtener el clerk_id del usuario para poder borrarlo de Clerk
        const findUserResult = await client.query(
            "SELECT clerk_id FROM app.usuarios WHERE id = $1 AND rol = 'lider'",
            [id]
        );

        if (findUserResult.rows.length === 0) {
            return res.status(404).json({ error: "Líder no encontrado en la base de datos" });
        }

        const { clerk_id } = findUserResult.rows[0];

        // 2. Iniciamos la transacción para borrar en local
        await client.query("BEGIN");

        // Primero borramos las relaciones en lider_grupo
        await client.query(
            "DELETE FROM app.lider_grupo WHERE lider_id = $1",
            [id]
        );

        // Luego borramos el usuario
        await client.query(
            "DELETE FROM app.usuarios WHERE id = $1",
            [id]
        );

        // 3. Si todo va bien en la BD, lo borramos de Clerk
        if (clerk_id) {
            try {
                await clerkClient.users.deleteUser(clerk_id);
            } catch (clerkErr) {
                // Si el usuario ya había sido borrado manualmente en el panel de Clerk,
                // ignoramos el error para permitir que se limpie de la base de datos local
                if (clerkErr.status !== 404) {
                    throw new Error(`Error en Clerk: ${clerkErr.message}`);
                }
                console.log("El usuario no existía en Clerk (posiblemente borrado manualmente), procediendo localmente.");
            }
        }

        // Confirmamos los cambios en PostgreSQL
        await client.query("COMMIT");
        res.status(200).json({ mensaje: "Líder eliminado de forma sincronizada con éxito" });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error al eliminar el líder:", err);
        res.status(500).json({ 
            error: "No se pudo eliminar el líder", 
            details: err.message || err 
        });
    } finally {
        client.release();
    }
});

export default router;