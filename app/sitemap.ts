import type { MetadataRoute } from "next";
import { featuredProjects } from "@/lib/data/projects";
import { researchNotes } from "@/lib/data/research";
import { site } from "@/lib/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    ...featuredProjects
      .filter((p) => p.caseStudy)
      .map((p) => ({ url: `${site.url}/projects/${p.slug}`, lastModified: now, priority: 0.8 })),
    ...researchNotes.map((n) => ({ url: `${site.url}/research/${n.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
