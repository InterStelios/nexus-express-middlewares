"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCommonMiddlewares = void 0;
var body_parser_1 = __importDefault(require("body-parser"));
var compression_1 = __importDefault(require("compression"));
var helmet_1 = __importDefault(require("helmet"));
var kube_probe_1 = __importDefault(require("kube-probe"));
var response_time_1 = __importDefault(require("response-time"));
var connect_timeout_1 = __importDefault(require("connect-timeout"));
/**
 * Applies standard middlewares to the given application
 *
 * @param {Application} application
 * @returns {void}
 */
function applyCommonMiddlewares(application) {
    application.use(helmet_1.default());
    application.use(compression_1.default());
    application.use(body_parser_1.default.urlencoded({ extended: true }));
    application.use(body_parser_1.default.json());
    application.use(response_time_1.default());
    application.use(connect_timeout_1.default("15s"));
    kube_probe_1.default(application, {
        readinessURL: "/healthz",
        livenessURL: "/healthz",
    });
}
exports.applyCommonMiddlewares = applyCommonMiddlewares;
