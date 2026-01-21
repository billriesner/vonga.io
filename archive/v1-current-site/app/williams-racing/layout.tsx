import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthWrapper } from "./AuthWrapper";

export const metadata: Metadata = {
  title: "Live Connected. Williams Racing Everywhere. | Vonga",
  description: "Turn your team apparel into an always-on fan touchpoint. From the Paddock to the rest of the world.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WilliamsRacingLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('williams-auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  return <>{children}</>;
}

