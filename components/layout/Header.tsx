"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  transparent?: boolean;
  ctaHref?: string;
  ctaText?: string;
}

export function Header({ 
  transparent = true, 
  ctaHref = "#contact",
  ctaText = "Let's Connect" 
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ctaHref.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(ctaHref);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        transparent && !scrolled
          ? "bg-transparent"
          : "bg-white shadow-sm"
      )}
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="h-16 w-auto overflow-hidden">
                <img 
                  src="/images/logos/logo.svg" 
                  alt="Vonga" 
                  className="h-40 w-auto"
                  style={{ 
                    filter: 'invert(64%) sepia(88%) saturate(425%) hue-rotate(138deg) brightness(95%) contrast(92%)',
                    marginTop: '-48px'
                  }}
                />
              </div>
            </Link>
          </div>

          {/* CTA Button */}
          <div>
            <Button asChild variant="coral" size="sm">
              <a href={ctaHref} onClick={handleCtaClick}>
                {ctaText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
