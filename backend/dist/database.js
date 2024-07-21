"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDb = initDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
let db;
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.db = db = yield (0, sqlite_1.open)({
            filename: ':memory:',
            driver: sqlite3_1.default.Database
        });
        yield db.exec(`CREATE TABLE users (id INTEGER PRIMARY KEY, telegram_id TEXT, first_name TEXT)`);
        yield db.exec(`CREATE TABLE admins (telegram_id TEXT)`);
        // Add your hardcoded admins
        yield db.run("INSERT INTO admins (telegram_id) VALUES (?)", ["your_telegram_id"]);
    });
}
