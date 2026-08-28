export default function robots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://bluff-and-exit.preview.emergentagent.com'
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  }
}
