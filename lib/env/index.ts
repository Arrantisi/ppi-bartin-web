import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		SHADOW_DATABASE_URL: z.url(),
		BETTER_AUTH_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		UPLOADTHING_TOKEN: z.string().min(1),
		// Phase 3: opsional agar build lolos sebelum Service Account dibuat admin.
		GOOGLE_SHEET_ID: z.string().min(1).optional(),
		GOOGLE_CLIENT_EMAIL: z.string().min(1).optional(),
		GOOGLE_PRIVATE_KEY: z.string().min(1).optional(),
		// Preview UI tanpa Google API. Tidak boleh diaktifkan di produksi.
		FINANCE_USE_DUMMY_DATA: z.enum(["true", "false"]).optional(),
	},
	client: {
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
		NEXT_PUBLIC_SUPABASE_URL: z.url(),
		// Phase 1 finale: opsional agar build tetap lolos sebelum link dari bendahara tersedia.
		NEXT_PUBLIC_FINANCE_SHEET_URL: z.url().optional(),
	},
	clientPrefix: "NEXT_PUBLIC_",
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		NEXT_PUBLIC_FINANCE_SHEET_URL:
			process.env.NEXT_PUBLIC_FINANCE_SHEET_URL,
		UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
		GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
		GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
		GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
		FINANCE_USE_DUMMY_DATA: process.env.FINANCE_USE_DUMMY_DATA,
	},
	emptyStringAsUndefined: true,
});
