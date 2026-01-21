import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthWrapper } from "./AuthWrapper";

export const metadata: Metadata = {
  title: "Indy Ignite x Vonga | Beyond the Court",
  description: "You're building a new legacy in Indy. Vonga makes sure your fans take it with them—everywhere they go.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function IndyIgniteLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('indy-ignite-auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  return <>{children}</>;
}
