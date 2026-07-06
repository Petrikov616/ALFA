import pkg from "pg";
import "dotenv/config";
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // Esto obliga a PostgreSQL a reconocer tu esquema 'app' en cada consulta
    options: "-c search_path=app,public"
});

pool.on("error", (err) => {
    console.error("Error inesperado en el pool de Postgres", err);
});

export default pool;