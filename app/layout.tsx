import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TanstackProvider } from "@/components/providers/tanstack";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "PPI Bartin App",
  description: "Portal Mahasiswa Indonesia di Bartin",
  icons: {
    icon: "/logo-ppi.png",
    apple: "/logo-ppi.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PPI Bartin",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "PPI Bartin",
    title: "PPI Bartin",
    description: "Portal Mahasiswa Indonesia di Bartin",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PPI Bartin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PPI Bartin",
    description: "Portal Mahasiswa Indonesia di Bartin",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <meta name="theme-color" content="#2563eb" />
      <body className={`antialiased min-h-screen w-full relative`}>
        <main>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TanstackProvider>
              <Toaster position="top-center" />
              <SpeedInsights />
              {children}
            </TanstackProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
