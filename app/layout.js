import './globals.css'
import { Providers } from './providers'

export const metadata = {
  metadataBase: new URL('https://bluff-and-exit.preview.emergentagent.com'),
  title: {
    default: 'EXIT 52™ — The Bluffing Card Game',
    template: '%s — EXIT 52™',
  },
  description:
    'EXIT 52™ is a fast-paced card game combining strategy, bluffing and optional digital gameplay. Play online, connect your physical deck and find your EXIT.',
  keywords: ['EXIT 52', 'card game', 'bluffing game', 'strategy card game', 'digital card game'],
  openGraph: {
    title: 'EXIT 52™ — The Bluffing Card Game',
    description:
      'Play your cards. Find your EXIT. A fast-paced bluffing card game with optional digital browser play.',
    type: 'website',
    siteName: 'EXIT 52',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EXIT 52™ — The Bluffing Card Game',
    description: 'Play your cards. Find your EXIT.',
  },
  icons: {
    icon: [{ url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230a0a0b'/%3E%3Ctext x='16' y='23' font-family='Arial' font-size='20' font-weight='bold' fill='%23e63946' text-anchor='middle'%3E52%3C/text%3E%3C/svg%3E" }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="grain">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
