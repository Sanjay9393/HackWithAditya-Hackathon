@echo off
title PrajaAI - Smart Village AI Platform Launcher
echo ===================================================
echo     PrajaAI - Smart Village AI Platform
echo ===================================================
echo.
echo [1/2] Starting Backend FastAPI Server (Port 8000)...
start "PrajaAI Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Vite Server (Port 5173)...
start "PrajaAI Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://127.0.0.1:5173 ...
start http://127.0.0.1:5173

echo.
echo Both servers are running!
echo Frontend: http://127.0.0.1:5173
echo Backend API: http://127.0.0.1:8000/docs
echo.
pause
