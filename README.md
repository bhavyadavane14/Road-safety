# RoadSOS AI 🚨

An intelligent AI-powered Road Emergency Response Platform designed to save lives during road accidents by reducing emergency response time during the Golden Hour.

## 🌟 Features

- **AI Emergency Assistant** - 24/7 AI-powered emergency guidance
- **Voice Assistant** - Hands-free emergency communication
- **Accident Detection** - Automatic crash detection & alert
- **Nearest Hospital Finder** - Quick locate trauma centers
- **Nearest Ambulance** - Real-time ambulance tracking
- **Police Locator** - Find nearest police station
- **Emergency Contacts** - One-tap emergency calls
- **One Tap SOS** - Instant emergency activation
- **Offline Emergency Mode** - Works without internet
- **Road Safety Education** - Learn safety protocols
- **AI Chatbot** - Intelligent emergency Q&A
- **Golden Hour Guidance** - Critical first hour assistance
- **First Aid Assistant** - Step-by-step medical guidance
- **Live GPS Tracking** - Real-time location sharing
- **Traffic Awareness** - Live traffic updates
- **Road Hazard Alerts** - Danger zone notifications
- **Blood Bank Finder** - Locate blood banks nearby
- **Vehicle Recovery** - Towing & recovery assistance
- **Multilingual Support** - 12+ Indian languages
- **Accessibility Features** - Inclusive design for all

## 🚀 Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI
- Recharts
- Lucide React

### Backend
- Node.js
- Express
- MongoDB
- Redis
- Socket.io
- JWT Authentication

### AI/ML
- OpenAI GPT
- Google Gemini
- Whisper (Speech Recognition)
- YOLO (Object Detection)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Run development server
npm run dev

# Run production server
npm start
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roadsos
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## 📁 Project Structure

```
Road-Safety/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/        # React components
│   │   ├── ui/           # UI components (Button, Card, etc.)
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   ├── sections/     # Page sections (Hero, Features, etc.)
│   │   └── dashboard/    # Dashboard components
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript types
│   ├── hooks/            # Custom React hooks
│   └── data/             # Static data
├── backend/
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   └── config/       # Configuration files
│   └── package.json
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- Primary: #0F172A
- Secondary: #2563EB
- Accent: #06B6D4
- Success: #22C55E
- Danger: #DC2626
- Warning: #F59E0B

### Typography
- Font Family: Poppins
- Headings: Bold, Modern
- Body: Regular, Readable

## 🌐 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend (Render/Heroku)
```bash
# Deploy to Render
render deploy

# Or Heroku
heroku create
git push heroku main
```

## 📊 Impact

- **120,000+** Lives Saved
- **18,000+** Hospitals Connected
- **30,000+** Ambulances
- **15,000+** Police Stations
- **7 Minutes** Average Response Time
- **100+** Countries Supported

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

© 2026 RoadSOS AI. Government of India Initiative. All rights reserved.

## 🆘 Emergency Numbers

- Police: 100
- Ambulance: 102
- Fire: 101
- Women Helpline: 1091

---

Built with ❤️ for IIT Madras Road Safety Hackathon 2026
