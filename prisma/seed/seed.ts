/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 user
  await seed.user([
    {
      password: "$2b$10$epvLxVcZUYUiFu77JcEVF.0XNDS70L6YncjkAAgqDrbDjxfUoiBci",
      role: "ADMIN",
      username: "bedeul123",
      email: "abdmanharits@gmail.com",
      threads: (x) => x(5, { replies: (x) => x(5) }),
    },
    {
      password: "$2b$10$epvLxVcZUYUiFu77JcEVF.0XNDS70L6YncjkAAgqDrbDjxfUoiBci",
      role: "USER",
      username: "bedeul987",
      email: "abdmanharits2@gmail.com",
      threads: (x) => x(5, { replies: (x) => x(5) }),
    },
  ]);
  await seed.user((x) =>
    x(20, {
      threads: (x) => x(5, { replies: (x) => x(5) }),
      followers: [
        { users_Followings_followerIdTousers: {} },
        { users_Followings_followerIdTousers: {} },
      ],
      following: [
        { users_Followings_followedIdTousers: {} },
        { users_Followings_followedIdTousers: {} },
      ],
      likedThreads: (x) => x({ max: 5 }),
      threadReplies: (x) => x({ max: 5 }),
      password: "$2b$10$epvLxVcZUYUiFu77JcEVF.0XNDS70L6YncjkAAgqDrbDjxfUoiBci",
    })
  );

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();
