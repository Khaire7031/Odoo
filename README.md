# 💼 ReimburseMe — Reimbursement Management System

### Odoo × VIT Pune Hackathon '26

A modern, full-stack web application that streamlines and automates the employee expense reimbursement process with multi-level approvals, smart conditional rules, multi-currency support, and real-time tracking.

---

## 🚀 Problem Statement

Organizations often struggle with **manual reimbursement workflows** that are:

- Time-consuming ⏳
- Error-prone ❌
- Lacking transparency 👀

**ReimburseMe** solves these challenges by providing:

- Structured, sequential approval workflows
- Role-based access control (Admin / Manager / Employee)
- Smart conditional auto-approval rules
- Real-time expense tracking & status visibility

---

## 🎯 Key Features

### 🔐 Authentication & User Management

- **Signup** creates a Company + Admin user in one step
- Country selection auto-detects company base currency
- Role-based sign-in: **Admin**, **Manager**, **Employee** (role selected at login)
- Admin can:
  - Create employees and managers with custom passwords
  - Assign reporting hierarchy (manager per employee)

---

### 💸 Expense Management

- Employees can submit expenses with:
  - Amount, currency, category, description, date
  - Optional receipt upload (drag & drop or click)
- **Real-time currency conversion** using [ExchangeRate API](https://api.exchangerate-api.com)
  - Shows converted amount in the company's base currency
- Track status across: `Pending → Approved / Rejected`
- Full expense history with detail timeline view

---

### 🔁 Multi-Level Approval Workflow

- Admin configures a **sequential approval chain** (e.g., Manager → Finance → Director)
- Steps can be reordered (↑↓) or removed from the Admin panel
- Each approver can: Approve / Reject + add a comment
- Expense progresses step-by-step until fully approved or rejected

---

### 🧠 Smart Approval Rules

Three conditional rule types configurable by Admin:

| Rule Type | Behaviour |
|---|---|
| **Percentage-based** | Auto-approves when X% of approvers have approved |
| **Specific Approver Override** | Auto-approves immediately when a designated person (e.g., CFO) approves |
| **Hybrid** | Auto-approves when either the percentage OR the specific approver approves — whichever comes first |

---

### 🌍 Multi-Currency Handling

- Countries and currencies fetched from the **backend database** (`/api/public/countries`)
- Each expense is stored in the employee's submitted currency
- Converted amount is auto-calculated and displayed in the company's base currency
- Exchange rates fetched live from [ExchangeRate API](https://api.exchangerate-api.com/v4/latest/{BASE})

---

## 🏗️ Tech Stack

### Frontend (`odoo-frontend/`)

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core UI framework |
| Vite | Build tool & dev server (port **8082**) |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library (Radix UI primitives) |
| React Router v6 | Client-side routing |
| Axios | HTTP client with request/response interceptors |
| Lucide React | Icon library |

### Backend (`odoo-backend/`)

| Technology | Purpose |
|---|---|
| Spring Boot 3 | Application framework |
| Spring Security | Password encoding (BCrypt) |
| Spring Data JPA | ORM layer |
| MySQL | Relational database |
| Lombok | Boilerplate reduction |
| Maven | Build & dependency management |

---

## 📁 Project Structure

```
Odoo/
├── odoo-frontend/
│   └── src/
│       ├── components/       # Reusable UI components (Navbar, StatusBadge, etc.)
│       ├── contexts/         # React Contexts (Auth, Company, Expense)
│       ├── data/             # Shared TypeScript types & constants
│       ├── hooks/            # Custom hooks (useToast, etc.)
│       ├── layouts/          # App shell / layout wrappers
│       ├── lib/              # Utility functions
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Signup.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Expenses.tsx
│       │   ├── Approvals.tsx
│       │   └── Admin.tsx
│       ├── routes/           # Route definitions & guards
│       ├── services/
│       │   ├── api.ts        # Axios instance (base URL, interceptors)
│       │   ├── AuthService.ts
│       │   ├── expenseService.ts
│       │   └── userService.ts
│       └── test/             # Vitest unit tests
│
└── odoo-backend/
    └── src/main/java/com/pdk/odoo/
        ├── controller/
        │   ├── AuthController.java
        │   ├── AdminUserController.java
        │   ├── ExpenseController.java
        │   ├── PublicDataController.java
        │   └── HealthCheck.java
        ├── service/
        │   ├── AuthService.java
        │   ├── AdminUserService.java
        │   ├── ExpenseService.java
        │   └── CountryService.java
        ├── dto/
        │   ├── SignupRequest.java / SignupResponse.java
        │   ├── LoginRequest.java  / LoginResponse.java
        │   ├── CreateUserRequest.java
        │   └── ManagerDto.java
        ├── model/
        │   ├── User.java
        │   ├── Company.java
        │   ├── Expense.java
        │   ├── Country.java
        │   ├── Role.java (ADMIN / MANAGER / EMPLOYEE)
        │   └── Designation.java
        ├── repository/        # Spring Data JPA repositories
        └── config/            # Security & app configuration
```

---

## 🔌 API Endpoints

### Auth (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/public/signup` | Register company + admin user |
| `POST` | `/api/public/signin` | Sign in (returns userId, companyId, role, name, token) |
| `GET` | `/api/public/countries` | Fetch all countries with currency info |

**Signin Request Body:**
```json
{
  "username": "admin@company.com",
  "password": "yourpassword",
  "role": "ADMIN"
}
```

**Signup Request Body:**
```json
{
  "fullName": "John Doe",
  "companyName": "Acme Corp",
  "countryName": "India",
  "email": "john@acme.com",
  "password": "secret123"
}
```

---

### Admin (Company-scoped)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/companies/{companyId}/managers` | List all managers in a company |
| `POST` | `/api/admin/companies/{companyId}/users` | Create a new employee or manager |

**Create User Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@acme.com",
  "role": "EMPLOYEE",
  "managerId": 5,
  "password": "pass123"
}
```
> If `password` is null or empty, the default password `Welcome123!` is assigned.

---

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/expenses/{userId}` | Get expenses for a user |

---

## ⚙️ Setup Instructions

### 🗄️ Database (MySQL)

Create the database before starting the backend:

```sql
CREATE DATABASE odoo;
```

---

### 🖥️ Backend (Spring Boot)

```bash
cd odoo-backend
mvn clean install
mvn spring-boot:run
```

Configure `src/main/resources/application.properties` if needed:

```properties
server.port=8081

spring.datasource.url=jdbc:mysql://localhost:3306/odoo
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

The backend runs at: **http://localhost:8081**

---

### 🌐 Frontend (React + Vite)

```bash
cd odoo-frontend
npm install
npm run dev
```

The frontend runs at: **http://localhost:8082**

Environment variables (optional, create `.env` in `odoo-frontend/`):

```env
VITE_API_BASE_URL=http://localhost:8081/
```

---

## 🔄 Application Flow

```
User visits /signup
  → Fills Name, Company, Country, Email, Password
  → Backend creates Company + Admin user
  → Auto sign-in → redirected to /dashboard

User visits /login
  → Enters Email, Password, selects Role
  → Backend verifies credentials + role match
  → JWT-style token stored in localStorage
  → Redirected to /dashboard

Admin visits /admin
  → Creates managers (with password)
  → Creates employees, assigns manager
  → Configures approval sequence & smart rules

Employee visits /expenses
  → Submits new expense (amount, currency, category, description, date)
  → Currency auto-converted to company base currency
  → Expense enters approval queue

Manager/Admin visits /approvals
  → Reviews pending expenses
  → Approve or Reject with optional comment
  → Smart rules evaluated after each approval
```

---

## 🌍 External APIs Used

| API | Purpose |
|---|---|
| `https://api.exchangerate-api.com/v4/latest/{BASE}` | Real-time currency conversion |
| Backend `/api/public/countries` | Country + currency data (served from DB) |

---

## 🧠 Hackathon Highlights

- Clean, layered architecture (Controller → Service → Repository)
- Real-world multi-level approval workflow with smart rules
- Role-based dynamic UI (different views for Admin / Manager / Employee)
- Fully integrated frontend ↔ backend with Axios interceptors & token auth
- Company-scoped data isolation (all users/expenses tied to `companyId`)

---

## 👥 Team

- **Pranav Khaire**
- **Dipanshu Kubde**
- **Sourav Mandal**

---

## 🙌 Acknowledgements

- Odoo Hackathon Team
- VIT Pune

---

## 📌 Future Enhancements

- JWT-based authentication (currently using mock token)
- Full OCR receipt scanning (auto-extract amount, date, vendor)
- Mobile-responsive app / PWA support
- Email/SMS notifications on approval actions
- Advanced analytics dashboard (spending trends, category breakdown)
- Export expense reports to PDF / Excel

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
