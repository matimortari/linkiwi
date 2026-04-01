import { Buffer } from "node:buffer"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const r2Endpoint = requireEnv("R2_ENDPOINT")
const r2AccessKeyId = requireEnv("R2_ACCESS_KEY_ID")
const r2SecretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY")
const r2BucketName = requireEnv("R2_BUCKET_NAME")
const r2PublicUrl = requireEnv("R2_PUBLIC_URL")

export const s3 = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: { accessKeyId: r2AccessKeyId, secretAccessKey: r2SecretAccessKey },
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

  const key = `${path}/${Date.now()}.${file.name.split(".").pop()?.toLowerCase()}`
  const buffer = await file.arrayBuffer()
  await s3.send(new PutObjectCommand({ Bucket: r2BucketName, Key: key, Body: Buffer.from(buffer), ContentType: file.type }))
  if (oldFile) {
    await deleteFile(oldFile).catch(() => {})
  }

  return `${r2PublicUrl}/${key}`
}

/**
 * Deletes a file from Blob storage given its URL.
 */
export async function deleteFile(url: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: r2BucketName, Key: url.replace(`${r2PublicUrl}/`, "") }))
}
