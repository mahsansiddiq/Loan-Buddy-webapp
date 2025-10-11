import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  // If on EC2 with role, credentials are automatically provided by the instance profile
  // If running locally, ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set
})

export async function getPresignedPutUrl({ key, contentType }) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "private", // keep private by default
  })
  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }) // 5 minutes
  return { url }
}
