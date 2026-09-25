import Heading from "./sub/Heading";
import Skill from "./sub/Skill";
import { skillsData } from "@/assets";
import { SkillLevel } from "@/assets/models";

const levels = [
  {
    level: SkillLevel.Advanced,
    title: "Advanced Level",
    desc: "These are the technologies I've used for many years and still actively work with them on a regular basis.",
  },
  {
    level: SkillLevel.Intermediate,
    title: "Intermediate Level",
    desc: "These are the technologies I've used significantly in the past, but I'm not still actively learning. I would be confident in relearning them quickly.",
  },
  {
    level: SkillLevel.Basic,
    title: "Basic Level",
    desc: "These are some of the technologies I've used in the past and still retain a basic knowledge of.",
  },
];

const Skills = () => {
  return (
    <div id="skills" className="min-h-[400px] mt-0">
      <Heading text={"Skills"} />
      {levels.map(({ level, title, desc }, i) => (
        <div key={level}>
          <div className={i === 0 ? "pb-12" : "py-12"}>
            <h3 className="text-xl text-yellow-500">{title}</h3>
            <p className="text-gray-800 dark:text-gray-300">{desc}</p>
          </div>
          <div className="w-full flex flex-wrap gap-x-8 gap-y-10 lg:gap-y-6">
            {skillsData
              .filter((skill) => skill.level === level)
              .map((skill, j) => (
                <Skill key={skill.name} skill={skill} index={j} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
