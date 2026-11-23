import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdditionalProjects } from "./builder/AdditionalProjects";
import { EducationBlock } from "./builder/EducationBlock";
import { InterestsBlock } from "./builder/InterestsBlock";
import { ResearchBlock } from "./builder/ResearchBlock";

/**
 * Chapter 06. Everything around the four case studies: the degree, the notes,
 * the smaller builds and the hobbies. It owns the "Research" nav anchor.
 */
export function Builder() {
  return (
    <section id="research" aria-labelledby="builder-title" className="section">
      <div className="container-page">
        <SectionHeading
          index="06"
          eyebrow="The builder beyond the projects"
          lines={["Always curious.", "Always *building.*"]}
          id="builder-title"
        >
          The degree, the notes I keep, the smaller builds and the hobbies that shape how I think.
        </SectionHeading>

        <div className="space-y-24 sm:space-y-32">
          <EducationBlock />
          <ResearchBlock />
          <AdditionalProjects />
          <InterestsBlock />
        </div>
      </div>
    </section>
  );
}
