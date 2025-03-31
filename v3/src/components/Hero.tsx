// tell nextjs to render on the client side
"use client";
import React, { MouseEvent, useState } from "react";

import Image from "next/image";
import { heroIcons } from "@/assets";
import { useMotionValue, useTransform, motion, useSpring } from "framer-motion";

const Hero = () => {
  const [windowOffset, setWindowOffset] = useState({ innerWidth: 0, innerHeight: 0 });
  const [mouseMove, setMouseMove] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  // framer motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    x.set(clientX);
    y.set(clientY);
  };

  const handleMouseEnter = () => {
    setWindowOffset({ innerWidth: window.innerWidth, innerHeight: window.innerHeight });
    setMouseMove(true);
  };

  // add some rotation to main image to track mouse movements
  const { innerWidth, innerHeight } = windowOffset;

  const springX = useSpring(x, { stiffness: 100, damping: 10 });
  const springY = useSpring(y, { stiffness: 100, damping: 10 });

  const rotateY = useTransform(springX, [0, innerWidth], [30, -30]);
  const rotateX = useTransform(springY, [0, innerHeight], [-50, 10]);

  return (
    <div
      id="home"
      className="h-screen grid place-items-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-y-3 font-light"
        >
          <motion.div
            className="flex items-center justify-center"
            style={{
              rotateX: mouseMove ? rotateX : 0,
              rotateY: mouseMove ? rotateY : 0,
              transition: "0.1s",
            }}
          >
            <Image
              src={"/person-wave.png"}
              alt="Person Image"
              width={400}
              height={400}
              priority={true}
              className="h-auto w-[200px]"
            />
            <motion.span
              className="absolute text-xl font-semibold text-white mt-3"
              initial={{ scale: 0 }}
              animate={{
                opacity: buttonHover ? 0 : 1,
                scale: buttonHover ? 2 : 0,
                y: buttonHover ? -40 : 0,
              }}
              transition={{ opacity: { delay: 0.4 } }}
            >
              Hi
            </motion.span>
          </motion.div>
          <h1 className="text-center text-3xl font-bold tracking-wider text-gray-500 sm:text-2xl dark:text-white transition-colors">
            My name is Jason James
          </h1>
          <p className="text-lg tracking-wider text-gray-700 dark:text-gray-200 transition-colors">
            I like web development 👨🏽‍💻
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-x-10 text-3xl text yellow-600 sm:text-2xl"
        >
          {heroIcons.map((icon, i) => (
            <a
              href={icon.url}
              key={i}
              className="rounded-lg hover:bg-red-400 hover:-text-white transition-colors"
              title={icon.title}
            >
              {icon.icon}
            </a>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <a
            href={`/#contact`}
            className="mt-7 block w-max rounded-lg bg-red-400 px-3 py-1 font-light capitalize tracking-wider mx-auto text-white hover:bg-red-500 transition-colors"
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            Talk to me
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
