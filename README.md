# Therapick - Finding Therapists The Easy Way 💚

A modern, mobile-first therapist discovery app that matches you with mental health professionals based on how you're feeling. Complete with appointment booking, mood tracking, and a beautiful, calming interface.

Live Demo: [Therapick Site](https://therapick.netlify.app/)

## 🌟 The Problem

Finding a therapist can be an overwhelming experience:
- Countless websites and directories to search through
- No personalized matching based on your current emotional state
- Difficult to track your mental health journey
- Managing appointments across different platforms
- People often give up before finding help

## 💡 The Solution

**Therapick** provides a stress-free, all-in-one mental health platform:
- **Mood-based matching**: Select how you're feeling and find specialists
- **Location-aware**: See therapists near you with distance indicators
- **Appointment booking**: Schedule, reschedule, or cancel appointments
- **Daily mood tracker**: Log your emotional state with calendar visualization
- **Save favorites**: Keep track of therapists you're interested in
- **Complete profiles**: View ratings, reviews, insurance, and contact info

## 🎯 Features

### Authentication & Onboarding
- **Animated Splash Screen**: Welcoming heart logo animation
- **Flexible Login**: Sign up, log in, or continue as guest
- **Persistent Sessions**: Stay logged in across visits

### Mood-Based Matching
- **8 Mood Categories**: Sad/Depressed, Anxious, Angry/Frustrated, Heartbroken, Stressed/Burnout, Confused/Lost, Lonely, Traumatized
- **Multi-Mood Selection**: Choose multiple feelings at once
- **Smart Algorithm**: Matches therapists by specialty tags
- **Location-Based Results**: Sorted by distance from your location

### Therapist Discovery
- **Beautiful Card Grid**: Modern, Pinterest-style layout
- **Staggered Animations**: Smooth entrance animations
- **Distance Badges**: See how far each therapist is
- **Quick Info**: Avatar, credentials, specialty, rating, tags
- **Hover Effects**: Interactive lift animations

### Therapist Profiles
- **Comprehensive Details**: Bio, experience, availability
- **Interactive Map**: Leaflet map with marker
- **Get Directions**: One-click Google Maps navigation
- **Contact Info**: Phone, email, website, office hours
- **Insurance Accepted**: Clear list of providers
- **Reviews System**: Read reviews and add your own
- **Rating Display**: Star ratings with review counts
- **Save/Unsave**: Heart icon to bookmark therapists

### Appointment Booking
- **Date Picker**: Calendar interface for scheduling
- **Time Slots**: Available appointment times
- **Add Notes**: Include topics you want to discuss
- **Confirmation Screen**: Success message with details

### Appointment Management
- **Clickable Cards**: Tap any appointment to view details
- **Detailed Modal**: Popup with therapist info, date/time, contact details, directions
- **Reschedule**: Navigate to booking page
- **Cancel**: Remove appointment with confirmation

### Daily Mood Tracker
- **Date Selector**: Log moods for any past date
- **5 Mood Options**: Great, Happy, Okay, Anxious, Sad
- **Color-Coded**: Each mood has unique color
- **Monthly Summary**: Stats showing mood frequency
- **30-Day Calendar**: Visual grid with mood indicators

### Saved Matches
- **Organized List**: All bookmarked therapists
- **Quick Info**: Name, specialty, rating, location
- **Remove Button**: Delete matches easily
- **Count Display**: See how many therapists saved

## 🛠️ Technologies Used

- **React 18.3** - Modern UI library
- **React Router DOM 7.1** - Client-side routing
- **Framer Motion 11.15** - Smooth animations
- **Lucide React 0.469** - Beautiful icons
- **Leaflet 1.9 & React Leaflet 4.2** - Interactive maps
- **Vite 6.0** - Lightning-fast build tool

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/visuxlize/therapick-app.git
   cd therapick-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🎨 Design System

### Color Palette
- **Primary**: #C2D8B9 (Sage Green)
- **Secondary**: #A1B5D8 (Soft Blue)
- **Accent**: #E4F0D0 (Light Green)
- **Neutral**: #738290 (Gray)
- **Background**: #FFFCF7 (Cream)

### Design Principles
- Mobile-first approach
- Muted, calming colors
- No gradients
- Smooth animations
- Touch-friendly interactions

## 📁 Project Structure

```
therapick-app/
├── src/
│   ├── components/
│   │   └── SplashScreen.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── therapists.js
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── TherapistDetail.jsx
│   │   └── BookingPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## 🔒 Privacy

- Local storage only
- No backend tracking
- No analytics
- Guest access available

## 👨‍💻 Author

**Andres Marte**
- Portfolio: [[Portfolio](https://visuxlize.github.io/portfolio/)
- GitHub: [@visuxlize](https://github.com/visuxlize)

## Mental Health Resources

If you're in crisis:
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357

---

**Remember**: Seeking help is a sign of strength. You deserve support. 💚
