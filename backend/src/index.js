import 'dotenv/config';

import express from "express";
import cors from "cors";
import pool from "./db.js";
import gruposRouter from "./routes/grupos.js";
import clerkWebhookRouter from "./routes/clerkWebhook.js";
import estudiantesRouter from "./routes/estudiantes.js"
import reportesRouter from "./routes/reportes.js"
import lideresRouter from "./routes/lideres.js"

const app = express();
app.use(cors());
app.use("/api/webhook-clerk", clerkWebhookRouter);
app.use(express.json());

app.use("/api/grupos", gruposRouter);
app.use("/api/estudiantes", estudiantesRouter);
app.use("/api/reportes", reportesRouter);
app.use("/api/lideres", lideresRouter);

app.get("/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT now()");
        res.json({ status: "ok", hora_servidor: result.rows[0].now});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", detalle: error.message});
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
