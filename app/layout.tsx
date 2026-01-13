import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '13F Dashboard | Druckenmiller & Tudor Jones',
  description: 'Track portfolio holdings of Stanley Druckenmiller and Paul Tudor Jones through SEC 13F filings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
