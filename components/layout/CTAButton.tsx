"use client";

import { Button } from "@/components/ui/button";

interface CTAButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "coral" | "outline";
  size?: "sm" | "md" | "lg";
}

export function CTAButton({
  text = "Let's Connect",
  href = "#contact",
  onClick,
  variant = "coral",
  size = "md"
}: CTAButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }

    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button asChild variant={variant} size={size}>
      <a href={href} onClick={handleClick}>
        {text}
      </a>
    </Button>
  );
}
