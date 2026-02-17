# Therapick Backend - Complete Setup & Integration Guide

## 📚 Overview

This guide covers everything you need to set up and integrate the Therapick backend with your existing React frontend.

## 🎯 What We Built

A complete RESTful API backend with:
- **User Authentication** (JWT-based)
- **TherapAPI Integration** (real therapist data for New York)
- **Appointment Management**
- **Mood Tracking**
- **Saved Therapists**
- **MongoDB Database**

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
cd therapick-backend
npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Get connection string
5. Whitelist your IP (0.0.0.0/0 for development)

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000

# MongoDB - Use one of these
MONGODB_URI=mongodb://localhost:27017/therapick  # Local
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/therapick  # Atlas

JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRE=7d

# Your TherapAPI Key
THERAPAPI_KEY=thera_api_j85bwav5d2qtzqb84r6i1bz70kjrkejq

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Step 4: Start the Server

```bash
# Development mode with auto-reload
npm run dev

# You should see:
# ╔════════════════════════════════════════╗
# ║   Therapick Backend Server Running    ║
# ╠════════════════════════════════════════╣
# ║   Environment: development            ║
# ║   Port: 5000                          ║
# ║   Database: Connected                 ║
# ╚════════════════════════════════════════╝
```

### Step 5: Test the API

```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {
#   "success": true,
#   "message": "Therapick API is running",
#   "timestamp": "..."
# }
```

## 🔌 Frontend Integration

### Install Axios in Frontend

```bash
cd therapick-app  # Your React frontend
npm install axios
```

### Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('therapick-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    
    // Handle 401 (unauthorized) - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('therapick-token');
      localStorage.removeItem('therapick-user');
      window.location.href = '/auth';
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Update AuthContext

Update `src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('therapick-token');
    const savedUser = localStorage.getItem('therapick-user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Optionally verify token with backend
      verifyToken();
    }
    setLoading(false);
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('therapick-token', token);
      localStorage.setItem('therapick-user', JSON.stringify(user));
      setUser(user);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('therapick-token', token);
      localStorage.setItem('therapick-user', JSON.stringify(user));
      setUser(user);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('therapick-token');
    localStorage.removeItem('therapick-user');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Create Therapist Service

Create `src/services/therapist.service.js`:

```javascript
import api from './api';

export const therapistService = {
  // Search therapists by moods
  searchByMoods: async (moods, options = {}) => {
    const params = {
      moods: moods.join(','),
      ...options
    };
    
    const response = await api.get('/therapists/search', { params });
    return response.data;
  },

  // Get therapist details
  getById: async (id) => {
    const response = await api.get(`/therapists/${id}`);
    return response.data.therapist;
  },

  // Get therapist reviews
  getReviews: async (id) => {
    const response = await api.get(`/therapists/${id}/reviews`);
    return response.data.reviews;
  },

  // Get specialties
  getSpecialties: async () => {
    const response = await api.get('/therapists/specialties');
    return response.data;
  }
};
```

### Create Appointment Service

Create `src/services/appointment.service.js`:

```javascript
import api from './api';

export const appointmentService = {
  // Create appointment
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data.appointment;
  },

  // Get all appointments
  getAll: async (filters = {}) => {
    const response = await api.get('/appointments', { params: filters });
    return response.data.appointments;
  },

  // Get upcoming appointments
  getUpcoming: async () => {
    const response = await api.get('/appointments/upcoming');
    return response.data.appointments;
  },

  // Update appointment
  update: async (id, updates) => {
    const response = await api.put(`/appointments/${id}`, updates);
    return response.data.appointment;
  },

  // Cancel appointment
  cancel: async (id, reason) => {
    const response = await api.delete(`/appointments/${id}`, {
      data: { reason }
    });
    return response.data;
  }
};
```

### Create Mood Service

Create `src/services/mood.service.js`:

```javascript
import api from './api';

export const moodService = {
  // Log mood
  log: async (moodData) => {
    const response = await api.post('/moods', moodData);
    return response.data.moodEntry;
  },

  // Get mood entries
  getEntries: async (filters = {}) => {
    const response = await api.get('/moods', { params: filters });
    return response.data.moodEntries;
  },

  // Get mood statistics
  getStats: async (dateRange = {}) => {
    const response = await api.get('/moods/stats', { params: dateRange });
    return response.data;
  },

  // Delete mood entry
  delete: async (id) => {
    await api.delete(`/moods/${id}`);
  }
};
```

### Create Saved Therapist Service

Create `src/services/savedTherapist.service.js`:

```javascript
import api from './api';

