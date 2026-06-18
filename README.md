# 🌟 NeuroSync — Digital Mental Health & Psychological Support System

NeuroSync is a comprehensive full-stack platform designed to provide accessible mental health support for students in higher education. It connects students with counselors, offers AI-assisted support, and streamlines appointment management through role-based dashboards.

## 🚀 Key Features

### 👤 User Roles
- **Students**: Book appointments, view history, access Sage AI (`/chatbot`), participate in the Community Wall (`/community`), and manage profile.
- **Counselors**: Manage appointments, view requests, and update availability.
- **Admins**: Manage users (Students/Counselors), view system statistics, and oversee appointment flows.

### 🤖 Sage AI — Intelligent Companion
- Integrated **Sage AI** powered by Groq (Llama 3.1 70B) for 24/7 immediate support and guidance.
- Conversational interface with context-aware responses.
- Quick suggestion prompts for common mental health topics.

### 💬 Community Wall
- **Anonymous posting** — share thoughts in a safe, judgment-free space.
- **Likes & comments** — engage with others while staying anonymous.
- **Pre-seeded content** — launches with realistic posts to foster participation.
- **Real-time feed** — new posts appear instantly without page refresh.
- **Share functionality** — Web Share API with clipboard fallback.

### 🔐 Security
- **Authentication**: JWT-based secure login.
- **Protection**: Role-based route protection.
- **Password Security**: Password hashing with bcrypt.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Groq API
- **Authentication**: JSON Web Tokens (JWT)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone <repository_url>
cd NeuroSync
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```
> **Note**: Get your free Groq API key from [https://console.groq.com](https://console.groq.com).

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
# Client runs on http://localhost:5173
```

## 📖 Usage Guide

1. **Register/Login**:
   - Students can sign up directly.
   - Counselors sign up but require Admin approval.
   - Admins are pre-configured in the database.

2. **Booking Appointments**:
   - Students select a counselor and available slot.
   - Counselors approve or reject the request.

3. **Using Sage AI**:
   - Navigate to the **Sage AI** tab in the navbar for instant AI-powered support.
   - Use quick suggestion buttons or type your own message.

4. **Community Wall**:
   - Go to the **Community** tab to view anonymous posts.
   - Log in to share your thoughts, like posts, and leave comments.
   - All activity is anonymous — your identity is never revealed.

## 📄 License
This project is licensed under the ISC License.
