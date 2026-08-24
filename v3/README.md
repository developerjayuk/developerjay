# Developer Jay — Portfolio

Personal portfolio site for Jason James ("Dev Jay"), built as a single-page Next.js app. It presents an about-me section, skills, work experience, personal projects, contact details, and FAQs, with a fixed side nav that highlights the section currently in view.

Live structure: [src/app/page.tsx](src/app/page.tsx) composes the page from [src/components/](src/components/):

```
Hero → About → Skills → Experience → Projects → Contact → Questions
```

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack dev server) + [React 19](https://react.dev)
- TypeScript (strict mode)
- [Tailwind CSS](https://tailwindcss.com) with class-based dark mode
- [Framer Motion](https://www.framer.com/motion/) for animations
- [remixicon-react](https://github.com/Remix-Design/remixicon-react) for icons

## Content

All page content (nav links, projects, skills, experience, FAQs) is data-driven from [src/assets/index.tsx](src/assets/index.tsx), typed in [src/assets/models.tsx](src/assets/models.tsx). To update the site's content — add a project, tweak a skill, edit an FAQ — edit that data file rather than the components.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the project
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushing to `master` triggers a production deploy.
