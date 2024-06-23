"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const env_1 = require("@/config/env");
const omitProperties_1 = require("@/utils/omitProperties");
class Pagination {
    getUrl(req, type) {
        const { limit, offset } = req.pagination;
        const qs = (0, omitProperties_1.omitProperties)(req.query, ["limit", "offset"]);
        const url = new URL(req.originalUrl, env_1.ENV.BASE_URL);
        for (const [key, value] of Object.entries(qs)) {
            url.searchParams.set(key, value.toString());
        }
        if (type === "current")
            return url;
        let off = 0;
        if (type === "prev") {
            if (offset - limit < 0) {
                off = 0;
            }
            else {
                off = offset - limit;
            }
        }
        else if (type === "next") {
            off = offset + limit;
        }
        url.searchParams.set("limit", limit.toString());
        url.searchParams.set("offset", off.toString());
        return url;
    }
    getNextUrl(req) {
        const url = this.getUrl(req, "next");
        if (this.currentPage < this.totalPages)
            return url.href;
        return null;
    }
    getPrevUrl(req) {
        const { limit, offset } = req.pagination;
        const url = this.getUrl(req, "prev");
        if (offset - limit > limit - limit * 2 &&
            this.currentPage <= this.totalPages)
            return url.href;
        return null;
    }
    constructor(req, data, count) {
        const { limit, offset } = req.pagination;
        this.current = this.getUrl(req, "current").href;
        this.limit = limit;
        this.offset = offset;
        this.currentPage = Math.floor(offset / limit) + 1;
        this.resultCount = data === null || data === void 0 ? void 0 : data.length;
        this.totalRecords = count;
        this.totalPages = Math.ceil(count / limit);
        const prev = this.getPrevUrl(req);
        const next = this.getNextUrl(req);
        this.next = next;
        this.prev = prev;
    }
}
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.js.map