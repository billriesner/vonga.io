import { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CTAGroupProps {
  primary: {
    label: string;
    href: string;
    dataEvent?: string;
  };
  secondary: {
    label: string;
    href: string;
    dataEvent?: string;
  };
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function CTAGroup({ 
  primary, 
  secondary, 
  className = "",
  orientation = "horizontal"
}: CTAGroupProps) {
  return (
    <div className={cn(
      "flex gap-4 justify-center",
      orientation === "vertical" ? "flex-col sm:flex-row" : "flex-col sm:flex-row",
      className
    )}>
      <Button 
        size="lg" 
        variant="primary"
        data-event={primary.dataEvent}
        asChild
      >
        <a href={primary.href}>{primary.label}</a>
      </Button>
      <Button 
        size="lg" 
        variant="secondary"
        data-event={secondary.dataEvent}
        asChild
      >
        <a href={secondary.href}>{secondary.label}</a>
      </Button>
    </div>
  );
}
