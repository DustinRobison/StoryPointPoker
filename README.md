<p align="center">
  <a href="https://storypointpoker.com/" rel="noopener" target="_blank"><img width="150" src="https://storypointpoker.com/1024.png" alt="StoryPointPoker logo"></a></p>
</p>

<h1 align="center">Story Point Poker</h1>

<div align="center">

[Agile](https://en.wikipedia.org/wiki/Agile_software_development) tool for sharing task complexity estimates.

</div>

## Pre Requisites

- [Node v18](https://nodejs.org/en/)
- [Firebase Environment](https://firebase.google.com/)

## Installation

> I was planing to allow use of storypointpoker.com backend but it turned out to be a financial risk so you need to create your own firebase environment

1. Clone the repository and change directory into the project root

   `git clone git@github.com:DustinRobison/StoryPointPoker.git && cd StoryPointPoker`

2. Install the dependencies with node package manager

   `yarn`

3. Run the app in development mode at default `http://localhost:3000`

   `yarn dev`

4. Get your [firebase web configuration](https://firebase.google.com/docs/web/setup#config-object) and map it into a `.env` file as follows:
   ```
       NEXT_PUBLIC_VERSION=
       NEXT_PUBLIC_DOMAIN=
       NEXT_PUBLIC_APIKEY=
       NEXT_PUBLIC_AUTHDOMAIN=
       NEXT_PUBLIC_DATABASEURL=
       NEXT_PUBLIC_PROJECTID=
       NEXT_PUBLIC_STORAGEBUCKET=
       NEXT_PUBLIC_MESSAGINGSENDERID=
       NEXT_PUBLIC_APPID=
       NEXT_PUBLIC_MEASUREMENTID=
   ```

## About

This project is hosted by [Firebase](https://firebase.google.com/).  
You cannot use the current server infrastructure because of an exploit risk, but it is free to setup your own firebase environment for working on front end features.

This is a simple site that I did as a one night hacking session after being frustrated with currently available free tools. Since then I have cleaned it up a little and added a few features but not much.

If interested PR's will be reviewed and accepted as promptly as possible.

## Contact

[Twitter RobisonDustin](https://twitter.com/RobisonDustin) I don't check often so please be patient.

This is a [Next.js](https://nextjs.org/) project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
