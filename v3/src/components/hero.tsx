// tell nextjs to render on the client side
"use client";
import React, { MouseEvent, useState } from "react";

import Image from "next/image";
import { heroIcons } from "@/assets";
import { useMotionValue, useTransform, motion } from "framer-motion";

const Hero = () => {
  const [windowOffset, setWindowOffset] = useState({ innerWidth: 0, innerHeight: 0 });
  const [mouseMove, setMouseMove] = useState(false);

  // framer motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    x.set(clientX);
    y.set(clientY);

    //console.log(clientX, clientY, x, y);
  };

  const handleMouseEnter = () => {
    setWindowOffset({ innerWidth: window.innerWidth, innerHeight: window.innerHeight });
    setMouseMove(true);

    //console.log(innerWidth, innerHeight);
  };

  // add some rotation to main image to track mouse movements
  const { innerWidth, innerHeight } = windowOffset;
  const rotateY = useTransform(x, [0, innerWidth], [30, -30]);
  const rotateX = useTransform(y, [0, innerHeight], [-50, 10]);

  return (
    <div className="h-screen grid place-items-center" onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter}>
      <div>
        <div className="flex flex-col items-center justify-center gap-y-3 font-light capitalize">
          <motion.div className="flex items-center justify-center" style={{ rotateX: mouseMove ? rotateX : 0, rotateY: mouseMove ? rotateY : 0, transition: "0.1s" }}>
            <Image src={"/person-wave.png"} alt="Person Image" width={400} height={400} priority={true} className="h-auto w-[200px]" />
            <span className="absolute text-xl font-semibold text-white mt-3">Hi</span>
          </motion.div>
          <h1 className="text-center text-3xl font-bold tracking-wider text-gray-500">My Name is Jason James &</h1>
          <p className="text-lg tracking-wider text-gray-700">I like web development 👨🏽‍💻</p>
        </div>
        <div className="mt-8 flex justify-center gap-x-10 text-3xl text yellow-600">
          {heroIcons.map((icon, i) => (
            <a href="#" key={i} className="rounded-lg hover:bg-red-400 hover:-text-white transition-colors">
              {icon}
            </a>
          ))}
        </div>
        <div>
          <a href="#" className="mt-7 block w-max rounded-lg bg-red-400 px-3 py-1 font-light capitalize tracking-wider mx-auto text-white hover:bg-red-500 transition-colors">
            Talk to me
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
