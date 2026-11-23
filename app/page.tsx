import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Expertise } from "@/components/sections/Expertise";
import { Builder } from "@/components/sections/Builder";
import { Contact } from "@/components/sections/Contact";
import { Outro } from "@/components/sections/Outro";
import { ChapterRail } from "@/components/layout/ChapterRail";

export default function HomePage() {
  return (
    <>
      <ChapterRail />
      <Hero />
      <About />
      <Projects />
      <Achievements />
      <Expertise />
      <Builder />
      <Contact />
      <Outro />
    </>
  );
}
