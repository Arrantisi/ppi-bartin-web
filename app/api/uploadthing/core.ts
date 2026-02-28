import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  onOploadFile: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { key: file.key, url: file.ufsUrl, name: file.name };
  }),

  onOploadProfile: f({
    image: { maxFileSize: "1MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    return { key: file.key };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
