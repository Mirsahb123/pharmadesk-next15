import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pharmadesk - Pharmacy Management',
  description: 'Complete pharmacy management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}