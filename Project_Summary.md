# Therapick - Project Summary

## Overview
Therapick is a modern mental health platform that simplifies therapist discovery through mood-based matching, location awareness, and comprehensive appointment management.

## Core Features

### 1. Authentication System
- Splash screen with animated heart logo
- Login/signup with email and password
- Guest access option
- Persistent sessions via localStorage
- AuthContext for global state management

### 2. Mood-Based Therapist Matching
- 8 emotional categories (Sad, Anxious, Angry, Heartbroken, Stressed, Confused, Lonely, Traumatized)
- Multi-mood selection capability
- Specialty-based algorithm matching moods to therapist tags
- Location-aware results using Geolocation API
- Distance calculation and sorting

### 3. Therapist Discovery Interface
- **Results Page**: Grid layout with card-based design
- Staggered entrance animations
- Distance badges showing proximity
- Quick info: avatar, credentials, specialty, rating, tags
- Interactive hover effects with vertical lift
- Back to search navigation

### 4. Detailed Therapist Profiles
- Comprehensive information display
- Interactive Leaflet map with location marker
- One-click Google Maps directions
- Full contact details (phone, email, website, office hours)
- Insurance provider list
- Reviews and ratings system
- Add review functionality
- Save/unsave to matches (heart icon)

### 5. Appointment Booking System
- Date picker with minimum date validation
- Time slot selection grid
- Optional notes field
- Animated confirmation screen
- Automatic storage to localStorage
- Integration with user profile

### 6. Appointment Management
- **Clickable appointment cards** in profile
- **Modal popup** displaying:
  - Therapist avatar, name, credentials, specialty, rating
  - Full appointment date and time
  - User notes
  - Complete contact information
  - Get Directions button (opens Google Maps)
  - Reschedule button (navigates to booking page)
  - Cancel button with confirmation dialog
- Smooth animations (Framer Motion)
- Close on overlay click or X button

### 7. Daily Mood Tracker
- **Date selector** for logging any past date
- 5 mood options: Great, Happy, Okay, Anxious, Sad
- Color-coded mood indicators
- Monthly statistics showing frequency
- 30-day calendar grid visualization
- Hover tooltips with date and mood
- Mood history stored in localStorage

### 8. Saved Matches
- Redesigned list view with avatar cards
- Quick info display (name, specialty, rating, location)
- Remove button (X) on each card
- Count badge in navigation
- Click to navigate to full profile

### 9. User Profile
- Avatar with user initials
- Account information display
- Mood tracker section with calendar
- Upcoming appointments list
- Logout functionality

### 10. Navigation
- Bottom navigation bar (centered)
- Three sections: Matches, Find, Profile
- Badge counts on Matches tab
- Active state indicators
- Smooth page transitions

## Technical Architecture

### Frontend Stack
- **React 18.3** - Component library
- **React Router DOM 7.1** - SPA routing
- **Framer Motion 11.15** - Animations
- **Lucide React 0.469** - Icons
- **Leaflet 1.9 + React Leaflet 4.2** - Maps
- **Vite 6.0** - Build tool

### State Management
- React Context API for authentication
- useState/useEffect hooks for local state
- localStorage for data persistence

### Data Storage
All data stored client-side in localStorage:
- `therapick-matches`: Saved therapists
- `therapick-appointments`: Booked appointments
- `therapick-mood-history`: Daily mood logs
- `therapick-user`: User session

### Routing Structure
```
/ → Redirects based on auth state
/auth → Login/signup page
/home → Main app (mood selection, results, matches, profile)
/therapist/:id → Detailed therapist profile
/booking/:id → Appointment booking
```

### Component Architecture
```
App.jsx (Router + AuthProvider)
├── SplashScreen.jsx
├── AuthPage.jsx
├── HomePage.jsx
│   ├── Mood Selection
│   ├── Therapist Results (Grid)
│   ├── Saved Matches
│   ├── Profile (with Mood Tracker)
│   └── Appointment Modal
├── TherapistDetail.jsx
│   ├── Map Integration
│   ├── Reviews
│   └── Contact Info
└── BookingPage.jsx
    ├── Date Picker
    ├── Time Slots
    └── Confirmation
```

## Design System

### Color Palette
```css
--primary: #C2D8B9 (Sage Green)
--secondary: #A1B5D8 (Soft Blue)
--accent: #E4F0D0 (Light Green)
--neutral: #738290 (Gray)
--background: #FFFCF7 (Cream)
```

### Design Principles
- **Mobile-first**: Designed for mobile app feel on web
- **Muted colors**: Calming, therapeutic aesthetic
- **No gradients**: Clean, modern flat design
- **Smooth animations**: Framer Motion transitions
- **Touch-friendly**: Large tap targets, swipeable
- **Consistent spacing**: 4px base unit
- **Rounded corners**: 8px, 12px, 16px, 20px, 24px
- **Soft shadows**: Subtle depth without harshness

## Key User Flows

### 1. Finding a Therapist
Home → Select mood(s) → View results → Click therapist → View profile → Book appointment

### 2. Booking Appointment
Therapist profile → Book Appointment → Select date → Select time → Add notes → Confirm

### 3. Managing Appointments
Profile → Click appointment → View modal → Reschedule/Cancel/Get Directions

### 4. Tracking Mood
Profile → Mood Tracker → Select date → Choose mood → View calendar/stats

### 5. Saving Matches
Therapist profile → Click heart icon → View in Matches tab → Remove if needed

## Performance Optimizations
- Lazy loading with React Router
- Framer Motion AnimatePresence for mount/unmount
- Conditional rendering for large lists
- Local storage for instant data access
- Vite for fast builds and HMR

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 90+)

## Future Enhancements
- Real therapist API integration
- Video call scheduling
- Insurance verification
- Email/SMS notifications
- Export mood data
- Multi-language support
- Dark mode

## Development Info
- **Framework**: React + Vite
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 with CSS Variables
- **Package Manager**: npm
- **Node Version**: 18+

## Deployment
Optimized for:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Railway
- Render

Build command: `npm run build`
Output directory: `dist`

## Author
Andres Marte
- Portfolio: mandres1995.wixsite.com/andres-marte-portfol
- GitHub: @visuxlize

---

**Status**: Production Ready ✅
**Last Updated**: February 2026
