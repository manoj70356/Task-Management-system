# ✅ Task Management System – Full Stack Application

#### A full-stack Task Management System built using React (Hooks) for the frontend and Django + Django REST Framework for the backend.
#### The application allows users to securely register, log in using JWT authentication, and manage their personal tasks efficiently.


🚀 Features
🔐 Authentication

User Registration (Email & Password)

User Login with JWT Token

Protected APIs (Only logged-in users can access tasks)

Secure token-based authentication

📝 Task Management

Create new tasks

Update existing tasks

Delete tasks

View personal task list

Filter tasks by status:

Pending

In Progress

Completed

📊 Task Fields

Title

Description

Status

Due Date

Created & Updated timestamps

Created by (linked to authenticated user)

🧩 Tech Stack
Frontend

⚛️ React (with Hooks)

Axios for API requests

React Router for navigation

Material UI / Bootstrap / Tailwind (UI Styling)

Backend

🐍 Django

Django REST Framework

JWT Authentication (Simple JWT)

PostgreSQL / SQLite Database

Bonus

🐳 Docker support (optional)

🔗 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register/	Register user
POST	/api/auth/login/	Login user (JWT)
Tasks
Method	Endpoint	Description
GET	/api/tasks/	List user tasks (Paginated)
POST	/api/tasks/	Create new task
PUT	/api/tasks/:id/	Update task
DELETE	/api/tasks/:id/	Delete task
