# J&J Beauty Bar Salon Management System

A full-stack **Salon Management System** developed for **J&J Beauty Bar** to streamline salon operations such as appointment booking, customer management, staff scheduling, service management, payment processing, and receipt generation.

This system provides separate dashboards for **Admin**, **Staff**, and **Customers**, with secure authentication and a modern responsive user interface.

---

## Salon Information

**Business Name:** J&J Beauty Bar  
**Contact Persons:** Rachidi Jane / Rachidi Jessica  
**Phone Numbers:** 0639390931 / 0608185119  
**Email Address:** mamcyrachidi@icloud.com  
**Physical Address:** Strydkraal B Mabokotswane House 20057

---

## Features

### Customer Features
- Create customer account
- Secure login/logout
- Browse hairstyle and nail style services with pictures
- Book appointments
- View booking status
- View payment status
- Download and print professional receipts
- Receive notifications
- Manage personal profile

### Admin Features
- Secure admin-only dashboard
- Approve or reject bookings
- Approve cash payments
- Register customers
- Register staff members
- Add, edit, and delete hairstyles
- Add, edit, and delete nail styles
- Manage services and pricing
- View analytics dashboard
- View popular services
- Manage receipts
- Manage FAQs
- Manage notifications

### Staff Features
- View assigned appointments
- View schedules
- Update appointment progress
- Access customer booking details

---

## System Rules

- Bookings allowed only between **08:00 AM and 06:00 PM**
- Maximum **2 simultaneous bookings** allowed per timeslot
- All bookings require **admin approval**
- Cash payments require **admin confirmation**
- Customer accounts are automatically assigned the **Customer** role
- Only the pre-created admin account can access the admin dashboard

---

## Default Admin Login

Use these credentials to access the admin dashboard:

**Email:** `mamcyrachidi@icloud.com`  
**Password:** `Mokgaga@11`

---

## Tech Stack

### Frontend
- **React**
- **Material UI**
- **Axios**
- **Formik**
- **Yup**
- **Recharts**
- **Vite**

### Backend
- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **JWT Authentication**
- **bcrypt**

### Database
- **MySQL**

---

## Project Structure

```bash
salon_system/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── public/
│
└── README.md
```

---

## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Moroka21/salon-management-system.git
cd salon-management-system
```

---

### 2. Setup Database

Open MySQL and create the database:

```sql
CREATE DATABASE salon_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file and add:

```env
PORT=5000
DB_NAME=salon_system
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Database Tables

The system uses the following main tables:

- **Users**
- **Appointments**
- **Services**
- **Payments**
- **Receipts**
- **Notifications**
- **FAQs**
- **Reviews**
- **Inventory**
- **Suppliers**

---

## Security Features

- JWT authentication
- Password hashing using bcrypt
- Protected admin routes
- Role-based access control
- Form validation on frontend and backend
- Duplicate account prevention

---

## Author

**Mohomotsi Mphahlele**

---

## Project Purpose

This project was developed to digitize and automate salon operations for **J&J Beauty Bar**, improving booking efficiency, customer experience, payment tracking, and administrative management.
