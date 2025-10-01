# Sticky Notes App

A full-stack notes application built with:

- **Frontend:** React, TypeScript, Vite  
- **Backend:** Node.js, Express  
- **Database:** MySQL (via Docker)  
- **Deployment:** Docker & Docker Compose  


## Features

- ✍️ Create, edit, and delete notes  
- 📱 Responsive UI with React + Vite  
- 🔐 Environment-based configuration for local and production builds  
- 🐳 Easy setup with Docker Compose (backend + database)  


## Project Structure


```
notes-app/
├── frontend/           # React + Vite client
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── backend/            # Express server + DB initialization  
│   ├── server/
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── db/
│   │   └── init.sql
│   └── .env.example
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```


## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/nicholas-camp/notes-app.git
cd notes-app
```

### 2. Environment variables

Create `.env` files for both frontend and backend.
Do not commit these — instead copy from `.env.example`.

**Backend** (`backend/server/.env`)

- **With Docker Compose:** 
```env
MYSQL_HOST=db
MYSQL_USER=myuser
MYSQL_PASSWORD=mypassword
MYSQL_DATABASE=myapp
PORT=3000
```

- **Running locally without Docker:** 
```env
MYSQL_HOST=localhost
MYSQL_USER=youruser
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=notes
PORT=3000
```

**Frontend** (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

### 3. Run with Docker (recommended)

From the repo root, navigate into the backend folder:

```bash
cd backend
docker compose up --build
```

This starts:
- **db** (MySQL 8.0)
- **backend** (Node.js + Express)
- **frontend** (React + Vite dev server)

The app will be available at: **http://localhost:5173**


### 4. Run locally (without Docker)

**Backend:**
```bash
cd backend/server
npm install
npm run db
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```


## Database Initialization

**With Docker:**  
The DB is automatically initialized from `backend/db/init.sql` if no database exists. Otherwise, the existing database is used.

**Without Docker:**  
Run the initialization script after installing dependencies:
```bash
cd backend/server
npm run db
```
Modify `backend/db/init.sql` to customize your schema and seed data.


## Scripts

**Frontend:**
- `npm run dev` → Start Vite dev server
- `npm run build` → Create a production build

**Backend:**
- `npm run dev` → Start server with hot reload (ts-node)
- `npm run start` → Start compiled server (dist)
- `npm run db` → Initialize database (only needed when running without Docker)


## License
This project is licensed under the [MIT License](./LICENSE).


