import { pool } from "../shared/db.js"

export async function createPayment({ loanId, payerId, amount, paymentDate, method, note }) {
  const [res] = await pool.query(
    `INSERT INTO payments (loan_id, payer_id, amount, payment_date, method, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [loanId, payerId, amount, paymentDate, method || null, note || null],
  )
  const [rows] = await pool.query("SELECT * FROM payments WHERE id = ?", [res.insertId])
  return rows[0]
}
