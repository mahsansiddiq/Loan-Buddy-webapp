import mysql from "mysql2/promise"

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env

export const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT || 3306),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function pingDB() {
  const conn = await pool.getConnection()
  try {
    await conn.ping()
    console.log("[backend:mysql] connected")
  } finally {
    conn.release()
  }
}
