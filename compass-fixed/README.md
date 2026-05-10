# 🧭 COMPASS for Study

> AI-powered competitive exam preparation platform for NEET, JEE, JEE Advanced, GATE, NATA and custom exams.

![COMPASS for Study](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan) ![Claude AI](https://img.shields.io/badge/Claude-Sonnet-orange)

---

## ✨ Features

- 🎨 **Dynamic exam themes** — 6 color themes that switch instantly (NEET, JEE, JEE Advanced, GATE, NATA, Custom)
- 🤖 **COMPASS Robot** — Cinematic connection sequence with animated robot avatar
- 📚 **Syllabus Tracker** — Real syllabi with chapter-level topic checkboxes and progress bars
- 💡 **Study Tips** — Carousel of expert techniques with rotating motivational quotes
- 📅 **AI Study Plan** — Claude-generated 8-hour personalized daily plans
- 📊 **Subject Tracker** — Animated donut rings with strength ratings
- 🧠 **Practice Questions** — MCQ with AI-generated questions, explanations, and scoring
- 💬 **COMPASS Chatbot** — Full AI chat with conversation history in 9 Indian languages
- 👥 **Multi-account** — Switch between multiple student profiles

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

---

## 🌐 Deploy to Vercel

```bash
# One-command deploy
npx vercel

# Or connect your GitHub repo at vercel.com for auto-deploy
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 + custom CSS |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Anthropic Claude claude-sonnet-4-20250514 |
| Fonts | Outfit + DM Sans (Google Fonts) |
| Deploy | Vercel |

---

## 📁 Project Structure

```
compass-study/
├── public/
│   └── compass.svg          # Favicon
├── src/
│   ├── App.jsx              # Main application (all screens + components)
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles + animations
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies
```

---

## 🎓 Supported Exams

| Exam | Color Theme | Subjects |
|------|-------------|----------|
| NEET | Deep Green + Emerald | Physics, Chemistry, Biology |
| JEE Mains | Midnight Blue + Cyan | Physics, Chemistry, Maths |
| JEE Advanced | Deep Indigo + Violet | Physics, Chemistry, Maths |
| GATE (CSE) | Dark Charcoal + Amber | CS, Engineering Maths, Aptitude |
| NATA | Warm Slate + Rose Gold | Maths, Drawing, Aptitude |
| Custom | Navy + Orange | User defined |

---

## 🔑 API

This app uses the Anthropic Claude API directly from the browser for:
- Chatbot conversations
- Practice question generation
- AI study plan generation

The API key is handled by the Anthropic proxy layer.

---

## 📝 License

MIT — Built with ❤️ for Indian students preparing for competitive exams.
