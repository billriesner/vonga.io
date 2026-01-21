import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://vonga.io";
  const paths = [
    "/",
    "/how-it-works",
    "/sports-teams",
    "/schools",
    "/studios-clubs",
    "/creators",
    "/solutions/sports-teams",
    "/solutions/schools",
    "/solutions/studios-clubs",
    "/solutions/creators",
    "/intake",
    "/about",
    "/glossary",
  ];

  const now = new Date().toISOString();
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));
}

