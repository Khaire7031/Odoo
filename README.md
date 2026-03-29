# 💼 Reimbursement Management System

### Odoo x VIT Pune Hackathon '26

A modern, scalable web application designed to streamline and automate the employee expense reimbursement process with multi-level approvals, smart rules, and real-time tracking.

---

## 🚀 Problem Statement

Organizations often struggle with **manual reimbursement workflows** that are:

* Time-consuming ⏳
* Error-prone ❌
* Lacking transparency 👀

This system solves these challenges by providing:

* Structured approval workflows
* Role-based access control
* Smart and conditional approval rules

---

## 🎯 Key Features

### 🔐 Authentication & User Management

* Signup creates **Company + Admin**
* Role-based access:

  * Admin
  * Manager
  * Employee
* Admin can:

  * Create users
  * Assign roles
  * Define reporting hierarchy

---

### 💸 Expense Management

* Employees can:

  * Submit expenses (multi-currency)
  * Upload receipts
  * Track status (Pending, Approved, Rejected)
* View complete expense history

---

### 🔁 Approval Workflow

* Multi-level approval system:

  * Manager → Finance → Director
* Sequential approval flow
* Approvers can:

  * Approve / Reject
  * Add comments

---

### 🧠 Smart Approval Rules

* Percentage-based approval (e.g., 60%)
* Specific approver override (e.g., CFO auto-approval)
* Hybrid rule support

---

### 🌍 Currency Handling

* Automatic currency setup based on country
* Real-time currency conversion using external APIs

---

### 📄 OCR Integration (Optional / Bonus)

* Scan receipts
* Auto-extract:

  * Amount
  * Date
  * Vendor details

---

## 🏗️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Mantine UI
* React Router
* Axios

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* MySQL

### Testing

* JUnit
* Mockito
* Jest + React Testing Library

---

## 📁 Project Structure

```bash
backend/
 ├── controller/
 ├── service/
 ├── repository/
 ├── entity/
 ├── dto/
 ├── config/
 ├── security/
 ├── exception/

frontend/
 ├── components/
 ├── pages/
 ├── services/
 ├── routes/
 ├── layouts/
 ├── tests/
```

---

## 🔌 API Endpoints (Sample)

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/login`

### Users

* `POST /api/users`
* `GET /api/users`

### Expenses

* `POST /api/expenses`
* `GET /api/expenses/my`

### Approvals

* `GET /api/approvals/pending`
* `POST /api/approvals/{id}/approve`
* `POST /api/approvals/{id}/reject`

---

## ⚙️ Setup Instructions

### 🖥️ Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Configure `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hackathon
spring.datasource.username=root
spring.datasource.password=yourpassword
```

---

### 🌐 Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## 🌍 External APIs Used

* Countries & Currency:
  https://restcountries.com/v3.1/all?fields=name,currencies

* Currency Conversion:
  https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}

---

## 🎥 Demo

👉 Add your demo video link here (max 5 minutes)

---

## 🧠 Hackathon Highlights

* Clean and scalable architecture
* Real-world workflow implementation
* Role-based dynamic UI
* Smart approval logic

---

## 👥 Team

* Pranav Khaire
* [Add Teammates]

---

## 🙌 Acknowledgements

* Odoo Hackathon Team
* VIT Pune

---

## 📌 Future Enhancements

* Full OCR integration
* Mobile app support
* Advanced analytics dashboard
* Notification system (Email/SMS)

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

---
