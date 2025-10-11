import express from "express"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { createUser, findUserByEmail, verifyPassword } from "../models/User.js"

export const authRouter = express.Router()

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(["borrower", "lender", "admin"]),
  password: z.string().min(6),
  nicNumber: z.string().optional(),
  nicImageKey: z.string().optional(),
  nicImageUrl: z.string().url().optional(),
})

authRouter.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)
    const exists = await findUserByEmail(data.email)
    if (exists) return res.status(409).json({ error: "Email already registered" })

    const user = await createUser(data)

    const token = jwt.sign({ sub: String(user.id), role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        nicImageUrl: user.nicImageUrl,
      },
    })
  } catch (err) {
    next(err)
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

authRouter.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await findUserByEmail(data.email)
    if (!user) return res.status(401).json({ error: "Invalid credentials" })
    const ok = await verifyPassword(user, data.password)
    if (!ok) return res.status(401).json({ error: "Invalid credentials" })
    const token = jwt.sign({ sub: String(user.id), role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        nicImageUrl: user.nicImageUrl,
      },
    })
  } catch (err) {
    next(err)
  }
})
