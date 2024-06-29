"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUsername = void 0;
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
const genUsername = (baseText) => {
    var _a, _b;
    return (((_b = (_a = baseText === null || baseText === void 0 ? void 0 : baseText.split(" ")) === null || _a === void 0 ? void 0 : _a.join("")) === null || _b === void 0 ? void 0 : _b.toLowerCase()) +
        usernames[Math.floor(Math.random() * usernames.length)] +
        Math.floor(Math.random() * 10000) +
        1);
};
exports.genUsername = genUsername;
//# sourceMappingURL=genUsername.js.map