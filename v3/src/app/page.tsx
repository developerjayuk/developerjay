"use client";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
// import Reviews from "@/components/Reviews";
// import PricingPlans from "@/components/PricingPlans";
import Contact from "@/components/Contact";
import Questions from "@/components/Questions";
import NavBar from "@/components/NavBar";
import { useEffect, useRef, useState } from "react";
import Toggle from "@/components/sub/Toggle";
import Load from "@/components/sub/Load";

export default function Home() {
  const [id, setId] = useState("");
  const compsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const intersecting = entry.isIntersecting;
          if (intersecting) {
            setId(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (compsRef?.current?.children) {
      const compsArr = Array.from(compsRef.current.children);
      compsArr.forEach((comp) => {
        observer.observe(comp as Element);
      });
    }
  }, []);

  return (
    <>
      <Load />
      <Toggle>
        <NavBar id={id} />
        <div ref={compsRef}>
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
