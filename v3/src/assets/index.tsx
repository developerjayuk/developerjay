import {
  ProjectDataModel,
  SkillDataModel,
  ExperienceDataModel,
  AboutDataModel,
  PricingPlanModel,
  QuestionDataModel,
  NavBarDataModel,
  HeroIconDataModel,
  SkillLevel,
} from "./models";

// Hero
import GithubLineIcon from "remixicon-react/GithubLineIcon";
import LinkedInIcon from "remixicon-react/LinkedinBoxLineIcon";

/* eslint-disable react/jsx-key */
export const heroIcons: HeroIconDataModel[] = [
  {
    title: "LinkedIn",
    icon: <LinkedInIcon />,
    url: "https://www.linkedin.com/in/developerjay/",
  },
  {
    title: "Github",
    icon: <GithubLineIcon />,
    url: "https://github.com/developerjayuk",
  },
];

// Skills - updated: Feb 2025
// https://github.com/tandpfun/skill-icons
export const skillsData: SkillDataModel[] = [
  {
    name: "CSS",
    icon: "/skills/css.svg",
    exp: 20,
    level: SkillLevel.Advanced,
  },
  {
    name: "JavaScript",
    icon: "/skills/js.svg",
    exp: 20,
    level: SkillLevel.Advanced,
  },
  {
    name: "Angular",
    icon: "/skills/angular.svg",
    exp: 7,
    level: SkillLevel.Intermediate,
  },
  {
    name: "AWS",
    icon: "/skills/aws.svg",
    exp: 7,
    level: SkillLevel.Intermediate,
  },
  {
    name: "TypeScript",
    icon: "/skills/ts.svg",
    exp: 10,
    level: SkillLevel.Advanced,
  },
  {
    name: "Azure",
    icon: "/skills/azure.svg",
    exp: 6,
    level: SkillLevel.Intermediate,
  },
  {
    name: "C#",
    icon: "/skills/cs.svg",
    exp: 15,
    level: SkillLevel.Advanced,
  },
  {
    name: "Docker",
    icon: "/skills/docker.svg",
    exp: 2,
    level: SkillLevel.Basic,
  },
  {
    name: ".Net",
    icon: "/skills/dotnet.svg",
    exp: 15,
    level: SkillLevel.Advanced,
  },
  {
    name: "Elastic Search",
    icon: "/skills/elasticsearch.svg",
    exp: 1,
    level: SkillLevel.Basic,
  },
  {
    name: "Git",
    icon: "/skills/git.svg",
    exp: 12,
    level: SkillLevel.Advanced,
  },
  {
    name: "GraphQL",
    icon: "/skills/graphql.svg",
    exp: 1,
    level: SkillLevel.Basic,
  },
  {
    name: "HTML",
    icon: "/skills/html.svg",
    exp: 20,
    level: SkillLevel.Advanced,
  },
  {
    name: "Jenkins",
    icon: "/skills/jenkins.svg",
    exp: 1,
    level: SkillLevel.Basic,
  },
  {
    name: "Jest",
    icon: "/skills/jest.svg",
    exp: 1,
    level: SkillLevel.Basic,
  },
  {
    name: "JQuery",
    icon: "/skills/jquery.svg",
    exp: 10,
    level: SkillLevel.Intermediate,
  },
  {
    name: "MongoDB",
    icon: "/skills/mongodb.svg",
    exp: 2,
    level: SkillLevel.Basic,
  },
  {
    name: "NextJS",
    icon: "/skills/nextjs.svg",
    exp: 2,
    level: SkillLevel.Intermediate,
  },
  {
    name: "NodeJs",
    icon: "/skills/nodejs.svg",
    exp: 8,
    level: SkillLevel.Advanced,
  },
  {
    name: "Python",
    icon: "/skills/python.svg",
    exp: 1,
    level: SkillLevel.Basic,
  },
  {
    name: "React",
    icon: "/skills/react.svg",
    exp: 8,
    level: SkillLevel.Advanced,
  },
  {
    name: "Redux",
    icon: "/skills/redux.svg",
    exp: 8,
    level: SkillLevel.Advanced,
  },
  {
    name: "SQL",
    icon: "/skills/sql.svg",
    exp: 12,
    level: SkillLevel.Advanced,
  },
  {
    name: "Tailwind",
    icon: "/skills/tailwind.svg",
    exp: 2,
    level: SkillLevel.Advanced,
  },
  {
    name: "Vue",
    icon: "/skills/vue.svg",
    exp: 4,
    level: SkillLevel.Advanced,
  },
].sort((a, b) => b.exp - a.exp);
// End of Skills

// About Me
import GithubFillIcon from "remixicon-react/GithubFillIcon";
import Projector2LineIcon from "remixicon-react/Projector2LineIcon";
import AwardFillIcon from "remixicon-react/AwardFillIcon";

