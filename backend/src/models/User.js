import bcrypt from "bcryptjs"
import { pool } from "../shared/db.js"

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email])
  return rows[0] || null
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, role, nic_number as nicNumber, nic_image_key as nicImageKey, nic_image_url as nicImageUrl, is_active as isActive, created_at as createdAt FROM users WHERE id = ? LIMIT 1",
    [id],
  )
  return rows[0] || null
}

export async function verifyPassword(user, plain) {
  return bcrypt.compare(plain, user.password_hash)
}

export async function createUser({ name, email, phone, role, password, nicNumber, nicImageKey, nicImageUrl }) {
  const passwordHash = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    `INSERT INTO users (name, email, phone, role, password_hash, nic_number, nic_image_key, nic_image_url, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
    [
      name,
      email.toLowerCase(),
      phone || null,
      role,
      passwordHash,
      nicNumber || null,
      nicImageKey || null,
      nicImageUrl || null,
    ],
  )
  const id = result.insertId
  return await findUserById(id)
}

export async function updateUserById(id, data) {
  // Build dynamic update
  const fields = []
  const values = []
  if (data.name !== undefined) {
    fields.push("name = ?")
    values.push(data.name)
  }
  if (data.phone !== undefined) {
    fields.push("phone = ?")
    values.push(data.phone)
  }
  if (data.nicNumber !== undefined) {
    fields.push("nic_number = ?")
    values.push(data.nicNumber)
  }
  if (data.nicImageKey !== undefined) {
    fields.push("nic_image_key = ?")
    values.push(data.nicImageKey)
  }
  if (data.nicImageUrl !== undefined) {
    fields.push("nic_image_url = ?")
    values.push(data.nicImageUrl)
  }

  if (!fields.length) return await findUserById(id)

  values.push(id)
  await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values)
  return await findUserById(id)
}
