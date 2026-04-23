
# 🎯 AI Resume Screener & Job Recommender

A production-ready full-stack mobile application that uses AI to analyze resumes and recommend jobs.

## 📁 Project Structure

```
resume-app/
├── app/                    # React Native (Expo) mobile app
│   ├── components/         # Reusable UI components
│   ├── screens/            # App screens
│   ├── services/           # API service layer
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # React Navigation setup
│   ├── utils/              # Utility functions
│   └── App.tsx             # Root component
│
└── server/                 # Node.js + Express backend
    ├── controllers/        # Route controllers
    ├── routes/             # Express routes
    ├── models/             # Mongoose models
    ├── services/           # Business logic (AI, parsing)
    ├── utils/              # Utility helpers
    └── server.js           # Entry point
```

## 🚀 Quick Start

### Backend
```bash
cd server
npm install
cp .env.example .env   # Fill in your API keys
npm run dev
```

### Mobile App
```bash
cd app
npm install
npx expo start
```

## 🔑 Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT signing secret

### App (.env)
- `EXPO_PUBLIC_API_URL` - Backend API URL

## 📱 Features
- Resume upload (PDF/DOCX)
- AI-powered resume analysis
- Skill extraction
- Job matching with relevance scores
- Clean minimal UI with smooth animations
