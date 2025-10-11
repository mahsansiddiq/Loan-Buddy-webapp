import express from "express"
import { z } from "zod"
import { requireAuth } from "../middleware/auth.js"
import { getPresignedPutUrl } from "../shared/s3.js"
import { v4 as uuid } from "uuid"

export const uploadsRouter = express.Router()

const presignSchema = z.object({
  folder: z.string().min(1).optional(), // e.g., "users/{userId}/nic"
  fileName: z.string().optional(), // optional, or we'll generate
  contentType: z.string().min(3),
})

uploadsRouter.post("/presign", requireAuth, async (req, res, next) => {
  try {
    const data = presignSchema.parse(req.body)
    const baseFolder = data.folder || `users/${req.user.sub}/nic`
    const name = data.fileName || `${uuid()}`

    // Recommended NIC key pattern:
    // users/{userId}/nic/{uuid}.jpg
    const key = `${baseFolder}/${name}`

    const { url } = await getPresignedPutUrl({
      key,
      contentType: data.contentType,
    })

    // Construct a public URL if using S3 static hosting or CloudFront
    const base = process.env.PUBLIC_ASSETS_BASE_URL
    const fileUrl = base
      ? `${base}/${key}`
      : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    res.json({
      key,
      uploadUrl: url,
      fileUrl, // store this in DB to render in the frontend
    })
  } catch (err) {
    next(err)
  }
})
