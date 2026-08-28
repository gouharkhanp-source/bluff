export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://bluff-and-exit.preview.emergentagent.com'
  const routes = ['', '/home', '/how-to-play', '/explainer', '/editions', '/prebook', '/faq', '/rules', '/play', '/privacy', '/terms']
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date(), changeFrequency: 'weekly', priority: r === '/home' || r === '' ? 1 : 0.7 }))
}
