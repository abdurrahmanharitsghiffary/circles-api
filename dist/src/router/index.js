"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const error_1 = require("../middlewares/error");
const _404_1 = require("../middlewares/404");
const logger_1 = require("../middlewares/logger");
const limiter_1 = require("@/middlewares/limiter");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const specs_1 = require("../../docs/specs");
const paginationParser_1 = require("@/middlewares/paginationParser");
const resJsonRedis_1 = require("@/middlewares/resJsonRedis");
const config_1 = require("@/config");
const registerController_1 = require("@/utils/registerController");
const authController_1 = require("@/controllers/authController");
const likeController_1 = require("@/controllers/likeController");
const meController_1 = require("@/controllers/meController");
const replyController_1 = require("@/controllers/replyController");
const replyLikeController_1 = require("@/controllers/replyLikeController");
const searchController_1 = require("@/controllers/searchController");
const threadController_1 = require("@/controllers/threadController");
const userController_1 = require("@/controllers/userController");
const tryCatch_1 = require("@/middlewares/tryCatch");
const env_1 = require("@/config/env");
const speechToTextController_1 = require("@/controllers/speechToTextController");
const oauthController_1 = require("@/controllers/oauthController");
class Router {
    constructor(app) {
        this.app = app;
        this.baseUrlV1 = "/api/v1";
    }
    v1() {
        const app = this.app;
        app.use(logger_1.apiLogger);
        app.use((0, paginationParser_1.paginationParser)());
        app.use((0, resJsonRedis_1.resJsonRedis)({ EX: 60 }));
        if (!config_1.CONFIG.DISABLE_DOCS)
            app.use(this.baseUrlV1 + "/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs_1.specs, { explorer: true }));
        app.use(limiter_1.apiLimiter);
        (0, registerController_1.registerController)(app, [
            authController_1.AuthController,
            oauthController_1.OAuthController,
            likeController_1.LikeController,
            meController_1.MeController,
            replyController_1.ReplyController,
            replyLikeController_1.ReplyLikeController,
            searchController_1.SearchController,
            threadController_1.ThreadController,
            speechToTextController_1.SpeechToTextController,
            userController_1.UserController,
        ], { prefix: this.baseUrlV1, debug: env_1.NODE_ENV === "development" });
        app.use((0, tryCatch_1.tryCatch)(_404_1.NotFoundController.handle));
        app.use(error_1.ErrorMiddleware.handle);
    }
}
exports.Router = Router;
//# sourceMappingURL=index.js.map