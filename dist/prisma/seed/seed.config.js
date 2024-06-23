"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_prisma_1 = require("@snaplet/seed/adapter-prisma");
const config_1 = require("@snaplet/seed/config");
const client_1 = require("@prisma/client");
exports.default = (0, config_1.defineConfig)({
    adapter: () => {
        const client = new client_1.PrismaClient();
        return new adapter_prisma_1.SeedPrisma(client);
    },
    select: ["!*_prisma_migrations"],
});
//# sourceMappingURL=seed.config.js.map