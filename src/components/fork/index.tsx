import Image from "next/image";
export default function fork() {
  return (
    <div className="absolute top-0 right-0 z-10">
      <a
        href="https://github.com/DustinRobison/StoryPointPoker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/Forkme.svg" alt="Fork Me" width={128} height={128} />
      </a>
    </div>
  );
}