export const savedTherapistService = {
  // Save therapist
  save: async (therapistData) => {
    const response = await api.post('/saved-therapists', therapistData);
    return response.data.savedTherapist;
  },

  // Get saved therapists
  getAll: async () => {
    const response = await api.get('/saved-therapists');
    return response.data.savedTherapists;
  },

  // Check if saved
  checkIfSaved: async (therapistId) => {
    const response = await api.get(`/saved-therapists/check/${therapistId}`);
    return response.data.isSaved;
  },

  // Remove saved therapist
  remove: async (therapistId) => {
    await api.delete(`/saved-therapists/${therapistId}`);
  }
};
```

### Update HomePage to Use Backend

Update your `HomePage.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { therapistService } from '../services/therapist.service';
import { appointmentService } from '../services/appointment.service';
import { moodService } from '../services/mood.service';
import { savedTherapistService } from '../services/savedTherapist.service';

function HomePage() {
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTherapists = async () => {
    if (selectedMoods.length === 0) return;
    
    setLoading(true);
    try {
      const moodLabels = selectedMoods.map(m => m.label);
      const result = await therapistService.searchByMoods(moodLabels, {
        location: 'New York, NY',
        radius: 25,
        limit: 20
      });
      
      setFilteredTherapists(result.therapists);
      setCurrentView('results');
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search therapists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component...
}
```

## 🗺️ API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Therapists
- `GET /api/therapists/search` - Search therapists
- `GET /api/therapists/:id` - Get therapist details
- `GET /api/therapists/:id/reviews` - Get reviews

### Appointments (all require auth)
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/upcoming` - Get upcoming
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Moods (all require auth)
- `POST /api/moods` - Log mood
- `GET /api/moods` - Get mood entries
- `GET /api/moods/stats` - Get statistics

### Saved Therapists (all require auth)
- `POST /api/saved-therapists` - Save therapist
- `GET /api/saved-therapists` - Get saved
- `DELETE /api/saved-therapists/:id` - Remove saved

## 🧪 Testing the Integration

### 1. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### 2. Test Therapist Search
```bash
curl "http://localhost:5000/api/therapists/search?moods=Anxious&location=New%20York,%20NY"
```

### 3. Test with Frontend
1. Start backend: `npm run dev` (in therapick-backend)
2. Start frontend: `npm run dev` (in therapick-app)
3. Open http://localhost:5173
4. Register/login
5. Search for therapists
6. Create appointment
7. Log mood

## 🚢 Deployment

### Deploy Backend (Railway)

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway add
railway up
```

3. Add environment variables in Railway dashboard

4. Your backend will be live at `https://your-app.railway.app`

### Update Frontend for Production

In your frontend `.env.production`:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

Update `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});
```

## 📊 Database Access

### View Data in MongoDB Compass
1. Download MongoDB Compass
2. Connect to your database
3. Browse collections: `users`, `appointments`, `moodentries`, `savedtherapists`

### Common Queries
```javascript
// Find all users
db.users.find()

// Find upcoming appointments
db.appointments.find({ status: 'upcoming', date: { $gte: new Date() } })

// Get mood stats
db.moodentries.aggregate([
  { $group: { _id: '$mood', count: { $sum: 1 } } }
])
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check MongoDB is running: `brew services list`
- Verify connection string in `.env`
- For Atlas, check IP whitelist

### Issue: "TherapAPI not working"
**Solution**:
- Verify API key in `.env`
- Check internet connection
- Review API rate limits

### Issue: "JWT token invalid"
**Solution**:
- Clear localStorage in browser
- Check JWT_SECRET matches in `.env`
- Re-login

### Issue: "CORS error"
**Solution**:
- Verify CLIENT_URL in backend `.env`
- Check frontend is running on correct port
- Clear browser cache

## 📝 Next Steps

1. **Add Email Notifications**: Use SendGrid or Nodemailer
2. **Add Payment Processing**: Stripe integration for appointments
3. **Add Real-time Updates**: Socket.io for notifications
4. **Add Image Uploads**: Cloudinary for profile pictures
5. **Add Analytics**: Track user behavior
6. **Add Admin Dashboard**: Manage users and content

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- MongoDB: https://www.mongodb.com/docs/
- JWT: https://jwt.io/introduction
- Axios: https://axios-http.com/docs/intro

## 💡 Tips

1. Use Postman to test API endpoints
2. Check logs for debugging: `console.log` in controllers
3. Use MongoDB Compass to view database
4. Keep `.env` secure (never commit to Git)
5. Test error cases (invalid data, auth failures)

---

**Need Help?** Open an issue on GitHub or contact support!
