# ClinicApp_2026 🏥

[![Framework](https://img.shields.io/badge/.NET-10.0-blue.svg)](https://dotnet.microsoft.com/en-us/)
[![Frontend](https://img.shields.io/badge/Angular-19.0-red.svg)](https://angular.io/)
[![UI Suite](https://img.shields.io/badge/PrimeNG-19.0-green.svg)](https://primeng.org/)
[![Database](https://img.shields.io/badge/SQL_Server-2022-orange.svg)](https://www.microsoft.com/en-us/sql-server/)

A high-performance, modern Clinic Management System designed for efficiency, scalability, and premium user experience. **ClinicApp_2026** provides a seamless interface for patients, doctors, and administrators to handle appointments, medical profiles, and staff management.

---

## 🚀 Key Features

### 🔐 Secure Authentication & Authorization
- **JWT & Refresh Tokens**: Robust security implementation ensuring persistent and secure sessions.
- **Role-Based Access Control (RBAC)**: Distinct workflows and dashboards for **Admins**, **Doctors**, and **Clients**.

### 📅 Advanced Booking Engine
- **Conflict Resolution**: Real-time availability checks to prevent double-bookings.
- **Interactive Calendar**: Professional scheduling view powered by a custom-engineered grid system.
- **Guest Booking**: Allows new patients to schedule visits with automated profile creation.

### 🍱 Premium UI/UX
- **Responsive Design**: Fluid layouts optimized for Desktop, Tablet, and Mobile devices.
- **Deep Carbon Dark Mode**: Eye-friendly, high-contrast dark theme with consistent modern aesthetics.
- **State-of-the-art Standalone Architecture**: Built with Angular 19 for maximum performance and maintainability.

---

## 🛠️ Technology Stack

### Backend
- **Core**: .NET 10 Web API
- **ORM**: Entity Framework Core 10
- **Database**: Microsoft SQL Server
- **Security**: JWT Bearer Authentication, Refresh Tokens

### Frontend
- **Core**: Angular 19 (Standalone Components)
- **UI Toolkit**: PrimeNG 19
- **Logic**: RxJS for reactive data handling
- **Styling**: Vanilla CSS with Modern Variables

---

## 🏁 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)
- [Node.js (LTS Version)](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### 1. Backend Setup
```bash
# Navigate to the API directory
cd AngularAuthApi/AngularAuthApi

# Update database (Entity Framework Migrations)
dotnet ef database update

# Run the API
dotnet run
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd clinic

# Install dependencies
npm install

# Start the development server
ng serve
```

---

## 👤 Admin Access
> [!NOTE]
> Default administrator credentials can be found in the system initialization logs or provided by the system owner. Only Administrators have the authority to register new Doctors and manage system-wide settings.

---

## ✉️ Contact & Support

**ClinicApp_2026** is actively maintained. For support or inquiries, please visit the official repository:
- **Project Repository**: [vaaakoo/project-clinic-API](https://github.com/vaaakoo/project-clinic-API)

---
*Created with ❤️ for modern healthcare management.*
