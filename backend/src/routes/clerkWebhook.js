import { Router } from "express";
import express from "express";
import pool from "../db.js";

const router = Router();

// Parser de JSON estándar para desarrollo local con túneles
router.post("/", express.json(), async (req, res) => {
    console.log("--- [MODO DESARROLLO] PROCESANDO WEBHOOK DE CLERK ---");

    const evt = req.body;

    if (!evt || !evt.type) {
        console.error("El cuerpo de la petición no contiene un evento válido de Clerk");
        return res.status(400).send("Formato inválido");
    }

    const { type, data } = evt;
    console.log("Evento detectado:", type);

    try { // <-- Aquí abrimos el bloque try que faltaba corporativo
        if (type === "user.created") {
            console.log("Insertando usuario creado:", data.id);

            // Si Clerk no envía un correo (como en el payload de prueba), le asignamos uno genérico temporal
            const email = data.email_addresses?.[0]?.email_address || `test_${data.id}@example.com`;

            await pool.query(
                `INSERT INTO usuarios (clerk_id, nombre, correo, rol)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (clerk_id) DO NOTHING`,
                [
                    data.id,
                    `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Usuario Clerk",
                    email, 
                    data.public_metadata?.role || "lider",
                ]
            );
        }

        if (type === "user.updated") {
            console.log("Actualizando usuario:", data.id);
            
            // Protegemos también el correo en caso de updates de prueba de Clerk
            const email = data.email_addresses?.[0]?.email_address || `test_${data.id}@example.com`;

            await pool.query(
                `UPDATE usuarios
                SET nombre = $1, correo = $2, rol = $3, updated_at = now()
                WHERE clerk_id = $4`,
                [
                    `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Usuario Clerk",
                    email,
                    data.public_metadata?.role || "lider",
                    data.id,
                ]
            );
        }

        if (type === "user.deleted") {
            console.log("Desactivando usuario:", data.id);
            await pool.query(
                `UPDATE usuarios SET activo = false, updated_at = now() WHERE clerk_id = $1`,
                [data.id]
            );
        }

        console.log(`¡Evento ${type} procesado y guardado con éxito en Supabase!`);
        return res.status(200).send("ok");

    } catch (err) { // <-- El bloque catch ahora funciona perfectamente
        console.error("Error al interactuar con PostgreSQL:", err.message);
        return res.status(500).send("Error interno de BD");
    }
});

export default router;