const usernames = [
  "applepie",
  "browncake",
  "brownsugar",
  "chocodonut",
  "blackforest",
  "fairy",
  "bigblackclock",
  "unicorn",
  "stormie",
  "darkness",
  "nothing",
  "scores",
  "yummy",
  "justice",
  "ryze",
];

export const genUsername = (baseText: string) => {
  return (
    baseText?.split(" ")?.join("")?.toLowerCase() +
    usernames[Math.floor(Math.random() * usernames.length)] +
    Math.floor(Math.random() * 10000) +
    1
  );
};
