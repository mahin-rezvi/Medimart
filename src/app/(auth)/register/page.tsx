import { Suspense } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { ClerkSignUpRedirect } from "@/components/auth/clerk-auth-redirect";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join MediMart today</p>
        </div>

        <Suspense fallback={null}>
          <ClerkSignUpRedirect />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
