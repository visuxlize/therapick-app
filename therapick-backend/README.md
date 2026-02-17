# Therapick Backend API

Backend API for Therapick - Finding Therapists The Easy Way. Built with Node.js, Express, and MongoDB, integrated with TherapAPI for therapist data.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Therapist Search**: Integration with TherapAPI for real therapist data in New York
- **Mood-Based Matching**: Intelligent matching of moods to therapist specialties
- **Appointment Management**: Book, update, and cancel appointments
- **Mood Tracking**: Daily mood logging with statistics and trends
- **Saved Therapists**: Bookmark favorite therapists for later

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **External API**: TherapAPI
- **Security**: Helmet, bcrypt, rate limiting
- **Validation**: express-validator

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- TherapAPI key

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd therapick-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/therapick
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   THERAPAPI_KEY=thera_api_j85bwav5d2qtzqb84r6i1bz70kjrkejq
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

### Therapist Endpoints

#### Search Therapists
```http
GET /api/therapists/search?moods=Anxious,Sad/Depressed&location=New York, NY&radius=25
```

**Query Parameters**:
- `moods` (optional): Comma-separated list of moods
- `location` (optional): City and state (default: New York, NY)
- `latitude` (optional): Latitude for location-based search
- `longitude` (optional): Longitude for location-based search
- `radius` (optional): Search radius in miles (default: 25)
- `insurance` (optional): Insurance provider
- `gender` (optional): Therapist gender preference
- `language` (optional): Language preference
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response**:
```json
{
  "success": true,
  "message": "Therapists retrieved successfully",
  "data": {
    "therapists": [...],
    "total": 45,
    "hasMore": true,
    "filters": {
      "moods": ["Anxious", "Sad/Depressed"],
      "specialties": ["Anxiety", "Depression", "CBT"],
      "location": "New York, NY",
      "radius": 25
    }
  }
}
```

#### Get Therapist by ID
```http
GET /api/therapists/:id
```

#### Get Therapist Reviews
```http
GET /api/therapists/:id/reviews
```

#### Get Available Specialties
```http
GET /api/therapists/specialties
```

### Appointment Endpoints

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "therapistId": "12345",
  "therapistName": "Dr. Sarah Johnson",
  "therapistSpecialty": "Anxiety & Depression",
  "date": "2026-02-15",
  "time": "2:00 PM",
  "notes": "First session, discussing anxiety"
}
```

#### Get User Appointments
```http
GET /api/appointments?status=upcoming
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): upcoming, completed, cancelled, rescheduled
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

#### Get Upcoming Appointments
```http
GET /api/appointments/upcoming
Authorization: Bearer <token>
```

#### Update Appointment
```http
PUT /api/appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2026-02-20",
  "time": "3:00 PM",
  "notes": "Updated notes"
}
```

#### Cancel Appointment
```http
DELETE /api/appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Schedule conflict"
}
```

### Mood Tracking Endpoints

#### Log Mood
```http
POST /api/moods
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2026-02-04",
  "mood": "happy",
  "notes": "Great day at work",
  "triggers": ["work"],
  "activities": ["exercise", "meditation"]
}
```

**Mood Options**: `great`, `happy`, `okay`, `anxious`, `sad`

#### Get Mood Entries
```http
GET /api/moods?startDate=2026-01-01&endDate=2026-02-04&limit=30
Authorization: Bearer <token>
```

#### Get Mood Statistics
```http
GET /api/moods/stats?startDate=2026-01-01&endDate=2026-02-04
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Mood statistics retrieved successfully",
  "data": {
    "stats": [
      { "mood": "happy", "count": 12 },
      { "mood": "okay", "count": 8 }
    ],
    "averageScore": "3.85",
    "totalEntries": 25,
    "dateRange": { "start": "...", "end": "..." },
    "topTriggers": [...],
    "topActivities": [...]
  }
}
```

### Saved Therapists Endpoints

#### Save Therapist
```http
POST /api/saved-therapists
Authorization: Bearer <token>
Content-Type: application/json

{
  "therapistId": "12345",
  "moods": ["Anxious", "Stressed/Burnout"],
  "notes": "Specializes in CBT"
}
```

#### Get Saved Therapists
```http
GET /api/saved-therapists
Authorization: Bearer <token>
```

#### Check if Therapist is Saved
```http
GET /api/saved-therapists/check/:therapistId
Authorization: Bearer <token>
```

#### Remove Saved Therapist
```http
DELETE /api/saved-therapists/:therapistId
Authorization: Bearer <token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Helmet**: Security headers
- **Rate Limiting**: Prevent abuse
- **CORS**: Configured for client origin
- **Input Validation**: express-validator
- **Error Handling**: Centralized error handling

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: user, admin),
  location: {
    coordinates: [Number], // [longitude, latitude]
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  preferences: Object,
  isActive: Boolean,
  lastLogin: Date
}
```

### Appointment Model
```javascript
{
  user: ObjectId (ref: User),
  therapistId: String,
  therapistName: String,
  therapistSpecialty: String,
  date: Date,
  time: String,
  status: String (enum),
  notes: String,
  reminderSent: Boolean,
  cancellationReason: String
}
```

### MoodEntry Model
```javascript
{
  user: ObjectId (ref: User),
  date: Date,
  mood: String (enum),
  notes: String,
  triggers: [String],
  activities: [String]
}
```

### SavedTherapist Model
```javascript
{
  user: ObjectId (ref: User),
  therapistId: String,
  therapistData: Object,
  moods: [String],
  notes: String
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
therapick-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── therapist.controller.js
│   │   ├── appointment.controller.js
│   │   ├── mood.controller.js
│   │   └── savedTherapist.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── MoodEntry.js
│   │   └── SavedTherapist.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── therapist.routes.js
│   │   ├── appointment.routes.js
│   │   ├── mood.routes.js
│   │   └── savedTherapist.routes.js
│   ├── services/
│   │   └── therapapi.service.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── responses.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Setup
Ensure all environment variables are set in production:
- `NODE_ENV=production`
- `MONGODB_URI` (MongoDB Atlas connection string)
- `JWT_SECRET` (strong secret key)
- `THERAPAPI_KEY`
- `CLIENT_URL` (production frontend URL)

### Platforms
- **Railway**: Connect GitHub repo, set env vars
- **Heroku**: Use Heroku Postgres for MongoDB alternative or MongoDB Atlas
- **DigitalOcean**: Deploy on App Platform
- **AWS**: EC2 or Elastic Beanstalk

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| NODE_ENV | Environment mode | No | development |
| PORT | Server port | No | 5000 |
| MONGODB_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | JWT signing secret | Yes | - |
| JWT_EXPIRE | JWT expiration time | No | 7d |
| THERAPAPI_KEY | TherapAPI key | Yes | - |
| CLIENT_URL | Frontend URL for CORS | No | http://localhost:5173 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License

## 👤 Author

**Andres Marte**
- Portfolio: https://visuxlize.github.io/portfolio/
- GitHub: [@visuxlize](https://github.com/visuxlize)

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]
