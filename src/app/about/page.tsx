import Card from "@/components/card";
import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-between md:p-12 bg-slate-50 text-black">
      <Card title="About">
        <section className="py-4">
          <h6 className="font-semibold text-xl">
            What is the purpose of this website?
          </h6>
          <hr />
          <p className="py-2">
            Scrum Story Points / Story Point Poker is a simple tool to help with
            the agile process implementation referred to as{" "}
            <a
              href="https://en.wikipedia.org/wiki/Planning_poker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:opacity-50"
            >
              Planning Poker.
            </a>
          </p>
          <p className="py-2">
            A goal of Agile is to enable a development team to have a measure of
            planning. Part of that planning is estimating the complexity of
            tasks in a proposed workload. Story Point Poker is a simple tool to
            enable those team driven estimates in real time with ease.
          </p>
        </section>

        <section className="py-4">
          <h6 className="font-semibold text-xl">
            How can I use story point poker?
          </h6>
          <hr />
          <p className="py-2">
            Before starting you need a list of the tasks you intend for you and
            your team to complete. Common tools for this are:{" "}
            <a
              href="https://www.atlassian.com/software/jira"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:opacity-50"
            >
              Jira
            </a>{" "}
            or{" "}
            <a
              href="https://trello.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:opacity-50"
            >
              Trello
            </a>{" "}
            but there are many others. Then you need to meet your team in real
            time.
          </p>
          <p className="py-2">
            A goal of Agile is to enable a development team to have a measure of
            planning. Part of that planning is estimating the complexity of
            tasks in a proposed workload. Story Point Poker is a simple tool to
            enable those team driven estimates in real time with ease.
          </p>
          <p className="py-2">
            Next, you can create a room from the <Link href="/">home page</Link>{" "}
            and send the url to invite others. The team can discuss the task to
            be estimated and submit their votes on the complexity of the task in
            real time and keep it hidden. After all votes are submitted they can
            be revealed and a discussion towards consensus can be initiated.
            Finally update the task with the estimation and clear votes to move
            on to the next.
          </p>
        </section>

        <section className="py-4">
          <h6 className="font-semibold text-xl">
            Does <Link href="/">storypointpoker.com</Link> store any of my
            personal data?
          </h6>
          <hr />
          <p className="py-2">No.</p>
          <p className="py-2">
            We do collect Google analytics data (ie. counts the number of people
            that visited the site and poker room) but every action you do and
            your created room are all automatically deleted within 24 hours of
            creation.
          </p>
        </section>
      </Card>
    </main>
  );
}
