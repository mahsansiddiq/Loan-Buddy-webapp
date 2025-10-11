import { RegisterForm } from "@/components/auth/register-form"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image src="/brand/logo-wordmark.svg" alt="LoanBuddy" width={200} height={60} className="mx-auto mb-4" />
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
