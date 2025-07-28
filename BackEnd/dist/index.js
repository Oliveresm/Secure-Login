"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Register main API routes
app.use('/api', index_routes_1.default);
// Ensure database connection is initialized
db_1.default.getInstance();
// Root route
app.get('/', (_req, res) => {
    res.send('Employee API is running.');
});
// Server startup
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
});
exports.default = app;
