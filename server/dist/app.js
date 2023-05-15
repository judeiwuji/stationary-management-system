"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotEnv = __importStar(require("dotenv"));
const sequelize_1 = __importDefault(require("./models/engine/sequelize"));
const routemanager_1 = __importDefault(require("./routes/routemanager"));
const session_manager_1 = __importDefault(require("./middlewares/session-manager"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
dotEnv.config();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = `${process.env.PORT}`;
        sequelize_1.default.sync({ alter: false });
        this.middlewares();
        this.settings();
        this.run();
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            exposedHeaders: ["x-access", "x-access-refresh"],
            origin: "*",
            maxAge: 0,
        }));
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "../", "public")));
        this.app.use(express_1.default.json({}));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((req, res, next) => session_manager_1.default.refreshToken(req, res, next));
        this.app.use((req, res, next) => session_manager_1.default.deserializeUser(req, res, next));
    }
    settings() {
        new routemanager_1.default(this.app);
        this.app.all("*", (req, res) => {
            const indexFile = path_1.default.join(__dirname, "..", "public", "index.html");
            res.sendFile(indexFile);
        });
    }
    run() {
        this.app.listen(this.port, () => {
            console.log(`App is running on port ::${this.port}`);
        });
    }
}
function runApp() {
    new App();
}
runApp();
//# sourceMappingURL=app.js.map