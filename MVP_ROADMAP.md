# THERAPICK MVP - DEVELOPMENT ROADMAP
## Post-Waitlist: Building the Core Application

---

## 🎯 CURRENT STATUS

✅ **COMPLETED:**
- Waitlist landing page
- Email collection & automation
- User counter
- Updates panel
- Database setup (waitlist_users table)
- Resend email integration

---

## 🚀 MVP SCOPE - WHAT WE'RE BUILDING

**Core Features:**
1. User Authentication (Sign up, Log in, Profile)
2. Mood-Based Therapist Discovery
3. Therapist Directory & Profiles
4. Contact Information Display (Phone, Website, Maps)
5. Save Favorite Therapists
6. Daily Mood Tracker
7. User Dashboard

**NOT in MVP:**
- Booking/scheduling (future)
- Insurance verification (future)
- Messaging/chat (future)
- Payment processing (future)
- Mobile app (Q3 2026)

---

## 📅 DEVELOPMENT TIMELINE

### **Week 1-2: Authentication & Core Setup**
- User authentication system
- Protected routes
- User dashboard skeleton
- Profile management

### **Week 3-4: TherapAPI Integration**
- API service setup
- Therapist data sync
- Search functionality
- Location-based filtering

### **Week 5-6: Mood System & Matching**
- Mood tracking interface
- Mood-to-specialty mapping
- Therapist recommendations
- Search results page

### **Week 7-8: Therapist Profiles & Features**
- Detailed therapist pages
- Contact info display (phone, website, maps)
- Save/favorite system
- Review display

### **Week 9-10: Polish & Testing**
- UI/UX refinement
- Mobile responsiveness
- Bug fixes
- Performance optimization

**Total Timeline: 10 weeks (2.5 months)**

---

## 🏗️ PHASE 1: AUTHENTICATION & USER MANAGEMENT
**Duration:** Week 1-2

### Features to Build:

#### 1. Authentication System
```
- Sign up with email/password
- Log in
- Log out
- Password reset
- Email verification
- Protected routes
- Session management (JWT)
```

#### 2. User Dashboard
```
- Dashboard layout
- Navigation sidebar
- User profile header
- Quick stats (saved therapists, mood streak)
```

#### 3. Profile Management
```
- Edit profile (name, location, preferences)
- Upload avatar
- Update email
- Change password
- Delete account
```

### Database Schema Updates:

```typescript
// Add to lib/db/schema.ts

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  location: jsonb('location').$type<{
    city?: string
    state?: string
    zip?: string
    coordinates?: { lat: number; lng: number }
  }>(),
  preferences: jsonb('preferences').$type<{
    notificationEmail?: boolean
    moodReminders?: boolean
  }>(),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})
```

### API Routes to Create:

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/verify-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/user/profile
PATCH  /api/user/profile
DELETE /api/user/account
```

### Pages to Create:

```
app/(auth)/
  ├── signup/page.tsx
  ├── login/page.tsx
  ├── verify-email/page.tsx
  ├── forgot-password/page.tsx
  └── reset-password/page.tsx

app/(dashboard)/
  ├── layout.tsx          (sidebar, header)
  ├── page.tsx            (dashboard home)
  └── settings/
      └── page.tsx        (profile settings)
