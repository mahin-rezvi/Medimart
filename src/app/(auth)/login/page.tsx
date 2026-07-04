import { Suspense } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ClerkSignInRedirect } from "@/components/auth/clerk-auth-redirect";

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-brand-100 dark:border-brand-900">
          <Sparkles className="w-3 h-3" />
          Welcome back
        </div>
        <h1 className="font-display text-3xl font-black text-foreground leading-tight">
          Sign in to your<br />
          <span className="text-brand-600">account</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-600 font-semibold hover:underline">
            Create one free →
          </Link>
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900/80 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/40 p-4 sm:p-7 backdrop-blur-sm">
        <Suspense fallback={null}>
          <ClerkSignInRedirect />
        </Suspense>
      </div>
    </div>
  );
}
