import type React from "react"
import { Encode_Sans, Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const encodeSans = Encode_Sans({
  subsets: ["latin"],
  variable: "--font-encode-sans",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: "LoanBuddy - Loan Management System",
  description: "Secure and user-friendly loan management platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${encodeSans.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