```

---

## 🏗️ PHASE 2: THERAPAPI INTEGRATION
**Duration:** Week 3-4

### Features to Build:

#### 1. TherapAPI Service
```
- API client setup
- Authentication
- Rate limiting
- Error handling
- Caching strategy
```

#### 2. Therapist Data Sync
```
- Sync therapists from TherapAPI
- Store in local database
- Update existing records
- Handle deletions
- Schedule regular syncs (cron job)
```

#### 3. Search Functionality
```
- Location-based search
- Specialty filtering
- Insurance filtering (display only)
- Gender preference
- Language filtering
- Availability status
```

### Database Schema:

```typescript
export const therapists = pgTable('therapists', {
  id: uuid('id').defaultRandom().primaryKey(),
  externalId: varchar('external_id', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  credentials: varchar('credentials', { length: 100 }),
  title: varchar('title', { length: 100 }),
  specialty: varchar('specialty', { length: 100 }),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  rating: integer('rating'),
  reviewCount: integer('review_count').default(0),
  yearsExperience: integer('years_experience'),
  languages: text('languages').array(),
  gender: varchar('gender', { length: 20 }),
  
  // Location
  location: jsonb('location').$type<{
    address: string
    city: string
    state: string
    zip: string
    coordinates: { lat: number; lng: number }
  }>().notNull(),
  
  // Contact
  contact: jsonb('contact').$type<{
    phone?: string
    email?: string
    website?: string
  }>(),
  
  // Practice Info
  officeHours: jsonb('office_hours'),
  insuranceAccepted: text('insurance_accepted').array(),
  specialties: text('specialties').array().notNull(),
  therapyApproaches: text('therapy_approaches').array(),
  issuesTreated: text('issues_treated').array(),
  ageGroups: text('age_groups').array(),
  sessionTypes: text('session_types').array(), // in-person, telehealth
  
  // Pricing
  pricing: jsonb('pricing').$type<{
    min?: number
    max?: number
    acceptsInsurance?: boolean
  }>(),
  
  // Status
  acceptingPatients: boolean('accepting_patients').default(true),
  isVerified: boolean('is_verified').default(false),
  
  // Sync
  lastSyncedAt: timestamp('last_synced_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Add indexes for search performance
// CREATE INDEX idx_therapists_location ON therapists USING GIST ((location->'coordinates'));
// CREATE INDEX idx_therapists_specialties ON therapists USING GIN (specialties);
// CREATE INDEX idx_therapists_state ON therapists ((location->>'state'));
```

### TherapAPI Service:

```typescript
// lib/services/therapapi.ts

import axios from 'axios'

const client = axios.create({
  baseURL: process.env.THERAPAPI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.THERAPAPI_KEY}`
  }
})

export async function searchTherapists(params: {
  location?: string
  specialty?: string
  limit?: number
  offset?: number
}) {
  const response = await client.get('/therapists/search', { params })
  return response.data
}

export async function getTherapistById(id: string) {
  const response = await client.get(`/therapists/${id}`)
  return response.data
}

export async function getTherapistReviews(id: string) {
  const response = await client.get(`/therapists/${id}/reviews`)
  return response.data
}
```

### API Routes:

```
GET    /api/therapists/search
  ?location=New York, NY
  &specialty=anxiety
  &radius=25
  &limit=20

GET    /api/therapists/:id
GET    /api/therapists/:id/reviews

POST   /api/admin/sync-therapists  (cron job)
```

### Pages:

```
app/(dashboard)/
  └── discover/
      ├── page.tsx              (search interface)
      └── results/page.tsx      (search results)
```

---

## 🏗️ PHASE 3: MOOD TRACKING & MATCHING
**Duration:** Week 5-6

### Features to Build:

#### 1. Mood Entry System
```
- Daily mood logging
- Mood intensity (1-10 scale)
- Triggers tracking
- Notes/journal
- Mood history view
- Streak tracking
```

#### 2. Mood-Based Recommendations
```
- Mood → Specialty mapping
- Personalized therapist suggestions
- "How are you feeling?" interface
- Recommended therapists list
```

#### 3. Mood Analytics
```
- Mood calendar view
- Trends over time
- Common triggers
- Insights & patterns
```

### Mood-to-Specialty Mapping:

```typescript
// lib/constants/mood-mapping.ts

export const MOOD_TO_SPECIALTIES: Record<string, string[]> = {
  'Sad/Depressed': [
    'Depression',
    'Mood Disorders',
    'Cognitive Behavioral Therapy (CBT)',
    'Grief Counseling'
  ],
  'Anxious': [
    'Anxiety',
    'Panic Disorders',
    'Stress Management',
    'Obsessive-Compulsive Disorder (OCD)'
  ],
  'Angry': [
    'Anger Management',
    'Emotional Regulation',
    'Dialectical Behavior Therapy (DBT)'
  ],
  'Heartbroken': [
    'Relationship Therapy',
    'Couples Counseling',
    'Grief and Loss',
    'Divorce Counseling'
  ],
  'Stressed/Burnout': [
    'Stress Management',
    'Work-Life Balance',
    'Mindfulness-Based Therapy',
    'Burnout Prevention'
  ],
  'Confused/Lost': [
    'Life Coaching',
    'Career Counseling',
    'Decision Making',
    'Self-Esteem'
  ],
  'Lonely': [
    'Social Skills',
    'Connection Building',
    'Depression',
    'Self-Esteem'
  ],
  'Traumatized': [
    'Trauma Therapy',
    'PTSD',
    'EMDR',
    'Complex Trauma'
  ]
}
```

### Database Schema:

```typescript
export const moodEntries = pgTable('mood_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: timestamp('date').notNull(),
  mood: varchar('mood', { length: 50 }).notNull(),
  intensity: integer('intensity'), // 1-10
  notes: text('notes'),
  triggers: text('triggers').array(),
  activities: text('activities').array(),
  energyLevel: integer('energy_level'), // 1-10
  sleepHours: integer('sleep_hours'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Unique constraint: one entry per user per day
// CREATE UNIQUE INDEX idx_mood_entries_user_date ON mood_entries(user_id, date);
```

### API Routes:

```
POST   /api/moods              (create mood entry)
GET    /api/moods              (get user's mood history)
GET    /api/moods/stats        (mood analytics)
GET    /api/moods/insights     (AI-generated insights)
DELETE /api/moods/:id

GET    /api/discover/by-mood
  ?moods=anxious,stressed
  &location=New York, NY
```

### Pages:

```
app/(dashboard)/
  ├── discover/page.tsx         (mood-based search)
  └── mood-tracker/
      ├── page.tsx              (mood entry & history)
      ├── calendar/page.tsx     (calendar view)
      └── insights/page.tsx     (analytics)
```

---

## 🏗️ PHASE 4: THERAPIST PROFILES & FAVORITES
**Duration:** Week 7-8

### Features to Build:

#### 1. Therapist Profile Page
```
- Full bio & credentials
- Specialties & approaches
- Contact information (phone, website)
- Google Maps integration
- Office hours
- Insurance info (display only)
- Reviews & ratings
- Photos
```

#### 2. Contact Methods
```
- Click-to-call (phone)
- Website link (new tab)
- Google Maps directions
- Email (if available)
- Copy contact info
```

#### 3. Save/Favorite System
```
- Save therapist to favorites
- Organize favorites (folders/tags)
- Add private notes
- Quick access from dashboard
- Remove from favorites
```

### Database Schema:

```typescript
export const savedTherapists = pgTable('saved_therapists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  therapistId: uuid('therapist_id').references(() => therapists.id).notNull(),
  notes: text('notes'),
  folder: varchar('folder', { length: 100 }),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Unique constraint
// CREATE UNIQUE INDEX idx_saved_user_therapist ON saved_therapists(user_id, therapist_id);

export const therapistReviews = pgTable('therapist_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  therapistId: uuid('therapist_id').references(() => therapists.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(), // 1-5
  title: varchar('title', { length: 200 }),
  content: text('content'),
  pros: text('pros').array(),
  cons: text('cons').array(),
  wouldRecommend: boolean('would_recommend'),
  verifiedPatient: boolean('verified_patient').default(false),
  helpfulCount: integer('helpful_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
```

### API Routes:

```
POST   /api/saved               (save therapist)
GET    /api/saved               (get saved therapists)
DELETE /api/saved/:id           (remove saved therapist)
PATCH  /api/saved/:id           (update notes/folder)

POST   /api/reviews             (submit review)
GET    /api/reviews/:therapistId
```

### Pages:

```
app/(dashboard)/
  ├── therapists/
  │   └── [id]/page.tsx         (therapist profile)
  └── favorites/
      └── page.tsx              (saved therapists list)
```

### Google Maps Integration:

```typescript
// components/therapist/contact-card.tsx

import { Phone, Globe, MapPin, Mail } from 'lucide-react'

export function ContactCard({ therapist }) {
  const { phone, email, website } = therapist.contact
  const { address, city, state, zip, coordinates } = therapist.location
  
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
  
  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-4">Contact Information</h3>
      
      {phone && (
        <a href={`tel:${phone}`} className="flex items-center gap-3 mb-3 hover:text-green-primary">
          <Phone className="w-5 h-5" />
          <span>{phone}</span>
        </a>
      )}
      
      {website && (
        <a href={website} target="_blank" rel="noopener" className="flex items-center gap-3 mb-3 hover:text-green-primary">
          <Globe className="w-5 h-5" />
          <span>Visit Website</span>
        </a>
      )}
      
      <a href={mapsUrl} target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-green-primary">
        <MapPin className="w-5 h-5" />
        <span>{address}, {city}, {state} {zip}</span>
      </a>
    </div>
  )
}
```

---

## 🏗️ PHASE 5: POLISH & LAUNCH
**Duration:** Week 9-10

### Tasks:

#### 1. UI/UX Polish
```
- Consistent styling across all pages
- Loading states everywhere
- Empty states (no results, no favorites, etc.)
- Error states with helpful messages
- Success notifications
- Smooth transitions
```

#### 2. Mobile Optimization
```
- Responsive layouts
- Touch-friendly interactions
- Mobile navigation
- Bottom sheets for modals
- Swipe gestures
```

#### 3. Performance
```
- Image optimization (Next.js Image)
- Code splitting
- Lazy loading
- API response caching
- Database query optimization
- Lighthouse score > 90
```

#### 4. SEO & Metadata
```
- Meta tags for all pages
- Open Graph images
- Sitemap.xml
- Robots.txt
- Schema.org markup
```

#### 5. Testing
```
- User testing (5-10 waitlist users)
- Bug fixes
- Cross-browser testing
- Mobile device testing
- Accessibility audit (WCAG AA)
```

#### 6. Analytics & Monitoring
```
- PostHog events tracking
- Error monitoring (Sentry)
- Performance monitoring
- User behavior analytics
```

#### 7. Documentation
```
- User guide
- FAQ page
- Privacy policy
- Terms of service
- Help center
```

---

## 📊 MVP SUCCESS METRICS

### Core Metrics to Track:

```
User Acquisition:
- Waitlist → Signup conversion: 30%+
- Weekly active users: 100+ (Month 1)

Engagement:
- Daily mood entry rate: 40%+
- Average session duration: 5+ minutes
- Therapist profiles viewed per session: 3+

Feature Adoption:
- Users who save therapists: 60%+
- Users who use mood-based search: 70%+
- Return visit rate: 50%+ (within 7 days)

Contact Actions:
- Click-to-call rate: 15%+
- Website visits: 25%+
- Maps direction requests: 20%+
```

---

## 🛠️ TECH STACK CONFIRMATION

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React (icons)

**Backend:**
- Next.js API Routes
- PostgreSQL (Supabase)
- Drizzle ORM
- JWT (sessions)

**External Services:**
- TherapAPI (therapist data)
- Resend (emails)
- Google Maps API (directions)
- PostHog (analytics)
- Sentry (errors)

---

## 💰 ESTIMATED COSTS (Monthly)

**Development Phase:**
- Supabase: $0 (Free tier, ~10GB storage)
- Resend: $20 (50k emails/month)
- Vercel: $0 (Hobby plan)
- TherapAPI: $0 (existing key)
- Google Maps API: ~$50 (with usage limits)
- **Total: ~$70/month**

**Post-Launch (1000 active users):**
- Supabase: $25 (Pro plan)
- Resend: $20
- Vercel: $20 (Pro plan)
- PostHog: $0 (generous free tier)
- Sentry: $0 (generous free tier)
- Google Maps: ~$100
- **Total: ~$165/month**

---

## 🚀 NEXT IMMEDIATE STEPS

### This Week:

1. **Set up authentication**
   ```bash
   # Install dependencies
   npm install bcrypt jsonwebtoken
   npm install -D @types/bcrypt @types/jsonwebtoken
   ```

2. **Create user schema**
   ```bash
   # Update lib/db/schema.ts
   # Add users and sessions tables
   npm run db:push
   ```

3. **Build signup/login pages**
   ```
   - app/(auth)/signup/page.tsx
   - app/(auth)/login/page.tsx
   ```

4. **Create auth API routes**
   ```
   - app/api/auth/signup/route.ts
   - app/api/auth/login/route.ts
   ```

5. **Protect dashboard routes**
   ```
   - Create middleware.ts
   - Add session validation
   ```

---

## 📝 CURSOR PROMPT FOR NEXT PHASE

When you're ready to build authentication, use this prompt:

```
I'm building Therapick MVP. Waitlist is complete. Now I need to build:

1. User authentication system (signup, login, logout)
2. Protected dashboard routes
3. User profile management
4. JWT session handling

Tech stack:
- Next.js 14 App Router
- PostgreSQL with Drizzle ORM
- bcrypt for password hashing
- JWT for sessions

Database schema needed:
- users table (email, passwordHash, name, location, preferences)
- sessions table (userId, token, expiresAt)

Pages needed:
- /signup
- /login
- /dashboard (protected)
- /settings (profile management)

API routes needed:
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/user/profile
- PATCH /api/user/profile

Use Therapick brand colors:
- Primary green: #4CAF50
- Tan: #C5E1A5
- Dark background: #0A0E1A

Please create the complete authentication system following Next.js 14 best practices.
```

---

## ✅ MVP COMPLETION CHECKLIST

- [ ] **Phase 1**: Authentication & user management (Week 1-2)
- [ ] **Phase 2**: TherapAPI integration (Week 3-4)
- [ ] **Phase 3**: Mood tracking & matching (Week 5-6)
- [ ] **Phase 4**: Therapist profiles & favorites (Week 7-8)
- [ ] **Phase 5**: Polish & launch prep (Week 9-10)

---

**Ready to start Phase 1: Authentication? Let me know and I'll create the detailed implementation guide!** 🚀
