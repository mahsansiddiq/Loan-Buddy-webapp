import express from "express"
import { z } from "zod"
import { requireAuth, requireRoles } from "../middleware/auth.js"
import { createLoan, getLoansList, getLoanById, reviewLoan, acceptLoan, applyPayment } from "../models/Loan.js"
import { createPayment } from "../models/Payment.js"
import { createAuditLog } from "../models/AuditLog.js"

export const loansRouter = express.Router()

const createLoanSchema = z.object({
  principal: z.number().positive(),
  termMonths: z.number().int().positive(),
  purpose: z.string().optional(),
  witnesses: z
    .array(
      z.object({
        name: z.string().min(1),
        nationalCardNumber: z.string().min(3),
        contact: z.string().optional(),
        nicImageKey: z.string().optional(),
        nicImageUrl: z.string().url().optional(),
      }),
    )
    .optional(),
  schedule: z
    .array(
      z.object({
        dueDate: z.coerce.date(),
        amount: z.number().positive(),
      }),
    )
    .optional(),
})

loansRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = createLoanSchema.parse(req.body)
    const loan = await createLoan({
      borrowerId: req.user.sub,
      principal: data.principal,
      termMonths: data.termMonths,
      purpose: data.purpose,
      witnesses: data.witnesses || [],
      schedule: data.schedule || [],
    })
    await createAuditLog({
      entityType: "Loan",
      entityId: loan.id,
      action: "CREATE",
      performedBy: req.user.sub,
      metadata: { principal: loan.principal, termMonths: loan.termMonths },
    })
    res.status(201).json({ loan })
  } catch (err) {
    next(err)
  }
})

loansRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const { status, role } = req.query
    const loans = await getLoansList({
      userId: req.user.sub,
      role: role || req.user.role,
      status,
    })
    res.json({ loans })
  } catch (err) {
    next(err)
  }
})

loansRouter.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" })
    const loan = await getLoanById(id)
    if (!loan) return res.status(404).json({ error: "Not found" })
    res.json({ loan })
  } catch (err) {
    next(err)
  }
})

const reviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  schedule: z
    .array(
      z.object({
        dueDate: z.coerce.date(),
        amount: z.number().positive(),
      }),
    )
    .optional(),
})

loansRouter.post("/:id/review", requireAuth, requireRoles("lender", "admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = reviewSchema.parse(req.body)
    const loan = await reviewLoan({ loanId: id, lenderId: req.user.sub, action: data.action, schedule: data.schedule })
    if (!loan) return res.status(404).json({ error: "Not found" })
    await createAuditLog({
      entityType: "Loan",
      entityId: id,
      action: data.action.toUpperCase(),
      performedBy: req.user.sub,
    })
    res.json({ loan })
  } catch (err) {
    next(err)
  }
})

const acceptSchema = z.object({
  party: z.enum(["borrower", "lender"]),
  agreementS3Key: z.string().optional(),
  agreementS3Url: z.string().url().optional(),
})

loansRouter.post("/:id/accept", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = acceptSchema.parse(req.body)
    const loan = await acceptLoan({
      loanId: id,
      party: data.party,
      agreementS3Key: data.agreementS3Key,
      agreementS3Url: data.agreementS3Url,
    })
    if (!loan) return res.status(404).json({ error: "Not found" })
    await createAuditLog({
      entityType: "Loan",
      entityId: id,
      action: "ACCEPT",
      performedBy: req.user.sub,
      metadata: { party: data.party },
    })
    res.json({ loan })
  } catch (err) {
    next(err)
  }
})

const paymentSchema = z.object({
  amount: z.number().positive(),
  paymentDate: z.coerce.date(),
  method: z.string().optional(),
  note: z.string().optional(),
})

loansRouter.post("/:id/payments", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = paymentSchema.parse(req.body)
    // create payment record
    const payment = await createPayment({
      loanId: id,
      payerId: req.user.sub,
      amount: data.amount,
      paymentDate: data.paymentDate,
      method: data.method,
      note: data.note,
    })
    // update schedule and possibly status
    await applyPayment({ loanId: id, payerId: req.user.sub, amount: data.amount, paymentDate: data.paymentDate })
    const loan = await getLoanById(id)

    await createAuditLog({
      entityType: "Payment",
      entityId: payment.id,
      action: "CREATE",
      performedBy: req.user.sub,
      metadata: { loanId: id },
    })
    res.status(201).json({ payment, loan })
  } catch (err) {
    next(err)
  }
})
