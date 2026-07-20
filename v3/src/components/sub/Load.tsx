"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Load = () => {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <motion.div
      initial={{ top: 0 }}
      animate={{ top: load ? "-100%" : 0 }}
      transition={{duration: 0.5}}
      className="w-full h-full fixed left-0 top-0 flex items-center justify-center bg-gradient-to-t from-yellow-50 to-red-50 dark:from-zinc-500 dark:to-zinc-600 z-20"
    >
      <Image src={"/spinner.gif"} alt="Spinner gif" width={50} height={50} unoptimized />
    </motion.div>
  );
};

export default Load;