export const aboutData: AboutDataModel[] = [
  {
    title: "Successful Hobby Projects",
    amount: 34,
    icon: <Projector2LineIcon />,
  },
  {
    title: "Github Repos",
    amount: 50,
    icon: <GithubFillIcon />,
  },
  {
    title: "Developer Skills",
    amount: skillsData.length,
    icon: <AwardFillIcon />,
  },
];

import DownloadLineIcon from "remixicon-react/DownloadLineIcon";
import ArrowLeftSFillIcon from "remixicon-react/ArrowLeftSFillIcon";

export const downloadIcon = <DownloadLineIcon />;
export const arrowLeftIcon = <ArrowLeftSFillIcon />;

export const aboutText: string =
  " Hey, I'm Jason, a fullstack web developer. I love tackling all elements of web development and constantly learning new skills in these areas. I've coded in many popular languages such as HTML, CSS, JavaScript, React, Angular, NextJS, .Net(C#)... to build responsive websites, functional desktop applications, and well designed phone apps. I'm a great learner and pride myself on my creativity and problem solving skills.";
// End of About Me

// Experience
export const experienceData: ExperienceDataModel[] = [
  {
    year: 2024,
    title: "Full Stack Developer at Startup Company",
    start: "Jan 2015",
    end: "Dec 2017",
    details: "18 month contract",
    experience: ["Experience 1", "Experience 2"],
  },
  {
    year: 2022,
    title: "Advanced Learning and Early Experience",
    start: "Jan 2015",
    end: "Dec 2017",
    details: "Here are the details about this education!",
    experience: ["Experience 1", "Experience 2"],
  },
  {
    year: 3,
    title: "Specialized Education and Real-World Application",
    start: "Jan 2015",
    end: "Dec 2017",
    details: "Here are the details about this education!",
    experience: ["Experience 1", "Experience 2"],
  },
  {
    year: 4,
    title: "Building Expertise and Expanding Skills",
    start: "Jan 2015",
    end: "Dec 2017",
    details: "Here are the details about this education!",
    experience: ["Experience 1", "Experience 2"],
  },
  {
    year: 5,
    title: "Mastery and Leadership",
    start: "Jan 2015",
    end: "Dec 2017",
    details: "Here are the details about this education!",
    experience: ["Experience 1", "Experience 2"],
  },
];

// End of Experience

// Reviews
import StarFillIcon from "remixicon-react/StarFillIcon";
import StarHalfLineIcon from "remixicon-react/StarHalfLineIcon";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

export const starIcons = [<StarFillIcon />, <StarHalfLineIcon />];
export const arrowIcons = [<ArrowLeftSLineIcon />, <ArrowRightSLineIcon />];

export const reviewsData = [
  {
    image: "/reviews/client-1.png",
    name: "Dave Smith - Tech Lead",
    comment: "Here is the comment and review from Dave Smith",
    stars: [1, 1, 1, 1, 0.5],
  },
  {
    image: "/reviews/client-2.png",
    name: "Michelle Mcnamara - Sales Manager",
    comment: "Here is the comment and review from Michelle",
    stars: [1, 1, 1, 1, 0],
  },
];
// End of Reviews

// Projects
export const projectsData: ProjectDataModel[] = [
  {
    name: "Developerjay.com",
    desc: "My developer portfolio",
    url: "/projects/image-1.jpg",
    tech: ["NextJS", "HTML"],
  },
  {
    name: "Anotherwebsite.net",
    desc: "Here are the details for the next project.",
    url: "/projects/image-2.jpg",
    tech: ["Javascript"],
  },
  {
    name: "A 3rd website",
    desc: "Here are the cool details for the 3rd project in this list.",
    url: "/projects/image-3.jpg",
    tech: ["CSS"],
  },
];

export const projectsButton: string[] = ["All", "HTML", "CSS", "JavaScript", "ReactJS"];
// End of Projects

// Pricing Plans
export const pricingPlans: PricingPlanModel[] = [
  {
    title: "Basic",
    pricing: "£200 - $500",
    features: [
      "Up to 5 pages",
      "Responsive design ",
      "Basic SEO ",
      "Contact form",
      "Social media links",
      "1 month support",
    ],
    recommended: "Small businesses & personal blogs",
  },
  {
    title: "Premium",
    pricing: "£5,000 - £10,000",
    features: [
      "Unlimited pages",
      "Responsive design",
      "Comprehensive SEO",
      "Contact forms",
      "Social media links",
      "Advanced security",
      "E-commerce (unlimited products)",
      "Blog setup",
      "Google Analytics with custom reports",
      "6 months support",
    ],
    recommended: "Large businesses & complex e-commerce sites, custom web applications",
  },
  {
    title: "Standard",
    pricing: "£1,500 - £3,000",
    features: [
      "Up to 10 pages",
      "Responsive design",
      "Advanced SEO",
      "Contact form",
      "Social media links",
      "E-commerce (20 products)",
      "Blog setup",
      "Google Analytics",
      "3 months support",
    ],
    recommended: "Medium-sized businesses & online stores",
  },
];

