"use client";
import Image from "next/image";
import { motion } from "framer-motion";

// full-screen loader that slides away as soon as the page mounts
const Load = () => {
  return (
    <motion.div
      initial={{ top: 0 }}
      animate={{ top: "-100%" }}
      transition={{duration: 0.5}}
      className="w-full h-full fixed left-0 top-0 flex items-center justify-center bg-gradient-to-t from-yellow-50 to-red-50 dark:from-zinc-500 dark:to-zinc-600 z-20"
    >
      <Image src={"/spinner.gif"} alt="Spinner gif" width={50} height={50} unoptimized />
    </motion.div>
  );
};

export default Load;
