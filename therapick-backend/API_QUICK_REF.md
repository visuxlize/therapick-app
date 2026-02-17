# Therapick API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Quick Start Examples

### 1. Register & Login

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Andres Marte",
    "email": "andres@therapick.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "andres@therapick.com",
    "password": "password123"
  }'
```

Save the returned token for subsequent requests!

### 2. Search Therapists

**By Mood:**
```bash
curl "http://localhost:5000/api/therapists/search?moods=Anxious,Sad/Depressed&location=New%20York,%20NY"
```

**With Location:**
```bash
curl "http://localhost:5000/api/therapists/search?latitude=40.7128&longitude=-74.0060&radius=10"
```

### 3. Create Appointment

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "therapistId": "12345",
    "therapistName": "Dr. Sarah Johnson",
    "therapistSpecialty": "Anxiety & Depression",
    "date": "2026-02-15",
    "time": "2:00 PM",
    "notes": "First session"
  }'
```

### 4. Log Mood

```bash
curl -X POST http://localhost:5000/api/moods \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "happy",
    "notes": "Great day!",
    "activities": ["exercise", "meditation"]
  }'
```

### 5. Save Therapist

```bash
curl -X POST http://localhost:5000/api/saved-therapists \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "therapistId": "12345",
    "moods": ["Anxious"],
    "notes": "Great reviews"
  }'
```

## Mood Options
- `great`
- `happy`
- `okay`
- `anxious`
- `sad`

## Mood to Specialty Mapping

| Mood | Specialties |
|------|-------------|
| Sad/Depressed | Depression, Mood Disorders, CBT |
| Anxious | Anxiety, Panic Disorders, Stress Management |
| Angry/Frustrated | Anger Management, Emotional Regulation, Conflict Resolution |
| Heartbroken | Relationship Therapy, Couples Counseling, Grief Counseling |
| Stressed/Burnout | Stress Management, Work-Life Balance, Mindfulness |
| Confused/Lost | Life Coaching, Career Counseling, Identity Exploration |
| Lonely | Social Skills, Connection Building, Depression |
| Traumatized | Trauma Therapy, PTSD, EMDR |

## Common Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": true
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Testing with Postman

1. Import the environment
2. Set `baseUrl` to `http://localhost:5000/api`
3. Set `token` variable after login
4. Use `{{baseUrl}}` and `{{token}}` in requests

## Frontend Integration Example

```javascript
// Configure axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Search therapists
const searchTherapists = async (moods, location) => {
  const response = await api.get('/therapists/search', {
    params: { moods: moods.join(','), location }
  });
  return response.data.data;
};

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.data.token);
  return response.data.data.user;
};
```
