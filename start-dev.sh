#!/bin/bash

# PromptLab Development Startup Script
# This script starts both backend and frontend servers

echo "🎨 Starting PromptLab Development Environment"
echo "=============================================="

# Check if .env exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Create database directory if it doesn't exist
mkdir -p database

# Start backend in background
echo "🚀 Starting Flask backend server on port 5002..."
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "⚡ Starting Vite frontend server on port 5173..."
echo "=============================================="
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5002"
echo "=============================================="
echo "Press Ctrl+C to stop both servers"
echo ""

# Start frontend (this will block)
npm run dev

# When frontend is stopped, also stop backend
echo "Stopping backend server..."
kill $BACKEND_PID