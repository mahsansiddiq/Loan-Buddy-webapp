import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import { pingDB } from "./shared/db.js"
import { authRouter } from "./routes/auth.js"
import { usersRouter } from "./routes/users.js"
import { loansRouter } from "./routes/loans.js"
import { uploadsRouter } from "./routes/uploads.js"

const app = express()

// Security and parsing
app.use(helmet())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// CORS
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000"
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
)

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

// Rate limiting (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "dev" })
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/loans", loansRouter)
app.use("/api/uploads", uploadsRouter)

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" })
})

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[backend:error]", err)
  const status = err.status || 500
  res.status(status).json({
    error: err.message || "Internal Server Error",
  })
})

const PORT = process.env.PORT || 8080

// Start server after MySQL ping instead of Mongo connect
pingDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[backend] listening on http://0.0.0.0:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("[backend:mysql] failed to connect", err)
    process.exit(1)
  })
