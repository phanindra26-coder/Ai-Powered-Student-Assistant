# 🤖 AI-Powered Student Assistant

An AI-powered full-stack web application designed to help students learn smarter, organize their studies, generate educational content, and track their learning progress from a single platform.

## 🚀 Overview

The **AI-Powered Student Assistant** provides students with an interactive learning environment that combines artificial intelligence, study management, quizzes, notes generation, resources, and progress tracking.

The application follows a full-stack architecture with a React frontend, Node.js/Express backend, MySQL database, JWT authentication, and AI API integration.

## ✨ Features

### 🔐 Authentication

* Student registration
* Secure login
* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Logout functionality

### 🤖 AI Assistant

* Interactive AI-powered chat
* Academic question answering
* Student-friendly explanations
* Chat history
* Multiple conversations

### 📝 Notes Generator

* Generate notes from academic topics
* AI-powered content generation
* Simple and student-friendly explanations

### ❓ Quiz Generator

* Generate quizzes using AI
* Multiple-choice questions
* Answer selection
* Score calculation
* Immediate feedback

### 📅 Study Planner

* Create study tasks
* Set subject and priority
* Set study dates
* Track completed tasks
* Manage personalized study plans

### 📚 Learning Resources

* Educational resources
* Resource categories
* Search and filtering
* Quick access to learning materials

### 📊 Progress Tracking

* Monitor study progress
* Track completed activities
* View learning statistics
* Track quiz performance

### ⚙️ User Settings

* Manage account preferences
* Profile information
* Application preferences
* Secure account management

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* JSX
* Vite
* CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MySQL
* MySQL Workbench

### Authentication & Security

* JWT
* bcrypt.js
* Environment variables
* Protected API routes

### AI

* AI API integration
* Backend-based AI requests
* Secure API key management

## 🏗️ Application Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│ Dashboard                   │
│ AI Assistant                │
│ Notes Generator             │
│ Quiz Generator              │
│ Study Planner               │
│ Resources                   │
│ Progress                    │
│ Settings                    │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│      Node.js + Express      │
│                             │
│ Authentication API          │
│ Chat API                    │
│ Notes API                   │
│ Quiz API                    │
│ Planner API                 │
│ Progress API                │
└──────────────┬──────────────┘
               │
        ┌──────┴───────┐
        ▼              ▼
┌─────────────┐  ┌─────────────┐
│    MySQL    │  │   AI API    │
│  Database   │  │             │
└─────────────┘  └─────────────┘
```

## 📂 Project Structure

```text
AI-Powered-Student-Assistant/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── NotesGenerator.jsx
│   │   │   ├── QuizGenerator.jsx
│   │   │   ├── StudyPlanner.jsx
│   │   │   ├── Resources.jsx
│   │   │   └── Progress.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
├── Backend/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── notesRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── plannerRoutes.js
│   │   └── progressRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

> The structure above describes the main organization of the project. File names may vary slightly depending on the current implementation.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-powered-student-assistant.git
```

```bash
cd ai-powered-student-assistant
```

### 2. Install frontend dependencies

```bash
cd Frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd Backend
npm install
```

## 🔑 Environment Variables

Create a `.env` file inside the `Backend` directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_assistant

JWT_SECRET=your_jwt_secret

AI_API_KEY=your_ai_api_key
AI_MODEL=your_ai_model
```

**Never upload your real `.env` file or API keys to GitHub.**

A safe `.env.example` file is included in the repository.

## 🗄️ Database Setup

1. Install MySQL.
2. Open MySQL Workbench.
3. Create the required database.
4. Create the application tables.
5. Update the backend `.env` file with your database credentials.

Example:

```sql
CREATE DATABASE student_assistant;
```

Use the project's database schema/SQL files if provided.

## ▶️ Running the Application

### Start the Backend

From the `Backend` directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start the Frontend

From the `Frontend` directory:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

## 🔌 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### AI Assistant

```text
POST /api/chat
```

### Notes

```text
POST /api/notes/generate
```

### Quiz

```text
POST /api/quiz/generate
```

### Study Planner

```text
GET    /api/planner
POST   /api/planner
PUT    /api/planner/:id
DELETE /api/planner/:id
```

### Progress

```text
GET  /api/progress
POST /api/progress
PUT  /api/progress
```

> API routes may vary slightly depending on the final backend implementation.

## 🖥️ Screenshots

Add screenshots of the application here.

Example:

### Login

![Login](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### AI Assistant

![AI Assistant](screenshots/ai-assistant.png)

### Notes Generator

![Notes Generator](screenshots/notes.png)

### Quiz Generator

![Quiz Generator](screenshots/quiz.png)

### Study Planner

![Study Planner](screenshots/planner.png)

### Resources

![Resources](screenshots/resources.png)

### Progress

![Progress](screenshots/progress.png)

## 🔒 Security

The application follows basic security practices including:

* Password hashing with bcrypt
* JWT authentication
* Protected backend routes
* Environment variables for secrets
* Parameterized database queries
* User-specific data access
* API keys kept on the backend

Sensitive information such as API keys, database passwords, and JWT secrets should never be committed to GitHub.

## 🧪 Testing

The application was tested across the major workflows:

* Registration
* Login
* Logout
* AI Assistant
* Chat History
* Notes Generation
* Quiz Generation
* Study Planning
* Resources
* Progress
* Navigation
* Authentication-protected functionality

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

* Full-stack web development
* React component development
* REST API development
* Node.js and Express.js
* MySQL database integration
* JWT authentication
* Password security
* AI API integration
* Frontend-backend communication
* API testing
* Debugging
* Git and GitHub
* Responsive UI development

## 🔮 Future Improvements

Possible future enhancements include:

* 📱 Progressive Web App support
* 🎙️ Voice-based AI assistant
* 📈 Advanced learning analytics
* 📅 Calendar integration
* 🔔 Smart study reminders
* 👥 Collaborative study groups
* 🌐 Multi-language learning support
* 📄 AI-powered PDF summarization
* 🎯 Personalized learning recommendations
* ☁️ Cloud deployment

## 👨‍💻 Author

**Phanindra**

Computer Science / Engineering Student

Interested in:

* Full-Stack Development
* Artificial Intelligence
* Machine Learning
* Cloud Computing
* DevOps
* Software Development

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

**Built with React.js, Node.js, Express.js, MySQL, JWT, and AI API integration.**
