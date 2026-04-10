# ChatApp

A full-stack real-time chat application built with the MERN stack, Socket.IO, React, Zustand, and Tailwind CSS.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Frontend: React (Vite), Zustand, Tailwind CSS, DaisyUI
- Auth: JWT (HTTP-only cookie)

## Project Structure

- `backend/` - API, auth, messaging, DB models, Socket.IO server
- `frontend/` - React app (Vite)
- `package.json` - root scripts for running/building the app

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Notes:
- `MONGODB_URI` is also supported as an alternative to `MONGODB_URL`.
- `CLIENT_URL` should match your frontend origin for Socket.IO CORS.

## Installation

From the project root:

```bash
npm install
npm install --prefix frontend
```

## Run In Development

1. Start backend (from project root):

```bash
npm run server
```

2. Start frontend (new terminal):

```bash
npm run dev --prefix frontend
```

3. Open:

```text
http://localhost:3000
```

## Production Build + Run

From project root:

```bash
npm run build
npm start
```

This builds the frontend to `frontend/dist` and serves it from the backend server.

## Available Scripts (Root)

- `npm run server` - run backend with nodemon
- `npm start` - run backend with node
- `npm run build` - install deps and build frontend

## API Base Paths

- `/api/auth`
- `/api/messages`
- `/api/user`

## License

ISC
