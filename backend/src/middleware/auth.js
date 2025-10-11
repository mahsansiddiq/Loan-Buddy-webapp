import jwt from "jsonwebtoken"
import { findUserById } from "../models/User.js"

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ""
    const token = header.startsWith("Bearer ") ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: "Unauthorized" })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: "Unauthorized" })
  }
}

export function requireRoles(...roles) {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" })
      const user = await findUserById(req.user.sub)
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden" })
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
