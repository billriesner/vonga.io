import type { Metadata } from "next";
import { GLOSSARY, SITE, canonical } from "@/lib/seo";
import SEO from "@/components/SEO";

export async function generateMetadata(): Promise<Metadata> {
  const m = { 
    title: "Vonga Glossary | Connected Apparel & On-Body Engagement", 
    description: "Plain-language definitions for Vonga's core concepts so teams, universities, studios, and communities can align on how connected apparel works." 
  };
  return { 
    title: m.title, 
    description: m.description, 
    alternates: { canonical: canonical("/glossary") } 
  };
}

export default function GlossaryPage() {
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vonga.com/" },
      { "@type": "ListItem", position: 2, name: "Glossary", item: "https://www.vonga.com/glossary" },
    ],
  };

  return (
    <>
      <SEO pathname="/glossary" jsonLd={crumbs} />
      <main className="bg-[#0a1422] text-white min-h-screen py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6">Glossary</h1>
          <p className="text-white/80 mb-8 text-lg">Plain-language definitions to help teams and LLMs understand Vonga consistently.</p>
          <ul className="space-y-6">
            {GLOSSARY.map((g) => (
              <li key={g.term} className="border-b border-white/10 pb-6 last:border-0">
                <h2 className="text-xl font-medium text-white mb-2">{g.term}</h2>
                <p className="text-white/75">{g.def}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

