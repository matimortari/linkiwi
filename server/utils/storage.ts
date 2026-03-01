import { Buffer } from "node:buffer"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

/**
 * Uploads a file to Blob storage and removes the previous file if provided.
 * Validates file size and MIME type before upload.
 */
export async function uploadFile({ path, file, maxSize, allowedMimeTypes, oldFile }: { path: string, file: File, maxSize: number, allowedMimeTypes: string[], oldFile?: string }) {
  if (!file || !(file instanceof File)) {
    throw createError({ status: 400, statusText: "No file uploaded" })
  }
  if (allowedMimeTypes.length && !allowedMimeTypes.includes(file.type)) {
    throw createError({ status: 415, statusText: `Unsupported file type: ${file.type}` })
  }
  if (file.size > maxSize) {
    throw createError({ status: 413, statusText: "File too large" })
  }

  const ext = file.name.split(".").pop()?.toLowerCase()
  const key = `${path}/${Date.now()}.${ext}`
  const buffer = await file.arrayBuffer()

  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  }))
  if (oldFile) {
    await deleteFile(oldFile).catch(() => {})
  }

  return `${process.env.R2_PUBLIC_URL}/${key}`
}

/**
 * Deletes a file from Blob storage given its URL.
 */
export async function deleteFile(url: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME!, Key: url.replace(`${process.env.R2_PUBLIC_URL}/`, "") }))
}
