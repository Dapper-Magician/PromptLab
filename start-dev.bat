@echo off
REM PromptLab Development Startup Script for Windows
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo  Starting PromptLab Development Environment
echo ========================================
echo.

REM Check if .env exists, if not copy from .env.example
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please update .env with your configuration
    echo.
)

REM Check if virtual environment exists
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    echo Virtual environment created
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing Node.js dependencies...
    npm install
    echo.
)

REM Create database directory if it doesn't exist
if not exist database mkdir database

REM Start backend in new window
echo Starting Flask backend server on port 5002...
start "PromptLab Backend" cmd /k "venv\Scripts\activate.bat && python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting Vite frontend server on port 5173...
echo ========================================
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5002
echo ========================================
echo Press Ctrl+C to stop frontend server
echo Backend runs in separate window
echo.

npm run dev