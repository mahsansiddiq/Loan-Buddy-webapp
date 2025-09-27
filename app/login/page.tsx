import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image src="/logo.svg" alt="LoanBuddy" width={200} height={60} className="mx-auto mb-4" />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