import CheckLineIcon from "remixicon-react/CheckLineIcon";
export const checkIcon = <CheckLineIcon />;
// End of pricing plans

// Q&A section
export const questions: QuestionDataModel[] = [
  {
    question: "Do you prefer working more on the Front-end or Back-end?",
    answer: "At the start of my career, I worked more on the FE and design, but over the last 10-15 years I've worked on a good balance of FE and BE. If I had to give a preference I would say 60/40 in favour of BackEnd work.",
  },
  {
    question: "Outside of web development do you have any hobbies?",
    answer:
      "My two loves are health, learning and travelling. As such my hobbies include exercise (gym, football, cycling), self development, reading, learning Spanish,  cooking and playing music (guitar and piano). My love for travelling and experience new cultures has taken me to many countries around the world.",
  },
  {
    question: "What are your strengths?",
    answer:
      "My best strengths are that I'm a good problem solver, a quick learner and very persistent. These give me confidence that I can take on any challenge and eventually find a solution.",
  },
  {
    question: "What are your weaknesses?",
    answer:
      "Sometimes not asking for help quick enough and not taking enough breaks (to clear my mind) when I'm stuck on a problem.",
  },
  {
    question: "How do you handle stress and pressure in the workplace?",
    answer:
      "By setting clear priorites, boundaries and communicating with my colleagues on expectations.",
  },
  {
    question: "How do you stay up to date with industry trends?",
    answer:
      "Mainly through subscribed developer youtube channels and then taking courses for new subjects and making sure I put this new knowledge into practical use by creating a small personal project.",
  },
  {
    question: "How do you handle feedback and criticism?",
    answer:
      "When I was younger (before around 22 years old) I did not handle criticism well, but I have since been on a huge self-development journey and value how important feedback and constructive criticism is to continue to learn and grow.",
  },
  {
    question: "What motivates you at work?",
    answer:
      "I love learning and problem solving. We live in an infinite world learning wise, so I'm motivated everyday by the new things I will learn. ",
  },
];

import ArrowDropDownLineIcon from "remixicon-react/ArrowDropDownLineIcon";
export const questionArrow = <ArrowDropDownLineIcon />;
// End of Q&A section

// Navbar
import Home5LineIcon from "remixicon-react/Home5LineIcon";
import UserLineIcon from "remixicon-react/UserLineIcon";
import HistoryLineIcon from "remixicon-react/HistoryLineIcon";
import BriefcaseLineIcon from "remixicon-react/BriefcaseLineIcon";
import ProjectorLineIcon from "remixicon-react/ProjectorLineIcon";
import ContactsBook2LineIcon from "remixicon-react/ContactsBook2LineIcon";
import QuestionAnswerLineIcon from "remixicon-react/QuestionAnswerLineIcon";
import CopyrightLineIcon from "remixicon-react/CopyrightLineIcon";

export const copyRightIcon = <CopyrightLineIcon />;
export const navbarData: NavBarDataModel[] = [
  {
    id: "home",
    name: "Home",
    icon: <Home5LineIcon />,
  },
  {
    id: "about",
    name: "About",
    icon: <UserLineIcon />,
  },
  {
    id: "skills",
    name: "Skills",
    icon: <BriefcaseLineIcon />,
  },
  {
    id: "experience",
    name: "Experience",
    icon: <HistoryLineIcon />,
  },
  {
    id: "projects",
    name: "Projects",
    icon: <ProjectorLineIcon />,
  },

  {
    id: "contact",
    name: "Contact",
    icon: <ContactsBook2LineIcon />,
  },
  {
    id: "questions",
    name: "Questions",
    icon: <QuestionAnswerLineIcon />,
  },
  // {
  //   id: "pricing",
  //   name: "Pricing",
  //   icon: <PriceTag3LineIcon />,
  // },
  // {
  //   id: "reviews",
  //   name: "Reviews",
  //   icon: <UserStarLineIcon />,
  // },
];

// End of navbar

// Toggle
import MoonFoggyFillIcon from "remixicon-react/MoonFoggyFillIcon";
import SunFoggyFillIcon from "remixicon-react/SunFoggyFillIcon";

export const sunIcon = <SunFoggyFillIcon />;
export const moonIcon = <MoonFoggyFillIcon />;
// End of Toggle button
