import { Client } from "pg"
import "dotenv/config"

export const client: Client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: Number(process.env.DB_PORT)
})