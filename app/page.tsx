"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="font-sans text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-secondary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Image src="/logo.svg" alt="LoanBuddy" width={150} height={45} />
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-white bg-transparent"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[40px] rounded-[10px]"
              asChild
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-balance mb-6 text-foreground leading-tight">
                We help you reach your full potential.
              </h1>
              <p className="text-lg font-sans text-muted-foreground text-pretty mb-8 max-w-xl leading-relaxed">
                Connect borrowers and lenders in a secure, transparent platform. Track loans, manage repayments, and
                build trust in your financial relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] rounded-[10px] font-sans font-medium"
                  asChild
                >
                  <Link href="/register">Apply for Loan</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-white min-h-[48px] rounded-[10px] font-sans font-medium bg-transparent"
                  asChild
                >
                  <Link href="/register">Start Lending</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 transform rotate-2">
                <Image
                  src="/modern-loan-management-dashboard-interface.jpg"
                  alt="LoanBuddy Dashboard"
                  width={500}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-4 text-foreground">
              Why LoanBuddy?
            </h2>
            <p className="text-lg font-sans text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage loans efficiently and securely
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-secondary text-white p-6 rounded-2xl">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Secure & Trusted</h3>
                <p className="font-sans text-white/90 leading-relaxed">
                  Bank-level security with transparent loan agreements and digital signatures.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">Smart Tracking</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  Automated repayment schedules, progress tracking, and timely reminders.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-tertiary/20 p-6 rounded-2xl border border-tertiary/30">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-tertiary rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-tertiary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">Easy Management</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  Intuitive dashboards for borrowers, lenders, and administrators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-6 text-foreground">
                Browse all options.
              </h2>
              <p className="text-lg font-sans text-muted-foreground mb-8 leading-relaxed">
                From personal loans to business financing, find the perfect loan option that matches your needs and
                financial goals.
              </p>
              <Button
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 min-h-[48px] rounded-[10px] font-sans font-medium"
                asChild
              >
                <Link href="/register">Explore Loans</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white p-4 rounded-xl shadow-sm border border-border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"
                    />
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-foreground">Personal</h3>
              </Card>
              <Card className="bg-white p-4 rounded-xl shadow-sm border border-border text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-foreground">Business</h3>
              </Card>
              <Card className="bg-white p-4 rounded-xl shadow-sm border border-border text-center">
                <div className="w-12 h-12 bg-tertiary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-foreground">Mortgage</h3>
              </Card>
              <Card className="bg-white p-4 rounded-xl shadow-sm border border-border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-foreground">Education</h3>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-8">Simple 5 step Process.</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary-foreground">1</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold mb-1">Create Account</h3>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">Sign up and verify your identity</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary-foreground">2</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold mb-1">Submit Application</h3>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Fill out your loan application with required documents
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary-foreground">3</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold mb-1">Get Matched</h3>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Our system matches you with suitable lenders
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary-foreground">4</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold mb-1">Review & Accept</h3>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Review loan terms and digitally sign agreement
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary-foreground">5</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold mb-1">Receive Funds</h3>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Get your loan amount deposited to your account
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/loan-application-process-illustration.jpg"
                alt="Loan Process"
                width={500}
                height={400}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-4 text-foreground">
              We Are Trusted.
            </h2>
            <p className="text-lg font-sans text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied borrowers and lenders who trust LoanBuddy
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white p-8 rounded-2xl shadow-sm border border-border">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-serif font-bold">JD</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">John Davis</h4>
                    <p className="font-sans text-sm text-muted-foreground">Small Business Owner</p>
                  </div>
                </div>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  "LoanBuddy made it incredibly easy to get the funding I needed for my business expansion. The process
                  was transparent and the support team was amazing."
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white p-8 rounded-2xl shadow-sm border border-border">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-secondary-foreground font-serif font-bold">SM</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">Sarah Miller</h4>
                    <p className="font-sans text-sm text-muted-foreground">Real Estate Investor</p>
                  </div>
                </div>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  "As a lender, I appreciate the security and transparency LoanBuddy provides. I can confidently invest
                  knowing all parties are protected."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-4 text-foreground">FAQs.</h2>
          </div>
          <Card className="bg-secondary text-white p-8 rounded-2xl">
            <CardContent className="p-0">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-semibold mb-2">How secure is my information?</h3>
                  <p className="font-sans text-white/90 leading-relaxed">
                    We use bank-level encryption and security measures to protect all your personal and financial
                    information.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif font-semibold mb-2">What types of loans are available?</h3>
                  <p className="font-sans text-white/90 leading-relaxed">
                    We offer personal loans, business loans, mortgages, and education loans with competitive rates.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif font-semibold mb-2">How long does the approval process take?</h3>
                  <p className="font-sans text-white/90 leading-relaxed">
                    Most applications are reviewed within 24-48 hours, with funds available shortly after approval.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance mb-4 text-foreground">Contact Us.</h2>
            <p className="text-lg font-sans text-muted-foreground">
              Ready to get started? Get in touch with our team today.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white p-8 rounded-2xl shadow-sm border border-border">
              <CardContent className="p-0">
                <h3 className="font-serif font-semibold text-xl mb-4 text-foreground">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-sans text-muted-foreground">support@loanbuddy.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <span className="font-sans text-muted-foreground">1-800-LOANBUDDY</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary text-white p-8 rounded-2xl">
              <CardContent className="p-0">
                <h3 className="font-serif font-semibold text-xl mb-6">Ready to Start?</h3>
                <p className="font-sans text-white/90 mb-6 leading-relaxed">
                  Join thousands of users who trust LoanBuddy for their lending and borrowing needs.
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] rounded-[10px] font-sans font-medium w-full"
                  asChild
                >
                  <Link href="/register">Get Started Today</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image src="/logo.svg" alt="LoanBuddy" width={120} height={36} className="mb-4 brightness-0 invert" />
              <p className="font-sans text-sm text-background/80 leading-relaxed">
                Secure and transparent loan management platform connecting borrowers and lenders.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Products</h4>
              <ul className="space-y-2 font-sans text-sm text-background/80">
                <li>Personal Loans</li>
                <li>Business Loans</li>
                <li>Mortgages</li>
                <li>Education Loans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Company</h4>
              <ul className="space-y-2 font-sans text-sm text-background/80">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Support</h4>
              <ul className="space-y-2 font-sans text-sm text-background/80">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center">
            <p className="font-sans text-sm text-background/60">&copy; 2025 LoanBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
