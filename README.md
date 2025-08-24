# StreamSync

StreamSync is a full-stack language learning and chat and video calling platform built with React, Vite, Node.js, Express, MongoDB, and Stream API for real-time messaging and video calls.

## Features

- User authentication (signup, login, logout)
- Onboarding with profile setup (bio, languages, location, avatar)
- Friend requests and connections
- Real-time chat powered by Stream API
- Video calls using Stream Video SDK
- Theme selection (DaisyUI + TailwindCSS)
- Responsive UI with modern design

## Project Structure

```
StreamSync/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (Atlas or local)
- Stream API account (get API key and secret)

### Live Demo 

- [StreamSync](https://streamsync-bf0a.onrender.com)

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/Aryu007/streamsync.git
cd streamsync
```

#### 2. Configure environment variables

- Copy `.env` files in both `backend/` and `frontend/` folders.
- Fill in your MongoDB URI, Stream API key/secret, and JWT secret in `backend/.env`.
- Set your Stream API key in `frontend/.env`.

#### 3. Install dependencies

```sh
npm run build
```

This will install dependencies for both backend and frontend.

#### 4. Run the backend server

```sh
npm run start
```

#### 5. Run the frontend (development)

```sh
cd frontend
npm run dev
```

Frontend will be available at http://localhost:5173.

## Build for Production

```sh
npm run build
```

## Technologies Used

- **Frontend:** React, Vite, TailwindCSS, DaisyUI, Zustand, React Query, Stream Chat/Video SDK
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Stream API
