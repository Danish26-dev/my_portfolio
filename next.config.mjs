/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  eslint: { ignoreDuringBuilds: true },
  // Accept both the NEXT_PUBLIC_* names and the short names (SITE_URL, WEB3FORMS_KEY) set on Vercel.
  // Both values are public by design and are inlined into the client bundle at build time.
  env: {
    NEXT_PUBLIC_SITE_URL: (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "").trim().replace(/\/+$/, ""),
    NEXT_PUBLIC_WEB3FORMS_KEY: (process.env.NEXT_PUBLIC_WEB3FORMS_KEY || process.env.WEB3FORMS_KEY || "").trim(),
  },
};

export default nextConfig;
