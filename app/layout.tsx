import type React from "react"
import { Nunito_Sans, Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
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
    <html lang="en" className={`${nunitoSans.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
