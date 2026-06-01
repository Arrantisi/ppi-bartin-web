const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function absoluteUrl(path: string) {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultOgImage = {
  url: absoluteUrl("/og-image.jpg"),
  width: 1200,
  height: 630,
  alt: "PPI Bartin",
};
