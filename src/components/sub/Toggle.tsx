"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { moonIcon, sunIcon } from "@/assets";
import { reactLocalStorage } from "reactjs-localstorage";

interface PropTypes {
  children: ReactNode;
}

const Toggle: React.FC<PropTypes> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const addDarkMode = () => {
    if (mainRef.current) {
      mainRef.current.classList.add("dark");
      setDarkMode(true);
    }
  };

  const removeDarkMode = () => {
    if (mainRef.current) {
      mainRef.current.classList.remove("dark");
      setDarkMode(false);
    }
  };

  useEffect(() => {
    const darkTheme: string = reactLocalStorage.get("darkTheme");
    const darkThemeParsed: boolean = darkTheme !== undefined && JSON.parse(darkTheme);

    if (darkTheme === undefined) {
      // set default to match users system settings
      const systemTheme =
        typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (systemTheme) addDarkMode();
      else removeDarkMode();
    } else {
      if (darkThemeParsed) addDarkMode();
      else removeDarkMode();
    }
  }, []);

  return (
    <main ref={mainRef}>
      <div className="bg-white dark:bg-zinc-800 dark:text-white lg:pl-10">
        <div className="max-w-[1200px] xl:w-full mx-auto flex justify-center xl:px-[90px] sm:pl-[80px] sm:pr-5 overflow-hidden">
          <button
            onClick={() => {
              if (!darkMode) {
                addDarkMode();
                reactLocalStorage.set("darkTheme", true);
              } else {
                removeDarkMode();
                reactLocalStorage.set("darkTheme", false);
              }
            }}
            className="fixed right-14 sm:right-10 top-10 text-yellow-600 hover:text-yellow-600 z-40"
          >
            <span className="absolute block rounded-full bg-zinc-50 p-1 text-4xl dark:bg-zinc-800">
              {darkMode ? sunIcon : moonIcon}
            </span>
          </button>
          {children}
        </div>
      </div>
    </main>
  );
};

export default Toggle;
