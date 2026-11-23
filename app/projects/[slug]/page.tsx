import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/sections/CaseStudyView";
import { featuredProjects, getProject } from "@/lib/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return featuredProjects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} case study`,
    description: p.description,
    openGraph: { title: `${p.name} | Case study`, description: p.description },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project || !project.caseStudy) notFound();
  return <CaseStudyView project={project} />;
}
