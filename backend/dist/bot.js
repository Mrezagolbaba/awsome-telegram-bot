"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const database_1 = require("./database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
console.log('Bot token:', token);
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
(0, database_1.initDb)().then(() => {
    console.log('Database initialized');
    bot.on('message', (msg) => {
        console.log('Received message:', msg);
    });
    bot.onText(/\/start/, (msg) => {
        var _a;
        const chatId = msg.chat.id;
        const firstName = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.first_name) || 'there';
        console.log(`/start command received from ${firstName} (${chatId})`);
        database_1.db.run("INSERT OR IGNORE INTO users (telegram_id, first_name) VALUES (?, ?)", [chatId, firstName], function (err) {
            if (err) {
                return console.log('Database error:', err.message);
            }
            const replyMarkup = {
                inline_keyboard: [
                    [{ text: "Open Web App", web_app: { url: "http://localhost:5000" } }]
                ]
            };
            bot.sendMessage(chatId, `Hello, ${firstName}!`, {
                reply_markup: replyMarkup
            }).then(() => {
                console.log(`Sent welcome message to ${firstName}`);
            }).catch(err => {
                console.log('Error sending message:', err);
            });
        });
    });
    const admins = {};
    database_1.db.each("SELECT telegram_id FROM admins", (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
        }
        admins[row.telegram_id] = true;
    });
    bot.onText(/\/adminhello (\d+) (.+)/, (msg, match) => {
        var _a;
        const chatId = msg.chat.id;
        if (((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id) !== undefined && !admins[msg.from.id.toString()]) {
            bot.sendMessage(chatId, "You are not authorized to use this command.");
            return;
        }
        const targetId = match && match[1];
        const text = match && match[2];
        if (targetId !== null && text !== null) {
            bot.sendMessage(targetId, `Hello from admin: ${text}`).then(() => {
                console.log(`Sent admin message to ${targetId}`);
            }).catch(err => {
                console.log('Error sending admin message:', err);
            });
        }
    });
}).catch(err => {
    console.error('Failed to initialize the database', err);
});
