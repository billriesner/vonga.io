import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  eyebrow?: string;
  title?: string;
  description?: string;
  dark?: boolean; // For sections with dark backgrounds
  id?: string; // For anchor links
}

export function Section({ 
  children, 
  className = "", 
  style,
  eyebrow,
  title,
  description,
  dark = false,
  id
}: SectionProps) {
  return (
    <section id={id} className={cn("py-6 md:py-8", className)} style={style}>
      <div className="max-w-7xl mx-auto px-4">
        {(eyebrow || title || description) && (
          <div className="text-center mb-12">
            {eyebrow && (
              <p className={cn(
                "text-sm font-medium uppercase tracking-wide mb-4",
                dark ? "text-accent" : "text-accent"
              )}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                dark ? "text-bg" : "text-navy"
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn(
                "text-lg max-w-2xl mx-auto",
                dark ? "text-bg/80" : "text-text/70"
              )}>
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
