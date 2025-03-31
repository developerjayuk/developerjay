// tell nextjs to render on the client side
"use client";
import { animate, motion } from "framer-motion";
import Heading from "./sub/Heading";
import Project from "./sub/Project";
import { projectsData, projectsButton } from "@/assets";
import { useEffect, useRef, useState } from "react";

const Projects = () => {
  const [tech, setTech] = useState("All");
  const [index, setIndex] = useState(0);
  const prevIndex = useRef(0);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  const handleClick = () => {
    animate(buttonsRef.current[prevIndex.current], { opacity: 0.5, scale: 1 });
    animate(buttonsRef.current[index], { opacity: 1, scale: 1.2 });
  };

  useEffect(() => {
    handleClick();
    prevIndex.current = index;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div id="projects" className="min-h-screen py-20">
      <Heading text={"Projects"} />
      <p className="text-red-600">* Full list to be added soon</p>
      <div className="flex flex-wrap items-center gap-4 py-10 mx-2">
        {projectsButton.map((project, i) => (
          <motion.button
            key={i}
            initial={{ opacity: i === 0 ? 1 : 0.5, scale: i === 0 ? 1.3 : 1 }}
            ref={(el) => {
              if (el) buttonsRef.current.push(el);
            }}
            onClick={() => {
              setIndex(i);
              setTech(project)
            }}
            className="border border-yellow-500 rounded-xl px-2 py-1 text-sm font-light tracking-wider text-gray"
          >
            {project}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5">
        {projectsData.filter(p => p.tech.some(i => tech === "All" ? true : i === tech)).map((project, i) => (
          <motion.div key={i} layout>
            <Project data={project} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
