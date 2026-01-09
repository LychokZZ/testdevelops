<div align="center">

# Quiz Builder

**Full-stack quiz creation & playing platform**

Modern web application for creating, browsing, and taking interactive quizzes

</div>

<br/>

## ✨ Key Features

- Create quizzes with multiple question types  
- Dynamic add/remove questions interface  
- Browse all available quizzes  
- Read-only quiz preview  
- Engaging one-question-at-a-time play mode  
- Progress bar + final score screen

## 🛠 Tech Stack

| Layer        | Technologies                                    |
|--------------|-------------------------------------------------|
| **Frontend** | Next.js 14+ (App Router), TypeScript, SCSS Modules |
| **Backend**  | Node.js, TypeScript, Prisma ORM                 |
| **Database** | PostgreSQL (recommended) / SQLite (for local dev) |
| **Styling**  | SCSS Modules (scoped styles)                    |
| **Tools**    | ESLint + Prettier, Prisma Studio, dotenv        |

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/quiz-builder.git
cd quiz-builder

# 2. Install dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# 3. Setup environment (backend)
cp backend/.env.example backend/.env
# Edit .env → set DATABASE_URL & CORS_ORIGIN

# 4. Database setup
cd backend
npx prisma generate
npx prisma migrate dev --name init

# 5. Run (in separate terminals)
# Backend
cd backend
npm run dev

Here is a clean, modern, and well-structured README.md version fully in English:
Markdown<div align="center">

# Quiz Builder

**Full-stack quiz creation & playing platform**

Modern web application for creating, browsing, and taking interactive quizzes

</div>

<br/>

## ✨ Key Features

- Create quizzes with multiple question types  
- Dynamic add/remove questions interface  
- Browse all available quizzes  
- Read-only quiz preview  
- Engaging one-question-at-a-time play mode  
- Progress bar + final score screen

## 🛠 Tech Stack

| Layer        | Technologies                                    |
|--------------|-------------------------------------------------|
| **Frontend** | Next.js 14+ (App Router), TypeScript, SCSS Modules |
| **Backend**  | Node.js, TypeScript, Prisma ORM                 |
| **Database** | PostgreSQL (recommended) / SQLite (for local dev) |
| **Styling**  | SCSS Modules (scoped styles)                    |
| **Tools**    | ESLint + Prettier, Prisma Studio, dotenv        |

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/quiz-builder.git
cd quiz-builder

# 2. Install dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# 3. Setup environment (backend)
cp backend/.env.example backend/.env
# Edit .env → set DATABASE_URL & CORS_ORIGIN

# 4. Database setup
cd backend
npx prisma generate
npx prisma migrate dev --name init

# 5. Run (in separate terminals)
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
After starting:

Frontend → http://localhost:3000
API → http://localhost:4000
Prisma Studio → http://localhost:5555 (npx prisma studio)

Supported Question Types

Type,Description,Example answer
BOOLEAN,True / False,true / false
INPUT,Short free-text answer,"""const"", ""useState"", ""flex"""
CHECKBOX,Multiple choice (multiple correct),"[""string"", ""number"", ""boolean""]"

Main API Endpoints

POST    /quizzes           → create new quiz
GET     /quizzes           → list all quizzes
GET     /quizzes/:id       → get quiz details (with questions)
DELETE  /quizzes/:id       → delete quiz

Project Structure


quiz-builder/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   ├── .env.local
│   └── package.json
│
└── README.md

Useful Commands


# Backend
npm run dev          # development server
npm run lint         # run linter
npx prisma studio    # open database GUI

# Frontend
npm run dev          # start Next.js dev server
npm run lint         # run linter
npm run build        # production build