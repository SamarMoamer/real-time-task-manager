# 🗂️ Real-Time Task Manager

A **full-stack, real-time web application** to manage tasks with live updates across multiple devices.  
Built with **Node.js, Express.js, MongoDB, Socket.io, and Vue.js** for a modern, responsive, and scalable solution.

---

##  Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Real-Time Features](#real-time-features)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

##  Project Overview
This project is a capstone for **full-stack development** with Node.js and Vue.js.  
It allows users to:

- Register and log in securely (JWT authentication)
- Manage tasks (create, read, update, delete)
- Categorize tasks by status or priority
- Collaborate and see real-time updates
- Customize profile and preferences

---

## Features

**Authentication & Authorization**
- JWT-based login and registration
- Role-based access (Admin / Standard User)

**Task Management**
- CRUD operations for tasks
- Assign priority and status
- Real-time updates via Socket.io

**Frontend**
- Vue.js 3 with Pinia for state management
- Tailwind CSS for responsive UI
- Common/shared components for reusability
- Profile page and user personalization

**Backend**
- Node.js + Express.js RESTful API
- MongoDB + Mongoose schema design
- Middleware: validation, logging, error handling, rate limiting
- Secure password hashing (bcrypt)

**Optional Advanced Features**
- Notifications and reminders
- Integration with Google Calendar
- File uploads for tasks or profile pictures
- Dashboard analytics and charts

---

## Tech Stack

| Layer       | Technology                                      |
|------------|-------------------------------------------------|
| Frontend    | Vue.js 3, Pinia, Vue Router, Tailwind CSS      |
| Backend     | Node.js, Express.js, MongoDB, Mongoose         |
| Real-Time   | Socket.io                                       |
| Auth/Security | JWT, bcrypt, Helmet, CORS, Rate-limiting      |
| Tools      | Git, GitHub, Postman, VSCode                   |

---

## Installation

### Backend

cd backend
npm install
cp .env.example .env   # configure environment variables
npm run dev
Frontend
bash

cd frontend
npm install
npm run serve
Ensure the backend is running before starting the frontend.

Usage
Register a new account (Admin or User)

Log in to access the dashboard

Create, update, delete, and complete tasks

Tasks synchronize in real-time across devices

Access profile and shared components

 API Endpoints
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login user
GET	/tasks	Get all tasks
POST	/tasks	Create new task
PUT	/tasks/:id	Update task
DELETE	/tasks/:id	Delete task

Use JWT token in headers for protected routes.

Real-Time Features
Live task updates across multiple sessions

Dashboard and task lists update instantly

Optional: notifications for task changes

📂 Folder Structure
bash

backend/
 ├─ controllers/
 ├─ models/
 ├─ routes/
 ├─ middleware/
 └─ services/

frontend/
 ├─ src/
 │   ├─ components/      # Shared & UI components
 │   ├─ views/           # Pages (Dashboard, Profile, Tasks)
 │   ├─ stores/          # Pinia stores
 │   ├─ router/          # Vue Router setup
 │   └─ assets/          # Images, icons, styles
 ├─ main.js
 └─ App.vue
Contributing
Fork the repository

Create a feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'feat: add feature')

Push to the branch (git push origin feature/your-feature)

Open a Pull Request

License
This project is licensed under MIT License © [Samar]

 Tips to Improve
Add screenshots or GIFs of the dashboard and task flow

Include Postman collection for API testing

Deploy to Render, Vercel, or Netlify for live demo

Keep commit messages consistent and descriptive
