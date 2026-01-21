"use client";

import { useEffect, useMemo } from "react";
import { canonical } from "@/lib/seo";

export default function SEO({
  pathname,
  jsonLd,
}: {
  pathname: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}) {
  const url = useMemo(() => {
    return canonical(pathname);
  }, [pathname]);
  
  const blocks = useMemo(() => {
    return Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  }, [jsonLd]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);

    // Add JSON-LD scripts
    blocks.forEach((block, i) => {
      const scriptId = `jsonld-${pathname.replace(/\//g, '-')}-${i}`;
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(block);
    });

    // Cleanup function
    return () => {
      blocks.forEach((_, i) => {
        const scriptId = `jsonld-${pathname.replace(/\//g, '-')}-${i}`;
        const script = document.getElementById(scriptId);
        if (script) {
          script.remove();
        }
      });
    };
  }, [pathname, url, blocks]);

  return null;
}

