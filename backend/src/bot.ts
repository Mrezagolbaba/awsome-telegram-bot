import TelegramBot from 'node-telegram-bot-api';
import { db, initDb } from './database';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN as string;
const bot = new TelegramBot(token, { polling: true });

initDb().then(() => {
  bot.on('message', (msg) => {
    console.log('Received message:', msg);
  });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || 'there';


    // Update the database with the user information
    try {
    // Check if the user already exists
      const userExists = await db.get("SELECT 1 FROM users WHERE telegram_id = ?", [chatId]);

      if (!userExists) {
        await db.run("INSERT INTO users (telegram_id, first_name) VALUES (?, ?)", [chatId, firstName]);
      } else {
        console.log(`User already exists: ${firstName} (${chatId})`);
      }

      // Prepare the URL with the Telegram ID as a query parameter
      const webAppUrl = `${process.env.HTTP_EXPOSE_URL}?telegram_id=${chatId}`;

      // Send the welcome message to the user
      const replyMarkup = {
        inline_keyboard: [
          [{ text: "Open Web App", web_app: { url: webAppUrl } }] // Replace with your ngrok URL
        ]
      };
      await bot.sendMessage(chatId, `Hello, ${firstName}!`, {
        reply_markup: replyMarkup
      });
    } catch (err:any) {
      console.log('Database error:', err.message);
    }
  });

  const admins: { [key: string]: boolean } = {};

  // Populate admins from the database
  db.each("SELECT telegram_id FROM admins", (err: Error, row: { telegram_id: string }) => {
    if (err) {
      console.error('Database error:', err.message);
    }
    admins[row.telegram_id] = true;
  });

  bot.onText(/\/adminhello (\d+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;

 
    if (msg.from?.id !== undefined && !admins[msg.from.id.toString()]) {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
      return;
    }

    const targetId = match && match[1];
    const text = match && match[2];

    if (targetId !== null && text !== null) {
      try {
        await bot.sendMessage(targetId, `Hello from admin`);
        console.log(`Sent admin message to ${targetId}`);
      } catch (err) {
        console.log('Error sending admin message:', err);
      }
    }
  });
  bot.onText(/\/adminusers (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;


    const isAdmin = await db.get("SELECT 1 FROM admins WHERE telegram_id = ?", [msg.from?.id.toString()]);

    if (!isAdmin) {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
      return;
    }

    const targetId = match && match[1];

    if (targetId) {

      try {
        const users = await db.all("SELECT telegram_id, first_name FROM users");
        const userNames = users.map(user => `${user.first_name} (${user.telegram_id})`).join('\n');
        await bot.sendMessage(targetId, `Users:\n${userNames}`);
      } catch (err) {
        console.log('Error sending users:', err);
        await bot.sendMessage(chatId, 'Error retrieving users.');
      }
    } else {
      await bot.sendMessage(chatId, 'Please provide a valid target user ID.');
    }
  });
}).catch(err => {
  console.error('Failed to initialize the database', err);
});
