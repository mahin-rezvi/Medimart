"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SignIn, SignUp } from "@clerk/nextjs";

export function ClerkSignInRedirect() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") ?? "/";

  const redirectUrl = useMemo(() => {
    if (typeof window === "undefined") return "/";
    if (redirectParam.startsWith("/")) {
      return `${window.location.origin}${redirectParam}`;
    }
    return `${window.location.origin}/`;
  }, [redirectParam]);

  return (
    <SignIn
      path="/login"
      signUpUrl="/register"
      forceRedirectUrl={redirectUrl}
      routing="path"
    />
  );
}

export function ClerkSignUpRedirect() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") ?? "/";

  const redirectUrl = useMemo(() => {
    if (typeof window === "undefined") return "/";
    if (redirectParam.startsWith("/")) {
      return `${window.location.origin}${redirectParam}`;
    }
    return `${window.location.origin}/`;
  }, [redirectParam]);

  return (
    <SignUp
      path="/register"
      signInUrl="/login"
      forceRedirectUrl={redirectUrl}
      routing="path"
    />
  );
}
