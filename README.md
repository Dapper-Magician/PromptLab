# 🎨 PromptLab - Prompt Engineer Workspace

A state-of-the-art full-stack application for storing, organizing, testing, and analyzing AI prompts. Built as a comprehensive IDE for prompt engineering workflows.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Current Features (v2.0)
- ✅ **Prompt Management** - Create, edit, organize, and version control your prompts
- ✅ **Category System** - Organize prompts with color-coded categories
- ✅ **Command Palette** - Quick search and navigation (Ctrl+K)
- ✅ **Version Control** - Non-destructive updates with full version history
- ✅ **Analytics Dashboard** - Track usage and metrics
- ✅ **Modern UI** - Beautiful, responsive interface with dark/light themes
- ✅ **Real-time Search** - Filter and find prompts instantly

### Coming Soon
- 🚧 **AI Testing Workbench** - Multi-model testing with OpenAI, Anthropic, Google
- 🚧 **Advanced Analytics** - Visualizations, cost tracking, performance metrics
- 🚧 **Template System** - Reusable templates with AI-powered autofill
- 🚧 **Text Shortcuts** - Espanso-like text expansion
- 🚧 **Integrations** - Git, cloud storage, external apps

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js

### Installation

#### Option 1: Automated Setup (Recommended)

**Linux/macOS:**
```bash
./start-dev.sh
```

**Windows:**
```bash
start-dev.bat
```

The script will automatically:
- Create `.env` file from template
- Set up Python virtual environment
- Install all dependencies
- Start both backend and frontend servers

#### Option 2: Manual Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd PromptLab
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Backend Setup**
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

4. **Frontend Setup**
```bash
# Install Node.js dependencies
npm install
```

5. **Start the application**

In one terminal (Backend):
```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

In another terminal (Frontend):
```bash
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5002
- **Health Check**: http://localhost:5002/health

## 🏗️ Project Structure

```
PromptLab/
├── src/                      # Frontend React application
│   ├── components/          # React components
│   │   └── ui/             # Shadcn UI components
│   ├── models/             # Python database models
│   ├── routes/             # Flask API routes
│   └── lib/                # Utility functions
├── database/               # SQLite database
├── static/                 # Production build output
├── main.py                 # Flask backend entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Node.js dependencies
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality React components
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend
- **Flask 3.0** - Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Flask-CORS** - Cross-Origin Resource Sharing
- **SQLite** - Lightweight database
- **python-dotenv** - Environment variable management

## 📝 Configuration

### Environment Variables

The `.env` file contains all configuration. Key variables:

```bash
# Flask Configuration
SECRET_KEY=your-secret-key-change-this
FLASK_DEBUG=True
PORT=5002

# Database
DATABASE_URI=sqlite:///database/app.db

# CORS (for development)
CORS_ORIGINS=http://localhost:5173,http://localhost:5002

# API Keys (for future AI features)
OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here
GOOGLE_API_KEY=your-key-here
```

### Development vs Production

**Development:**
- Runs on `localhost:5173` (frontend) and `localhost:5002` (backend)
- Hot module replacement enabled
- Debug mode active
- Detailed error messages

**Production:**
- Build frontend: `npm run build`
- Serves static files from `/static`
- Debug mode disabled
- Optimized bundles

## 🔨 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
python main.py       # Start Flask server
```

### Database Management

The SQLite database is automatically created at `database/app.db` on first run.

**Reset database:**
```bash
rm database/app.db
python main.py  # Will recreate tables
```

**Backup database:**
```bash
cp database/app.db database/app.backup.db
```

## 🎨 UI Components

PromptLab uses [Shadcn/UI](https://ui.shadcn.com/) components. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add button
```

## 🧪 Testing

### Backend Tests
```bash
pytest
```

### Frontend Tests
```bash
npm test
```

## 📊 API Documentation

### Prompts

- `GET /api/prompts` - List all prompts
- `POST /api/prompts` - Create prompt
- `GET /api/prompts/:id` - Get prompt by ID
- `PUT /api/prompts/:id` - Update prompt (creates new version)
- `DELETE /api/prompts/:id` - Delete prompt
- `GET /api/prompts/:id/versions` - Get prompt version history
- `POST /api/prompts/search` - Advanced search

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `GET /api/categories/:id` - Get category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Test Results

- `GET /api/tests` - List test results
- `POST /api/tests` - Create test result
- `GET /api/tests/:id` - Get test result
- `POST /api/tests/batch` - Batch create tests

## 🚢 Deployment

### Building for Production

1. **Build frontend:**
```bash
npm run build
```

2. **Set production environment:**
```bash
export FLASK_ENV=production
export FLASK_DEBUG=False
```

3. **Run with production server:**
```bash
gunicorn -w 4 -b 0.0.0.0:5002 main:app
```

### Docker Deployment (Coming Soon)

```bash
docker-compose up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Flask](https://flask.palletsprojects.com/) for the robust Python web framework
- [Vite](https://vitejs.dev/) for the lightning-fast build tool

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for Prompt Engineers**