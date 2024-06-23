"use strict";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
const seed_1 = require("@snaplet/seed");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const seed = yield (0, seed_1.createSeedClient)();
    // Truncate all tables in the database
    yield seed.$resetDatabase();
    // Seed the database with 10 user
    yield seed.user([
        {
            firstName: "Abdurrahman",
            lastName: "Harits",
            password: "$2b$10$epvLxVcZUYUiFu77JcEVF.0XNDS70L6YncjkAAgqDrbDjxfUoiBci",
            role: "ADMIN",
            username: "abdul123",
            email: "abdmanharits@gmail.com",
            threads: (x) => x(5, { replies: (x) => x(5) }),
        },
        {
            firstName: "Jamal",
            lastName: "Boolean",
            password: "$2b$10$epvLxVcZUYUiFu77JcEVF.0XNDS70L6YncjkAAgqDrbDjxfUoiBci",
            role: "USER",
            username: "jamal123",
            email: "abdmanharits2@gmail.com",
            threads: (x) => x(5, { replies: (x) => x(5) }),
        },
    ]);
    yield seed.user((x) => x(20, {
        threads: (x) => x(5, { replies: (x) => x(5) }),
        followers: [
            { users_followings_followerIdTousers: {} },
            { users_followings_followerIdTousers: {} },
            { users_followings_followerIdTousers: {} },
            { users_followings_followerIdTousers: {} },
            { users_followings_followerIdTousers: {} },
        ],
        following: [
            { users_followings_followedIdTousers: {} },
            { users_followings_followedIdTousers: {} },
            { users_followings_followedIdTousers: {} },
            { users_followings_followedIdTousers: {} },
            { users_followings_followedIdTousers: {} },
        ],
        likedThreads: (x) => x({ max: 30 }),
        likedReplies: (x) => x({ max: 30 }),
        replies: (x) => x({ max: 30 }),
        password: "$2b$10$epvLxVcZUYUiFu77JcEVF.0XNDS70L6YncjkAAgqDrbDjxfUoiBci",
    }));
    console.log("Database seeded successfully!");
    process.exit();
});
main();
//# sourceMappingURL=seed.js.map