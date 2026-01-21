"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-accent backdrop-blur shadow-lg" style={{ background: 'rgba(48, 62, 85, 0.95)' }}>
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/images/logos/logo.svg" alt="Vonga" className="h-40 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(68%) sepia(66%) saturate(459%) hue-rotate(140deg) brightness(94%) contrast(87%)' }} />
          </Link>

          {/* Right Side - Buttons + Burger Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-3">
              <Button variant="cyan" size="sm" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/intake">Let's Connect</Link>
              </Button>
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" style={{ color: '#33BECC' }}>
                  <Menu className="h-6 w-6" style={{ color: '#33BECC' }} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center justify-center pb-4 border-b border-accent/30">
                    <img src="/images/logos/logo.svg" alt="Vonga" className="h-40 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(68%) sepia(66%) saturate(459%) hue-rotate(140deg) brightness(94%) contrast(87%)' }} />
                  </div>
                  
                  {/* Solutions */}
                  <div className="text-center">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#33BECC' }}>Solutions</h3>
                    <nav className="flex flex-col space-y-2">
                      <Link
                        href="/sports-teams"
                        className="text-base font-medium text-foreground hover:text-accent transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Teams & Leagues
                      </Link>
                      <Link
                        href="/schools"
                        className="text-base font-medium text-foreground hover:text-accent transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Schools & Universities
                      </Link>
                      <Link
                        href="/creators"
                        className="text-base font-medium text-foreground hover:text-accent transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Creators & Communities
                      </Link>
                      <Link
                        href="/studios-clubs"
                        className="text-base font-medium text-foreground hover:text-accent transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Studios & Clubs
                      </Link>
                    </nav>
                  </div>

                  {/* Company */}
                  <div className="text-center">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#33BECC' }}>Company</h3>
                    <nav className="flex flex-col space-y-2">
                      <Link
                        href="/how-it-works"
                        className="text-base font-medium text-foreground hover:text-accent transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        How It Works
                      </Link>
                      <Link
                        href="/about"
                        className="text-base font-medium text-foreground hover:text-accent transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        About
                      </Link>
                    </nav>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-accent/30 items-center">
                    <Button variant="cyan" asChild>
                      <Link href="/how-it-works" onClick={() => setIsOpen(false)}>
                        See How It Works
                      </Link>
                    </Button>
                    <Button variant="primary" asChild>
                      <Link href="/intake" onClick={() => setIsOpen(false)}>
                        Let's Connect
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
