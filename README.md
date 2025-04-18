# 🐾 Digital Pet Application

A fun and interactive **Digital Pet** web application that allows users to adopt, care for, and interact with a virtual pet. This project demonstrates key front-end and back-end concepts, including state management, authentication, and persistent data storage.

## 🚀 Live Demo

👉 [https://digitolo.vercel.app](https://digitolo.vercel.app)

---

## 📘 Pet Care Mechanics

- 🍼 **Feeding**: Keep your pet healthy by feeding it regularly.
- 😴 **Resting**: Ensure your pet gets enough rest to stay energetic.
- 💖 **Interaction**: Play and engage with your pet to build a bond.
- 🕒 **Real-Time Updates**: Pet’s status changes over time—neglect can lead to a sad or unhealthy pet.
- 🎖️ **Progression**: Users can level up their pets through consistent care.

---

## ⚙️ Tech Stack

### 🔷 Frontend
- **React JS** with **TypeScript**
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Vite** for development and build
- **React Hot Toast** for notifications

### 🔶 Backend
- **Node.js** with **TypeScript**
- **Express.js** as the framework
- **MongoDB** with Mongoose
- **Cookie-based Auth** for sessions
- **REST API** structure
- **CORS** configured for secure cross-origin requests

---

## 🧱 Architecture & Best Practices

This project is structured using **Clean Architecture** principles with a clear separation of concerns and responsibility.

- ✅ Follows the **Repository Pattern** in the backend
- ✅ Adheres to **SOLID Principles**:
  - **S**ingle Responsibility Principle
  - **O**pen/Closed Principle
  - **L**iskov Substitution Principle
  - **I**nterface Segregation Principle
  - **D**ependency Inversion Principle
- ✅ Easy to scale and maintain
- ✅ Modular, testable components

### 📂 Folder Structure (Backend)

backend/ 
  ├── config/ # DB config, environment variables 
  ├── controllers/ # Handle request and response logic 
  ├── middleware/ # Authentication, error handling, etc. 
  ├── models/ # Mongoose schemas 
  ├── repositories/ # Data access logic (abstracted) 
  ├── routes/ # API endpoints 
  ├── services/ # Business logic layer 
  ├── utils/ # Helper functions 
  └── index.ts # App entry point