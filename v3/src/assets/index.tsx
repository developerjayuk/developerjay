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
  {
    name: "LLMs",
    icon: "/skills/generative.svg",
    exp: 3,
    level: SkillLevel.Intermediate,
  },
  {
    name: "OpenAI API",
    icon: "/skills/chat-gpt.svg",
    exp: 2,
    level: SkillLevel.Advanced,
  },
  {
    name: "AI Agents",
    icon: "/skills/chat-bot.svg",
    exp: 2,
    level: SkillLevel.Advanced,
  },
  {
    name: "Generative AI",
    icon: "/skills/generative.svg",
    exp: 2,
    level: SkillLevel.Intermediate,
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
    amount: 15,
    icon: <Projector2LineIcon />,
  },
  {
    title: "Github Repos",
    amount: 30,
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
    year: 2026,
    company: "",
    title: "Career Break",
    start: "Jan 2026",
    end: "Current",
    details: ["Upskilling in new technologies and doing some travelling"],
    experience: [],
  },
  {
    year: 2025,
    company: "Contract @ Waracle",
    title: "SENIOR C# DEVELOPER",
    start: "Apr 2025",
    end: "Dec 2025",
    details: [
      "Designed and implemented backend architecture for a new customer-facing insurance platform for SunLife.",
      "Developed REST APIs and backend services using C# / .NET 8, with a Remix / React frontend hosted in Azure.",
      "Made architectural and technical decisions across the application stack, balancing maintainability, scalability and delivery requirements.",
      "Worked closely with the development team to establish development patterns and maintain code quality.",
      "Mentored a mid-level engineer, providing technical guidance, code reviews and support with architectural decisions.",
      "Contributed across the full software development lifecycle from architecture and development through to production launch."
    ],
    experience: [],
  },
  {
    year: 2024,
    company: "Contract @ Awen communications",
    title: "SENIOR SOFTWARE ENGINEER",
    start: "Mar 2022",
    end: "May 2024",
    details: [
      "Contributed to the successful launch of the Sainsbury's Argos Monthly Payment Plan as part of a cross-functional development team.",
      "Developed customer-facing features using React and Node.js APIs.",
      "Built and maintained unit and integration tests to ensure application quality.",
      "Worked with AWS serverless architecture and cloud-native deployments in an agile environment."
    ],
    experience: [],
  },
  {
    year: 2022,
    company: "Waracle",
    title: "Contract @ SENIOR FULL STACK DEVELOPER",
    start: "Mar 2022",
    end: "June 2022",
    details: [
      "Contributed to the successful launch of the Sainsbury's Argos Monthly Payment Plan as part of a cross-functional development team.",
      "Developed customer-facing features using React and Node.js APIs.",
      "Built and maintained unit and integration tests to ensure application quality.", 
      "Worked with AWS serverless architecture and cloud-native deployments in an agile environment."
    ],
    experience: [],
  },
  {
    year: 2021,
    company: "Contract @ Carestream Dental",
    title: "SENIOR FULL STACK DEVELOPER",
    start: "Jan 2021",
    end: "Nov 2021",
    details: [
      "Developed and maintained cloud-based dental management software using C#, .NET Core, Entity Framework, SQL, OData, Azure and React.",
      "Designed and delivered new functionality and integrations across frontend and backend systems.",
      "Led technical upgrades and improvements to codebase maintainability and reliability.",
      "Contributed to enterprise projects supporting a major Saudi government contract."
    ],
    experience: [],
  },
  {
    year: 2020,
    company: "Contract @ Blackhawk Network",
    title: "SENIOR FULL STACK ENGINEER",
    start: "Jan 2019",
    end: "Jan 2020",
    details: [
      "Developed enterprise web applications for a global provider of gift cards, payments and employee benefit solutions.",
      "Delivered full-stack functionality using C#, .NET Core, React, Angular, JavaScript and Node.js.",
      "Developed and integrated APIs and backend services using .NET Core, SQL and NHibernate.",
      "Built automated tests with NUnit and contributed to code reviews, technical decisions and agile delivery.",
      "Worked across a diverse technology stack including PHP, DotNetNuke, Swagger, NPM and SCSS."
    ],
    experience: [],
  },
  {
    year: 2018,
    company: "Permanent @ Lumesse",
    title: "FULL STACK WEB DEVELOPER",
    start: "May 2010",
    end: "Oct 2018",
    details: [
      "Worked at a recruitment software company, handling front-end, back-end, and .NET-based integrations.",
      "Won multiple innovation awards while tackling new challenges.",
      "Built career pages for Santander, BBC, and the Ministry of Justice.",
      "Developed APIs from scratch and integrated with 100+ platforms like Monster, Reed, SHL, and TalentQ."
    ],
    experience: [],
  },
  {
    year: 2010,
    company: "Permanent @ VantageLand",
    title: "WEB DEVELOPER",
    start: "Mar 2008",
    end: "May 2010",
    details: [
      "Developed enterprise recruitment software and integration services used by major organisations and recruitment teams.",
      "Designed and built APIs and integrations connecting the platform with 100+ external recruitment and assessment platforms.",
      "Delivered career-site solutions for organisations including Santander, the BBC and the Ministry of Justice.",
      "Developed scalable frontend and backend solutions, integrating platforms including Monster, Reed, SHL and TalentQ. Collaborated with colleagues and stakeholders to deliver new functionality and technical improvements.",
      "Received multiple company innovation awards for contributions to new products and technical solutions."
    ],
    experience: [],
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
// images 612 x 408
export const projectsData: ProjectDataModel[] = [
  {
    name: "Developer profile (v3)",
    desc: "Updated version of my Developer profile",
    image: "/projects/developer-profile.jpg",
    tech: ["NextJS", "HTML", "React", "CSS", "Tailwind", "Typescript"],
    url: "https://developerjay.com",
  },
  {
    name: "Tailwind CSS & JS animations",
    desc: "Demo HTML template that uses tailwind CSS and JS animations",
    image: "/projects/tailwind-animations.jpg",
    tech: ["HTML", "CSS", "Tailwind"],
    url: "https://developerjayuk.github.io/playground-javascript/animated-template/",
  },
  {
    name: "Movie App using React",
    desc: "A movie app specifically to test React Hooks",
    image: "/projects/react-movie-app.jpg",
    tech: ["HTML", "CSS", "React", "API"],
    url: "https://react-hooks-movie-app.vercel.app/",
  },
  {
    name: "Flexbox Demo",
    desc: "Getting to grips with Flexbox layouts",
    image: "/projects/flexbox-demo.jpg",
    tech: ["HTML", "CSS", "Flexbox"],
    url: "https://developerjayuk.github.io/playground-advanced-css/Flexbox/",
  },
  {
    name: "Movie App using Angular",
    desc: "Project to test Angular with a movie API",
    image: "/projects/angular-movie-app.jpg",
    tech: ["HTML", "CSS", "Angular", "Typescript", "API"],
    url: "https://movie-geek.vercel.app/",
  },
  {
    name: "I-Robot Comedian",
    desc: "Pure JS project that uses 2 APIs",
    image: "/projects/i-robot-comedian.jpg",
    tech: ["HTML", "CSS", "Javascript", "API"],
    url: "https://developerjayuk.github.io/playground-javascript/i-robot-comedian/",
  },
  {
    name: "Infinite scroll Demo",
    desc: "Using Javascript, CSS and an API to infinitely scroll",
    image: "/projects/infinite-scroll.jpg",
    tech: ["HTML", "CSS", "Javascript", "API"],
    url: "https://developerjayuk.github.io/playground-javascript/infinite-scroll/",
  },
  {
    name: "Pig Game",
    desc: "Creating a version of the Pig Game only using JS",
    image: "/projects/pig-game.jpg",
    tech: ["HTML", "CSS", "Javascript"],
    url: "https://developerjayuk.github.io/playground-javascript/Pig-Dice-Game/",
  },
];

export const uniqueTech = Array.from(new Set(projectsData.flatMap((project) => project.tech)));
export const projectsButton: string[] = ["All", ...uniqueTech];
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
    answer:
      "At the start of my career, I worked more on the FE and design, but over the last 10-15 years I've worked on a good balance of FE and BE. If I had to give a preference I would say 60/40 in favour of BackEnd work.",
  },
  {
    question: "Outside of web development do you have any hobbies?",
    answer:
      "My three main passions are learning, health, and travelling. As such my hobbies include exercise (gym, football, cycling), self development, personal web development projects, reading, learning Spanish / Portuguese, cooking and playing music (guitar and piano). My love for travelling and experience new cultures has taken me to many countries around the world.",
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
