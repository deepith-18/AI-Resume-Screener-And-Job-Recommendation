
# 🚀 AI-Powered Resume Screening & Job Matching Platform

A full-stack mobile and web ecosystem designed to bridge the gap between candidates and their ideal career paths. This platform uses forensic keyword indexing to analyze resumes, extract domain-specific engineering skills, and generate personalized learning roadmaps.

---

## 🌟 Features

*   **Multi-Disciplinary Analysis**: Supports Software, Aerospace, Electrical, Mechanical, and Civil engineering branches.
*   **Forensic Skill Extraction**: Intelligent parsing of PDFs to identify technical tools, software, and core engineering concepts.
*   **Dynamic Job Matching**: Ranked career matches based on a 60/40 weighted split of skill coverage and proficiency.
*   **AI Roadmaps**: Personalized learning paths generated based on the gap between your skills and industry requirements.
*   **Cross-Platform Mobile App**: Built with React Native and Expo for a seamless Android experience.

---

## 🛠️ Tech Stack

### Frontend (Mobile)
*   **Framework**: React Native / Expo
*   **State Management**: Hooks & Context API
*   **Networking**: Axios with custom interceptors for high-stability file uploads
*   **File Handling**: Expo FileSystem for native URI management

### Backend
*   **Server**: Node.js & Express
*   **Database**: MongoDB (Atlas)
*   **PDF Parsing**: PDF-Parse with forensic fallback logic
*   **Hosting**: Render (Web Services)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Expo CLI
*   MongoDB URI

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/resume-app.git](https://github.com/yourusername/resume-app.git)
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file with MONGO_URI and PORT
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npx expo start
   ```

---

## 📱 Screenshots

| Login Screen | Resume Analysis | Job Matches |
| :---: | :---: | :---: |
| ![Login](https://via.placeholder.com/200x400) | ![Analysis](https://via.placeholder.com/200x400) | ![Matches](https://via.placeholder.com/200x400) |

---

## 🔧 System Configuration (Pro-Tips)

*   **Production Uploads**: Uses a `trust proxy` configuration on the backend to handle high-traffic file uploads through Render's load balancers.
*   **APK Stability**: Includes specialized `content://` to `file://` URI conversion for reliable Android file handling.
*   **Matching Logic**: Employs a relaxed 1-skill-minimum filter to ensure users always receive actionable feedback.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

## 📄 License

Distributed under the MIT License.
```

---

### Why this README works:
*   **Visual Hierarchy**: It uses bold headings and horizontal rules to separate complex sections.
*   **Tech Specifics**: It highlights your expertise in **Node.js**, **React Native**, and **MongoDB**.
*   **Problem-Solving**: It mentions specific technical hurdles you overcame, like "forensic keyword indexing" and "APK stability," which shows employers you can handle real-world deployment issues.
*   **Clean Installation**: It provides clear steps for anyone to run your code locally.

**Recommendation**: Replace the placeholder image links with actual screenshots from your app before you commit!
