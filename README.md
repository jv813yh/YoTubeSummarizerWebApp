> A premium, AI-powered YouTube video summarizer web application.

![VendyGo Tools Banner](assets/banner.png)

transforms long YouTube videos into concise, structured summaries using advanced AI. Built with a focus on aesthetics and user experience, it features a glassmorphism UI, smooth animations, and robust transcript handling.

## ✨ Features

- **🎥 Universal Summarization**: Works on any YouTube video with captions (manual or auto-generated).
- **🎨 Variable Output Styles**: Choose from *Executive Summary*, *Study Notes*, *Technical Breakdown*, or *Blog Post*.
- **🌍 Multi-Language Support**: Get summaries in English, German, Slovak, Czech, Spanish, or French.
- **⚡ Smart Processing**: Automatically handles long videos by chunking transcripts to fit AI context windows.
- **💎 Premium UI**: Built with a "Cogni:Wave" design system featuring glassmorphism, gradients, and responsive layouts.

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python framework.
- **YouTube Transcript API**: Robust transcript extraction with multi-strategy fallback.
- **OpenAI API**: Powered by GPT-4o / GPT-3.5 for intelligent synthesis.

### Frontend
- **React + Vite**: Blazing fast frontend methodology.
- **Tailwind CSS**: Utility-first styling for complex designs.
- **Framer Motion**: Smooth, production-grade animations.
- **Lucide React**: Beautiful, consistent iconography.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- OpenAI API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/repo_name.git
cd repo_name.
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Configuration**:
Create a `.env` file in the `backend/` directory:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

### 4. Run the Application
**Backend**:
```bash
fastapi dev
# Server starts at http://localhost:8000
```

**Frontend**:
```bash
npm run dev
# App starts at http://localhost:5173
```

## 📝 Usage

1.  Copy a YouTube URL (e.g., `https://www.youtube.com/watch?v=...`).
2.  Paste it into the input field on the home page.
3.  Select your desired **Markdown Style** (e.g., Study Notes).
4.  Select your **Target Language**.
5.  Click **Generate Summary** and watch the magic happen! 🪄

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
