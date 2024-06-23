"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Created = exports.Success = exports.NoContent = exports.ApiPagingResponse = exports.ApiResponse = void 0;
const pagination_1 = require("./pagination");
class ApiResponse {
    constructor(data, status, message, name, errors) {
        this.data = data;
        this.status = status;
        this.message = message;
        this.name = name;
        this.errors = errors;
        this.success = status < 400;
    }
}
exports.ApiResponse = ApiResponse;
class ApiPagingResponse extends ApiResponse {
    setPagingObject(data) {
        this.meta = data;
        return this;
    }
    constructor(req, data, count) {
        super(data, 200);
        this.data = data;
        this.setPagingObject(new pagination_1.Pagination(req, data, count));
    }
}
exports.ApiPagingResponse = ApiPagingResponse;
class NoContent extends ApiResponse {
    constructor(message) {
        super(null, 204, message);
        this.message = message;
    }
}
exports.NoContent = NoContent;
class Success extends ApiResponse {
    constructor(data, message) {
        super(data, 200, message);
        this.data = data;
        this.message = message;
    }
}
exports.Success = Success;
class Created extends ApiResponse {
    constructor(data, message) {
        super(data, 201, message);
        this.data = data;
        this.message = message;
    }
}
exports.Created = Created;
//# sourceMappingURL=response.js.map