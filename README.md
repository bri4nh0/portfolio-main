Portfolio Website
A full-stack developer portfolio with dynamic blog and contact system.

🌐 Live Demo
Portfolio: https://portfolio-main-flame-five.vercel.app

API: https://portfolio-main-i403.onrender.com

🛠️ Tech Stack
Frontend: React, Vite, Tailwind CSS

Backend: Node.js, Express, PostgreSQL (Neon)

Deployment: Vercel (frontend), Render (backend), Neon (database)

✨ Features
Dynamic blog with view tracking

Contact form with database storage

GitHub projects integration

Full-stack architecture

🚀 Quick Start
bash
git clone https://github.com/bri4nh0/portfolio-main.git
cd portfolio-main
npm install
cd server && npm install
# Set up environment variables and database
npm run dev
📁 Project Structure
src/ - React frontend components

server/ - Express backend API

public/ - Static assets

📬 API Endpoints
GET /api/posts - Get all blog posts

GET /api/posts/:id - Get single post (increments views)

POST /api/contact - Submit contact form

Built with React, Express, PostgreSQL • Deployed on Vercel + Render + Neon