// tell nextjs to render on the client side
"use client";
import Heading from "./sub/Heading";
import Image from "next/image";
import { skillsData } from "@/assets";
import { motion } from "framer-motion";

const Skills = () => {
  const variants = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.07,
      },
    }),
    hidden: {
      opacity: 0,
      y: 30,
    },
  };

  // make this a reusable component
  return (
    <div id="skills" className="min-h-[400px] mt-0">
      <Heading text={"Skills"} />
      <div className="pb-12">
        <h3 className="text-xl text-yellow-500">Advanced Level</h3>
        <p className="text-gray-800 dark:text-gray-300">
          These are the technologies I&apos;ve used for many years and still actively work with them on a
          regular basis.
        </p>
      </div>
      <div className="w-full flex flex-wrap gap-x-8 gap-y-10 lg:gap-y-6">
        {skillsData
          .filter((f) => f.level === "advanced")
          .map((skill, i) => (
            <motion.div
              custom={i}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.1 }}
              viewport={{ margin: "50px", once: true }}
              key={i}
              className="flex items-center justify-center gap-x-3 rounded-xl border border-yellow-500 bg-zinc-200 px-5 py-2 lg:px-2"
            >
              <Image
                src={skill.icon}
                alt={skill.name + " image"}
                width={100}
                height={100}
                className="h-auto w-[40px]"
              />
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-600 font-bold">{skill.name}</p>
                <p className="text-sm text-red-600">{skill.exp} years</p>
              </div>
            </motion.div>
          ))}
      </div>

      <div className="py-12">
        <h3 className="text-xl text-yellow-500">Intermediate Level</h3>
        <p className="text-gray-800 dark:text-gray-300">
          These are the technologies I&apos;ve used significantly in the past, but I&apos;m not still actively
          learning. I would be confident in relearning them quickly.
        </p>
      </div>
      <div className="w-full flex flex-wrap gap-x-8 gap-y-10 lg:gap-y-6">
        {skillsData
          .filter((f) => f.level === "intermediate")
          .map((skill, i) => (
            <motion.div
              custom={i}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.1 }}
              viewport={{ margin: "50px", once: true }}
              key={i}
              className="flex items-center justify-center gap-x-3 rounded-xl border border-yellow-500 bg-zinc-200 px-5 py-2 lg:px-2"
            >
              <Image
                src={skill.icon}
                alt={skill.name + " image"}
                width={100}
                height={100}
                className="h-auto w-[40px]"
              />
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-600 font-bold">{skill.name}</p>
                <p className="text-sm text-red-600">{skill.exp} years</p>
              </div>
            </motion.div>
          ))}
      </div>

      <div className="py-12">
        <h3 className="text-xl text-yellow-500">Basic Level</h3>
        <p className="text-gray-800 dark:text-gray-300">
          These are some of the technologies I&apos;ve used in the past and still retain a basic
          knowledge of.
        </p>
      </div>
      <div className="w-full flex flex-wrap gap-x-8 gap-y-10 lg:gap-y-6">
        {skillsData
          .filter((f) => f.level === "basic")
          .map((skill, i) => (
            <motion.div
              custom={i}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.1 }}
              viewport={{ margin: "50px", once: true }}
              key={i}
              className="flex items-center justify-center gap-x-3 rounded-xl border border-yellow-500 bg-zinc-200 px-5 py-2 lg:px-2"
            >
              <Image
                src={skill.icon}
                alt={skill.name + " image"}
                width={100}
                height={100}
                className="h-auto w-[40px]"
              />
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-600 font-bold">{skill.name}</p>
                <p className="text-sm text-red-600">{skill.exp} years</p>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Skills;
