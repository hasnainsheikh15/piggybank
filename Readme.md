
# 🐷 PiggyBank – Smart Savings & Goal-Based Wallet System

PiggyBank is a **goal-based digital wallet application** designed to help users save money intentionally by locking funds against specific goals rather than allowing unrestricted spending.

The project is currently in **active development** and is implemented as a **full-stack prototype** with real backend logic, partial frontend integration, and clearly identified prototype components.

This README reflects the **actual state of the project**, including completed features, partially implemented components, and planned work.

---

## 🚀 Project Vision

PiggyBank aims to:

- Encourage **disciplined saving habits**
- Prevent **impulsive withdrawals**
- Provide **clear visibility into savings goals**
- Deliver a **modern, premium fintech-style user experience**

### Core Idea

> **Users save money into goals, not just into a wallet.**

Funds are attached to specific goals, creating both a psychological and technical barrier against careless spending.

---

## 🏗️ Tech Stack

### Frontend
- HTML
- CSS (Dark UI + Glassmorphism design)
- Vanilla JavaScript
- Responsive design (desktop-first)
- UI animations & effects (experimental / optional)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- OTP-based authentication
- JWT-based authentication 

---

## ✅ Implemented Features (Fully Working)

### 🔐 Authentication
- User registration using **email and phone**
- OTP-based signup verification
- Successful OTP verification redirects directly to the dashboard
- Verified users are persisted correctly in the database

### 👤 User Management
- User model includes:
  - Name
  - Email
  - Phone
  - Verification status
  - Account creation date
- Verified users are marked correctly in the UI
- User information is dynamically rendered on the dashboard

### 💼 Wallet System
- Wallet balance is derived from transaction records
- Credit and debit transactions are tracked
- Wallet balance is calculated dynamically from backend data

### 📊 Dashboard Backend (Real Data)
The dashboard API aggregates and returns:
- Wallet balance
- User goals
- Recent transactions
- Monthly analytics (last 6 months)

MongoDB aggregation pipelines are used to calculate analytics efficiently.

### 📈 Analytics (Backend)
- Monthly savings data calculated from transactions
- Backend returns structured analytics data
- Analytics logic is real and production-oriented

---


## ⏳ Pending / Planned Features

### 🧠 UX Improvements
- Skeleton loaders
- Empty states
- Error handling and boundaries
- Toast notifications

---

## 📁 Project Structure (Simplified)

```
piggybank/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── public/
│   ├── index.html
│   ├── register.html
│   ├── verifyotp.html
│   ├── dashboard.html
│   └── assets/
│
└── README.md
```

---

## ⚠️ Important Notes (Transparency)

- This project is **not production-ready**
- Payment flows are **not live**
- Some UI data is intentionally mocked for design iteration
- Security hardening is ongoing
- The project is built honestly as a **learning + real-world prototype**, not a fake “fully completed” app

---

## 🎯 Why This Project Exists

PiggyBank is built to demonstrate:

- Real backend thinking
- Clean REST API design
- Proper separation of concerns
- Realistic product development stages
- Honest handling of incomplete features

The project prioritizes **correct architecture and learning** over superficial completeness.

---

## 📌 Current Status

- **Status:** 🟡 Active Development  
- **Phase:** MVP + Integration    

---

## 🤝 Contributions & Feedback

This is currently a **solo development project**.

Feedback, suggestions, and architectural discussions are welcome.
