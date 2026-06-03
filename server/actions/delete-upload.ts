"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadedFile(fileKey: string) {
  if (!fileKey) return { success: false };

  const key = fileKey.startsWith("http") ? fileKey.split("/f/")[1] : fileKey;

  if (!key) return { success: false };

  await utapi.deleteFiles(key);
  return { success: true };
}
