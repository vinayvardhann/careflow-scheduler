# MedSchedule Backend Server

## Prerequisites
- **Node.js** (v18+)
- **MongoDB** installed and running (MongoDB Compass)

## Setup Instructions

### 1. Navigate to server folder
```bash
cd server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and update:
- `MONGODB_URI` — your MongoDB connection string (default: `mongodb://localhost:27017/medschedule`)
- `JWT_SECRET` — any secure random string

### 4. Seed the database
```bash
node seed.js
```
This creates sample users, doctors, and appointments.

### 5. Start the server
```bash
npm run dev
```
Server runs on `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/profile` | Get logged-in user profile |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors/:id` | Get doctor by ID |
| POST | `/api/doctors` | Add doctor (Admin) |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor (Admin) |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments (filtered by role) |
| GET | `/api/appointments/stats` | Dashboard statistics |
| POST | `/api/appointments` | Book appointment (conflict detection) |
| PUT | `/api/appointments/:id` | Reschedule appointment |
| PUT | `/api/appointments/:id/status` | Update status |
| DELETE | `/api/appointments/:id` | Cancel appointment |

## Default Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medschedule.com | admin123 |
| Doctor | sarah@doctor.com | doctor123 |
| Patient | john@patient.com | patient123 |

## Key Features
- **JWT Authentication** with role-based access (Admin, Doctor, Patient)
- **Priority-based scheduling** — emergency cases auto-confirmed
- **Double booking prevention** — conflict detection on time slots
- **Seed script** — pre-populates DB with sample data for demos
