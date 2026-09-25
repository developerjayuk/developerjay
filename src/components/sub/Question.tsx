"use client";
import React, { useState } from "react";
import { questionArrow } from "@/assets";
import { QuestionDataModel } from "@/assets/models";
import { motion } from "framer-motion";

interface PropTypes {
  question: QuestionDataModel;
  index: number;
}

const Question: React.FC<PropTypes> = ({ question, index }) => {
  const [show, setShow] = useState(index === 0 ? true : false);

  return (
    <motion.li
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: "50px", once: true }}
      variants={{
        visible: () => ({
          opacity: 1,
          x: 0,
          transition: {
            delay: index * 0.07,
          },
        }),
        hidden: { opacity: 0, x: -30 },
      }}
      className={`border p-1 border-yellow-500 rounded-lg`}
    >
      <h1
        onClick={() => setShow(!show)}
        className={`flex items-center text-xl font-extralight tracking-wide cursor-pointer text-gray-800 hover:text-yellow-600 dark:text-white transition-colors dark:hover:text-yellow-600
          ${show && "border-b text-yellow-500 dark:text-yellow-500"}
          `}
      >
        <motion.span animate={{ rotate: show ? 180 : 0 }}>{questionArrow}</motion.span>
        <span>{question.question}</span>
      </h1>
      <motion.p
        initial={{ scaleY: 0, height: 0, opacity: 0 }}
        animate={{ scaleY: show ? 1 : 0, height: show ? "auto" : 0, opacity: show ? 1 : 0 }}
        transition={{
          duration: 0.1,
          type: "spring",
          stiffness: show ? 250 : 50,
          opacity: { delay: show ? 0.2 : 0 },
        }}
        className="pl-8 text-lg font-extralight tracking-wide text-gray-900 first-letter:pl-3 box-border origin-top transition-colors dark:text-gray-200"
      >
        {question.answer}
      </motion.p>
    </motion.li>
  );
};

export default Question;
