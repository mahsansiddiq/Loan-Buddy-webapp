import { pool } from "../shared/db.js"

export async function createLoan({ borrowerId, principal, termMonths, purpose, witnesses = [], schedule = [] }) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [res] = await conn.query(
      `INSERT INTO loans (borrower_id, lender_id, principal, term_months, purpose, status, created_at)
       VALUES (?, NULL, ?, ?, ?, 'PENDING', NOW())`,
      [borrowerId, principal, termMonths, purpose || null],
    )
    const loanId = res.insertId

    if (witnesses.length) {
      const values = witnesses.map((w) => [
        loanId,
        w.name,
        w.nationalCardNumber,
        w.contact || null,
        w.nicImageKey || null,
        w.nicImageUrl || null,
      ])
      await conn.query(
        `INSERT INTO witnesses (loan_id, name, national_card_number, contact, nic_image_key, nic_image_url)
         VALUES ?`,
        [values],
      )
    }

    if (schedule.length) {
      const values = schedule.map((s) => [loanId, s.dueDate, s.amount, 0, null])
      await conn.query(
        `INSERT INTO repayment_schedule (loan_id, due_date, amount, paid, paid_at)
         VALUES ?`,
        [values],
      )
    }

    await conn.commit()
    return await getLoanById(loanId)
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

export async function getLoansList({ userId, role, status }) {
  const clauses = []
  const params = []
  if (status) {
    clauses.push("l.status = ?")
    params.push(status)
  }
  if (role === "borrower") {
    clauses.push("l.borrower_id = ?")
    params.push(userId)
  } else if (role === "lender") {
    clauses.push("(l.lender_id = ? OR l.status = 'PENDING')")
    params.push(userId)
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""
  const [rows] = await pool.query(
    `SELECT l.id, l.borrower_id as borrowerId, l.lender_id as lenderId, l.principal, l.term_months as termMonths, l.purpose, l.status, l.created_at as createdAt, l.activated_at as activatedAt
     FROM loans l
     ${where}
     ORDER BY l.created_at DESC`,
    params,
  )
  return rows
}

export async function getLoanById(id) {
  const [[loan]] = await pool.query(
    `SELECT id, borrower_id as borrowerId, lender_id as lenderId, principal, term_months as termMonths, purpose, status,
            borrower_accepted_at as borrowerAcceptedAt, lender_accepted_at as lenderAcceptedAt,
            agreement_s3_key as agreementS3Key, agreement_s3_url as agreementS3Url,
            created_at as createdAt, activated_at as activatedAt, repaid_at as repaidAt
     FROM loans WHERE id = ?`,
    [id],
  )
  if (!loan) return null
  const [witnesses] = await pool.query(
    `SELECT name, national_card_number as nationalCardNumber, contact, nic_image_key as nicImageKey, nic_image_url as nicImageUrl
     FROM witnesses WHERE loan_id = ?`,
    [id],
  )
  const [schedule] = await pool.query(
    `SELECT id, due_date as dueDate, amount, paid, paid_at as paidAt
     FROM repayment_schedule WHERE loan_id = ? ORDER BY due_date ASC`,
    [id],
  )
  return { ...loan, witnesses, schedule }
}

export async function reviewLoan({ loanId, lenderId, action, schedule }) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [[current]] = await conn.query(`SELECT status, principal, term_months FROM loans WHERE id = ? FOR UPDATE`, [
      loanId,
    ])
    if (!current) return null
    if (current.status !== "PENDING") throw Object.assign(new Error("Loan is not pending"), { status: 400 })

    if (action === "reject") {
      await conn.query(`UPDATE loans SET status = 'REJECTED', lender_id = ? WHERE id = ?`, [lenderId, loanId])
    } else {
      await conn.query(`UPDATE loans SET status = 'APPROVED', lender_id = ? WHERE id = ?`, [lenderId, loanId])
      // replace schedule if provided; else generate equal split
      await conn.query(`DELETE FROM repayment_schedule WHERE loan_id = ?`, [loanId])
      const items =
        Array.isArray(schedule) && schedule.length
          ? schedule
          : equalSplitSchedule(current.principal, current.term_months)
      const values = items.map((s) => [loanId, new Date(s.dueDate), s.amount, 0, null])
      await conn.query(`INSERT INTO repayment_schedule (loan_id, due_date, amount, paid, paid_at) VALUES ?`, [values])
    }

    await conn.commit()
    return await getLoanById(loanId)
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

export async function acceptLoan({ loanId, party, agreementS3Key, agreementS3Url }) {
  const sets = []
  const params = []
  if (party === "borrower") sets.push("borrower_accepted_at = NOW()")
  if (party === "lender") sets.push("lender_accepted_at = NOW()")
  if (agreementS3Key) {
    sets.push("agreement_s3_key = ?")
    params.push(agreementS3Key)
  }
  if (agreementS3Url) {
    sets.push("agreement_s3_url = ?")
    params.push(agreementS3Url)
  }
  if (!sets.length) return await getLoanById(loanId)

  await pool.query(`UPDATE loans SET ${sets.join(", ")} WHERE id = ?`, [...params, loanId])

  // If both accepted, set ACTIVE
  await pool.query(
    `UPDATE loans
       SET status = 'ACTIVE', activated_at = NOW()
     WHERE id = ?
       AND status IN ('APPROVED','ACTIVE')
       AND borrower_accepted_at IS NOT NULL
       AND lender_accepted_at IS NOT NULL`,
    [loanId],
  )

  return await getLoanById(loanId)
}

export async function applyPayment({ loanId, payerId, amount, paymentDate }) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // Insert payment
    await conn.query(
      `INSERT INTO payments (loan_id, payer_id, amount, payment_date, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [loanId, payerId, amount, paymentDate],
    )

    // Greedy mark schedule rows as paid
    const [rows] = await conn.query(
      `SELECT id, amount, paid FROM repayment_schedule
       WHERE loan_id = ? AND paid = 0
       ORDER BY due_date ASC FOR UPDATE`,
      [loanId],
    )

    let remaining = amount
    for (const row of rows) {
      if (!row.paid && remaining + 1e-6 >= row.amount) {
        await conn.query(`UPDATE repayment_schedule SET paid = 1, paid_at = NOW() WHERE id = ?`, [row.id])
        remaining -= row.amount
      }
    }

    // If all paid → mark loan REPAID
    const [[unpaid]] = await conn.query(
      `SELECT COUNT(*) as cnt FROM repayment_schedule WHERE loan_id = ? AND paid = 0`,
      [loanId],
    )
    if (unpaid.cnt === 0) {
      await conn.query(`UPDATE loans SET status = 'REPAID', repaid_at = NOW() WHERE id = ?`, [loanId])
    }

    await conn.commit()
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

function equalSplitSchedule(principal, termMonths) {
  const amount = Math.round((principal / termMonths) * 100) / 100
  const items = []
  const start = new Date()
  for (let i = 1; i <= termMonths; i++) {
    const due = new Date(start)
    due.setMonth(due.getMonth() + i)
    items.push({ dueDate: due, amount })
  }
  return items
}
