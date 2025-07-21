# Ruh Wellness Clinic - Frontend Management System

A modern, responsive web application for managing wellness clinic operations built with React, Vite, and TailwindCSS.

## 🌐 Live Demo

**[View Live Application](https://ruh-frontend.vercel.app/)**

## 📋 Overview

The Ruh Wellness Clinic Frontend is a comprehensive management system designed for wellness clinics to efficiently manage clients and appointments. It provides an intuitive interface for administrators to handle day-to-day operations with a clean, modern design.

## ✨ Features

### 🔐 Authentication & Security
- Secure admin login with JWT tokens
- Automatic token refresh functionality
- Protected routes with authentication guards
- Session management with local storage

### 👥 Client Management
- View all clients in a comprehensive table
- Individual client detail pages
- Client contact information display
- Client registration date tracking

### 📅 Appointment Management
- **View Appointments**: Complete list of all scheduled appointments
- **Create Appointments**: Easy appointment scheduling with client selection
- **Edit Appointments**: Modify existing appointment details
- **Cancel Appointments**: Remove appointments with confirmation
- **Status Tracking**: Automatic status updates (Scheduled/Completed)
- **Client Integration**: View client details within appointments

### 📱 Responsive Design
- Fully responsive design for all screen sizes
- Mobile-first approach with TailwindCSS
- Touch-friendly navigation with hamburger menu
- Optimized layouts for tablets and mobile devices

### 🎨 Modern UI/UX
- Clean, professional interface
- Brand-consistent color scheme (#40A6BD theme)
- Smooth transitions and hover effects
- Loading states and error handling
- Toast notifications for user feedback

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Styling**: TailwindCSS 4.1.11
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Heroicons (SVG icons)
- **Deployment**: Vercel

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation
│   └── PrivateRoute.jsx # Route protection component
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Clients.jsx     # Client listing page
│   ├── ClientDetails.jsx # Individual client page
│   ├── Appointments.jsx # Appointment listing page
│   ├── CreateAppointment.jsx # New appointment form
│   └── EditAppointment.jsx # Edit appointment form
├── utils/              # Utility functions
│   └── api.js          # API communication functions
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ruh-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Environment Variables

The application automatically detects the environment:
- **Development**: `http://localhost:8000/api`
- **Production**: `https://ruh-backend-production.up.railway.app/api`

## 📡 API Integration

The frontend communicates with a backend API for all data operations:

### Authentication Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/refresh-token` - Token refresh

### Client Endpoints
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID

### Appointment Endpoints
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/client/:id` - Get client's appointments

## 🔒 Authentication Flow

1. Admin enters credentials on login page
2. Backend validates and returns JWT tokens
3. Tokens stored in localStorage
4. Access token used for API requests
5. Automatic refresh when token expires
6. Logout clears all stored data

## 📱 Responsive Features

- **Mobile Navigation**: Hamburger menu for mobile devices
- **Adaptive Tables**: Horizontal scroll on smaller screens
- **Touch Interactions**: Optimized buttons and links
- **Responsive Typography**: Scalable text across devices
- **Flexible Layouts**: CSS Grid and Flexbox for adaptability

## 🎨 Design System

### Colors
- **Primary**: #40A6BD (Teal Blue)
- **Primary Hover**: #359bb2
- **Background**: White (#FFFFFF)
- **Text**: Gray shades for hierarchy
- **Success**: Green variants
- **Error**: Red variants

### Typography
- **Headings**: Font weights 600-800
- **Body**: Font weight 400-500
- **Interactive**: Font weight 500-600

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment
The application is deployed on Vercel with automatic deployments from the main branch.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint