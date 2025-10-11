import { pool } from "../shared/db.js"

export async function createAuditLog({ entityType, entityId, action, performedBy, metadata }) {
  await pool.query(
    `INSERT INTO audit_logs (entity_type, entity_id, action, performed_by, metadata_json, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [entityType, String(entityId), action, performedBy || null, metadata ? JSON.stringify(metadata) : null],
  )
}
