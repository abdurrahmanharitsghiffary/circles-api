"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.extension = void 0;
const client_1 = require("@prisma/client");
exports.extension = client_1.Prisma.defineExtension({
    result: {
        user: {
            fullName: {
                needs: { firstName: true, lastName: true },
                compute(user) {
                    let fullName = user.firstName;
                    if (user === null || user === void 0 ? void 0 : user.lastName)
                        fullName += ` ${user.lastName}`;
                    return fullName;
                },
            },
        },
    },
});
exports.prisma = new client_1.PrismaClient().$extends(exports.extension);
//# sourceMappingURL=prismaClient.js.map