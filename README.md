# Zoom Clone - Full Stack Video Conferencing Web Application

A full-stack, real-time video conferencing web application built with **React**, **Node.js**, **Express**, **Socket.io**, and **MongoDB**. This project allows users to register, log in, view meeting history, join rooms using a unique code, and conduct real-time video calls with group messaging and screen sharing capabilities.

---

## 🚀 Key Features

* **Real-time Video & Audio Call:** Peer-to-peer connection for smooth video/audio streams.
* **Instant Messaging (Chat):** Live chat room during video meetings.
* **Screen Sharing:** Share your screen with other participants in the meeting.
* **Meeting History:** Authenticated users can save and view a history of meetings they have joined or created.
* **User Authentication:** Secure signup and login using hashed passwords (`bcrypt`).
* **Protected Routes:** User dashboard and meeting history are restricted to logged-in users.
* **Responsive UI:** Clean, modern interface designed using Material UI (MUI).

---

## 📁 Project Directory Structure

```text
video conference/
├── backend/                  # Node.js + Express Backend Server
│   ├── src/
│   │   ├── controllers/      # Route controllers and Socket event manager
│   │   │   ├── socketManager.js # Signaling server for WebRTC and messaging
│   │   │   └── user.controller.js # Auth and user history logic
│   │   ├── models/           # Mongoose schemas for MongoDB
│   │   │   ├── meeting.model.js   # Meeting log schema
│   │   │   └── user.model.js      # User account schema
│   │   ├── routes/           # REST API routes
│   │   │   └── users.routes.js    # Auth & history endpoints
│   │   └── app.js            # Server entry point (Mongoose connection, server ports)
│   ├── .env.example          # Template for backend environment variables
│   ├── package.json          # Node backend dependencies
│   └── package-lock.json
│
├── frontend/                 # React SPA Frontend Client
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── contexts/         # React Contexts
│   │   │   └── AuthContext.jsx # Handles user login state & API calls
│   │   ├── pages/            # View Pages
│   │   │   ├── authentication.jsx # Sign Up and Login page
│   │   │   ├── history.jsx        # Previous meetings logs page
│   │   │   ├── home.jsx           # Dashboard to join or start a meeting
│   │   │   ├── landing.jsx        # App landing/welcome page
│   │   │   └── VideoMeet.jsx      # Meeting room with video feeds, screen share, and chat
│   │   ├── styles/           # CSS modules
│   │   │   └── videoComponent.module.css
│   │   ├── utils/            # Utility HOCs
│   │   │   └── withAuth.jsx  # Auth protection middleware for UI routes
│   │   ├── App.js            # App routers and routing definitions
│   │   ├── environment.js    # Toggles development/production API URL
│   │   └── index.js          # React entry point
│   ├── package.json          # React dependencies
│   └── package-lock.json
│
└── .gitignore                # Root gitignore excluding node_modules & credentials
```

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (v18)
* **Material UI (MUI)** (for UI layout and styling components)
* **Socket.io-client** (for real-time communication with signaling server)
* **Axios** (for HTTP API requests)
* **React Router Dom** (for client-side routing)

### Backend
* **Node.js**
* **Express.js**
* **MongoDB & Mongoose** (for database storage)
* **Socket.io** (for WebRTC signaling and chat rooms)
* **Bcrypt** (for password hashing)

---

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher is recommended)
* [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (or a local MongoDB instance running on your machine)

---

## 🛠️ Installation & Setup

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Meetx
```

### 2. Configure Backend `.env`
1. Navigate into the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open the `.env` file and replace the values with your credentials:
   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.vhex2jc.mongodb.net/videocall_db?appName=Cluster0
   PORT=8000
   ```

### 3. Install Dependencies
Install dependencies for both **backend** and **frontend** components:
* **For Backend:**
  ```bash
  cd backend
  npm install
  ```
* **For Frontend:**
  ```bash
  cd ../frontend
  npm install
  ```

---

## 🏃‍♂️ How to Run Locally

You need to run both the backend server and frontend server simultaneously.

### Step 1: Start Backend Server
Navigate to the `backend` folder and run:
```bash
cd backend
npm start
```
The server will connect to MongoDB and start listening on `http://localhost:8000`.

### Step 2: Start Frontend Client
Navigate to the `frontend` folder and run:
```bash
cd frontend
npm start
```
This will start the React development server and automatically open the application at `http://localhost:3000` in your web browser.

---

## 🛡️ Important Security Tip for GitHub Upload
Before you push your code to GitHub, ensure that **`.env` files** containing your database credentials are not tracked by Git. 
The project includes a root [`.gitignore`](file:///c:/Users/Manish/Desktop/video%20confrence/.gitignore) that automatically blocks `.env` and `node_modules` from being uploaded. Do **not** remove or modify these rules.

---

## 📄 License
This project is open-source and available under the ISC License.
