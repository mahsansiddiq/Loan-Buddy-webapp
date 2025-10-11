import express from "express"
import { requireAuth } from "../middleware/auth.js"
import { findUserById, updateUserById } from "../models/User.js"
import { z } from "zod"

export const usersRouter = express.Router()

usersRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await findUserById(req.user.sub)
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  nicNumber: z.string().optional(),
  nicImageKey: z.string().optional(),
  nicImageUrl: z.string().url().optional(),
})

usersRouter.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body)
    const user = await updateUserById(req.user.sub, data)
    res.json({ user })
  } catch (err) {
    next(err)
  }
})
