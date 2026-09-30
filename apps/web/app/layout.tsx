import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { ConfirmDialogProvider } from '@omit/react-confirm-dialog'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'React Confirm Dialog',
  description:
    'A flexible and accessible confirm dialog for React, built on Radix UI and Tailwind CSS.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfirmDialogProvider>
          {children}
          <Analytics />
        </ConfirmDialogProvider>
      </body>
    </html>
  )
}
