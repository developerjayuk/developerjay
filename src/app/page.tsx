import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Questions from "@/components/Questions";
import NavBar from "@/components/NavBar";
import Toggle from "@/components/sub/Toggle";
import Load from "@/components/sub/Load";

export default function Home() {
  return (
    <>
      <Load />
      <Toggle>
        <NavBar />
        <div>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
          <Questions />
        </div>
      </Toggle>
    </>
  );
}
