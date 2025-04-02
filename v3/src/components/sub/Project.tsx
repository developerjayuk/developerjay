"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ProjectDataModel } from "@/assets/models";
import { motion } from "framer-motion";

interface PropTypes {
  data: ProjectDataModel;
  index: number;
}

const Project: React.FC<PropTypes> = ({ data, index }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="text-center flex justify-center w-full text-gray-500 dark:text-gray-300 text-sm">
        {data.name}
      </div>

      <motion.div
        initial={{ opacity: 0, y: index % 2 === 0 ? 100 : -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        onClick={() => setShow((show) => !show)}
        className="relative w-[350px] sm:w-full h-max border border-yellow-400 rounded-lg cursor-pointer"
      >
        <Image
          src={data.image}
          alt="Project image"
          width={400}
          height={400}
          className="rounded-lg opacity-90"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          className="absolute top-0 w-full h-full flex flex-col items-center justify-center gap-y-2 bg-white/95 p-6 rounded-lg dark:bg-zinc-700/95 transition-colors"
        >
          <h2 className="text-lg, font-bold tracking-wide text-gray-500 dark:text-white transition-colors">
            {data.name}
          </h2>
          <p className="text-justify text-gray-500 first-letter:pl-2 dark:text-gray-100 transition-colors">
            {data.desc}
          </p>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {data.url}
          </a>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Project;
