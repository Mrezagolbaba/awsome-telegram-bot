# Telegram Bot and Web App

This repository contains both the backend (Telegram Bot) and the frontend (Web App) components for a Telegram-based application.

## Project Structure


```Awsome-Telegram_Bot/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── bot.ts
│   │   └── database.ts
│   ├── database.sqlite
│   └── .env
├── frontend/
│   ├── package.json
│   ├── public/
│   ├── static/
│   ├── test/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── +page.svelte
│   │   │   └── profile/
|   |   |       ├── +page.svelte
│   │   ├── styles/
│   │   │   ├── home.css
│   │   ├── app.html
│   │   └── index.test.js
│   │   ├── lib/
│   │   │   ├── store.js
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (for local development)
- SQLite
- ngrok (for expose local url as https)




### Install the requirments
1. **backend:**

```
cd backend
npm install
```

2. **fonrend:**
```
cd frontend
npm install
```


### Running the Application
1. **backend:**

```
cd backend
npm install
```

2. **fonrend:**
```
cd frontend
npm install
```
3. **ngrok:**
```
ngrok http 5173
```
### Setting Up Environment Variables

Create a `.env` file in  `backend` directoriy and add the necessary environment variables.

**Backend `.env` example:**
```
TELEGRAM_BOT_TOKEN= 7411594207:AAHt8snRM8KWKDVqv4U5nM4pLHsSyNmYIfI
HTTP_EXPOSE_URL= https://39b9-46-131-88-178.ngrok-free.app/
```


**Commands:**

```
/start
/adminhello
/adminusers admin_Telegram_ID

