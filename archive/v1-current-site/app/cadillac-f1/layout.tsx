import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthWrapper } from "./AuthWrapper";

export const metadata: Metadata = {
  title: "Cadillac F1 × Vonga | Building the next generation of global F1 fandom",
  description: "Building the next generation of global F1 fandom. Vonga brings Cadillac F1 fans closer, everywhere they are.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CadillacF1Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('cadillac-f1-auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  return <>{children}</>;
}

