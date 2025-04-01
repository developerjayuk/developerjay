"use client";

import Heading from "./sub/Heading";
import Image from "next/image";
import { arrowLeftIcon, experienceData } from "@/assets";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

const Experience = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 95%", "end end"],
  });

  const scrollY = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 20,
  });

  return (
    <div id="experience" className="py-20 relative">
      <Heading text={"Relevant Experience & Education"} />
      <Image
        src={"/education.png"}
        alt={"Experience image"}
        width={300}
        height={300}
        className="absolute -top-4 right-0 opacity-90 lg:hidden"
      />
      <div
        ref={containerRef}
        className="relative w-full h-full flex flex-col items-center justofy-center gap-y-10 lg:gap-y-20 py-10"
      >
        <p className="relative -top-[30px] z-5 text-yellow-500">Latest</p>
        {experienceData.map((data, i) => (
          <div
            key={i}
            className={`w-[400px] xl:w-[400px] sm:w-full sm:px-0 relative z-10 ${
              i % 2 === 0
                ? "-left-[225px] xl:-left-[240px] lg:left-0"
                : "left-[225px] xl:-left-[240px] lg:left-0"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 0.97, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
              className="relative flex flex-col gap-y-3 rounded-md border border-red-200 bg-white p-4 tracking-wide sm:text-sm z-10 dark:bg-zinc-700 transition-colors"
            >
              <h1 className="text-xl sm:text-lg font-light text-gray-700 dark:text-white text-center">{data.title}</h1>
              <p className="text-gray-500 dark:text-gray-100 font-light text-center">{data.company}</p>
              <p className="text-gray-500 dark:text-gray-100 font-light text-center">{data.start} to {data.end}</p>
              <p className="text-gray-500 dark:text-gray-100">
                <span className="block font-light">My Role:</span>
                <span className="block pl-2 font-extralight">{data.details}</span>
              </p>
              <div className="text-gray-800 dark:text-gray-200 transition-colors">
                <span className="font-light">Experience:</span>
                <ul className="pl-2">
                  {data.experience.map((exp, j) => (
                    <li key={j} className="my-1 font-extralight">
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
              <span
                className={`absolute top-20 text-red-300 -translate-y-1/2 lg:hidden
                ${i % 2 === 0 ? "left-full rotate-180" : "right-full"}`}
              >
                {arrowLeftIcon}
              </span>
            </motion.div>
            <div
              className={`absolute -top-2.5 w-14 border border-gray-400 rounded-full aspect-square grid place-items-center text-red-400 font-light -translate-y-1/2 z-10 bg-gray-100
                ${
                  i % 2 === 0
                    ? "left-1/2 -translate-x-1/2 lg:left-1/2"
                    : "right-1/2 translate-x-1/2 lg:right-1/2 "
                }`}
            >
              {data.year}
            </div>
          </div>
        ))}

        <motion.div
          initial={{ scaleY: 0 }}
          style={{ scaleY: scrollY }}
          className="absolute w-1 h-[97%] rounded-full bg-gray-400 origin-top pb-20 z-0"
        >
        </motion.div>
        <p className="relative top-[60px] z-5 text-yellow-500">Oldest</p>
      </div>
    </div>
  );
};

export default Experience;
