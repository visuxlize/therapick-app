# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Therapick is a mood-based therapist discovery platform. This is a monorepo containing:
- **Frontend**: React 18 + Vite web app in the root directory
- **Backend**: Node.js/Express API in `therapick-backend/`

The frontend currently uses localStorage for data persistence but has a backend ready for integration.

## Commands

### Frontend (root directory)
```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

### Backend (therapick-backend/)
```bash
cd therapick-backend
npm run dev      # Start with nodemon (auto-reload)
npm start        # Production mode
npm test         # Run Jest tests with coverage
```

### Running Both
Run frontend and backend in separate terminals. Backend requires:
1. MongoDB running locally or connection string in `.env`
2. Copy `.env.example` to `.env` and configure environment variables

## Architecture

### Frontend Structure (`src/`)
- `App.jsx` - Router setup with AuthProvider, protected routes
- `contexts/AuthContext.jsx` - Global auth state via React Context
- `pages/` - Route components:
  - `AuthPage.jsx` - Login/signup
  - `HomePage.jsx` - Main app (mood selection, results grid, matches, profile with mood tracker)
  - `TherapistDetail.jsx` - Profile with Leaflet map, reviews, contact info
  - `BookingPage.jsx` - Date/time picker, confirmation flow
- `components/SplashScreen.jsx` - Animated splash
- `data/therapists.js` - Mock therapist data

### Backend Structure (`therapick-backend/src/`)
- `server.js` - Express app entry point
- `config/database.js` - MongoDB connection
- `controllers/` - Request handlers (auth, therapist, appointment, mood, savedTherapist)
- `models/` - Mongoose schemas (User, Appointment, MoodEntry, SavedTherapist)
- `routes/` - API route definitions
- `services/therapapi.service.js` - TherapAPI integration for real therapist data
- `middleware/` - Auth (JWT) and error handling

### Data Flow
1. Frontend uses localStorage keys: `therapick-user`, `therapick-matches`, `therapick-appointments`, `therapick-mood-history`
2. Backend provides REST API at `/api/*` with JWT auth for protected routes
3. External TherapAPI provides real therapist data for New York area

### Routing
```
/           → Redirect based on auth
/auth       → Login/signup
/home       → Main app (tabs: Find, Matches, Profile)
/therapist/:id → Therapist detail
/booking/:id   → Book appointment
```

## Key Patterns

- **Authentication**: JWT tokens (backend), localStorage session (frontend)
- **Mood Mapping**: 8 mood categories map to therapist specialties (see `therapick-backend/API_QUICK_REF.md`)
- **Animations**: Framer Motion's `AnimatePresence` for page transitions, staggered list animations
- **Icons**: Use Lucide React icons (e.g., `<Heart />`, `<Calendar />`)
- **Maps**: Leaflet/React-Leaflet for therapist location display

## Design System

```css
--primary: #C2D8B9    /* Sage Green */
--secondary: #A1B5D8  /* Soft Blue */
--accent: #E4F0D0     /* Light Green */
--neutral: #738290    /* Gray */
--background: #FFFCF7 /* Cream */
```

Mobile-first design. No gradients. Rounded corners (8-24px). Soft shadows.

## API Reference

See `therapick-backend/API_QUICK_REF.md` for endpoint examples. Key endpoints:
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/therapists/search?moods=...&location=...`
- `POST /api/appointments` (requires JWT)
- `POST /api/moods` (requires JWT)
- `POST /api/saved-therapists` (requires JWT)

## Environment Variables (Backend)

Required in `therapick-backend/.env`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `THERAPAPI_KEY` - TherapAPI access key
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:5173)
