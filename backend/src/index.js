import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./db.js";
import clerkWebhookRouter from "./routes/clerkWebhook.js";

const app = express();
app.use(cors());
app.use("/api/webhook-clerk", clerkWebhookRouter);
app.use(express.json());

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
