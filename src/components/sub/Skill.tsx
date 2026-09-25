"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { SkillDataModel } from "@/assets/models";

interface PropTypes {
  skill: SkillDataModel;
  index: number;
}

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

const Skill: React.FC<PropTypes> = ({ skill, index }) => {
  return (
    <motion.div
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ scale: 1.1 }}
      viewport={{ margin: "50px", once: true }}
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
  );
};

export default Skill;
