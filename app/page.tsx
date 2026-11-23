import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Expertise } from "@/components/sections/Expertise";
import { Education } from "@/components/sections/Education";
import { Research } from "@/components/sections/Research";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Achievements />
      <Expertise />
      <Education />
      <Research />
      <Beyond />
      <Contact />
    </>
  );
}
