import * as z from "zod";

export const customerServiceSchema = z.object({
  catagory: z.string().min(2, "catagory minimal 2 karakter"),
  subject: z.string().min(2, "subject minimal 2 karakter"),
  message: z.string().min(2, "message minimal 2 karakter"),
  level: z.string().min(2, "level minimal 2 karakter"),
  fileKeys: z.array(z.string()).optional(),
});

export type TcustomerServiceSchema = z.infer<typeof customerServiceSchema>;
