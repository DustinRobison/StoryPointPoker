
export const meta = {
  title: "ScrumStoryPoints",
  subTitle: "StoryPointPoker",
  description: "Scrum Story Points Poker is a collaborative estimation technique used in Agile software development. It helps teams estimate the effort required to complete user stories or tasks by assigning story points based on complexity, risk, and effort.",
  logo: "/images/logo.png",
  logoDark: "/images/logo_dark.png",
  logoWhite: "/images/logo_white.png",
}

export const links = [
  {
    name: "About",
    url: "/about",
    inNavBar: true
  },
  {
    name: "Guestbook",
    url: "/guestbook",
    inNavBar: true
  },
  {
    name: "Buy Me A Coffee",
    url: "/coffee",
    inNavBar: true
  },
  {
    name: "Privacy Policy",
    url: "/privacy-policy",
    inNavBar: false
  },
  {
    name: "Terms of Service",
    url: "/terms-of-service",
    inNavBar: false
  },
  {
    name: "Fork On GitHub",
    url: "https://github.com/DustinRobison/StoryPointPoker",
    inNavBar: false
  }
]


export const defaultStoryPointValues = [
  "0",
  "0.5",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "20",
  "?"
]

export const defaultRoomValues = {
  users: {},
  description: "",
  restrictControl: false,
  showVotes: false
}
