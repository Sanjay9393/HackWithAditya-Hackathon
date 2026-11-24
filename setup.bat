@echo off
title PrajaAI - Automated Team Onboarding Setup
echo ===================================================
echo     PrajaAI - Team Onboarding Setup
echo ===================================================
echo.

echo [1/4] Copying environment templates...
if not exist ".env" copy .env.example .env >nul
if not exist "backend\.env" copy backend\.env.example backend\.env >nul
echo Environment templates copied.

echo.
echo [2/4] Setting up Python virtual environment in backend...
cd /d %~dp0backend
if not exist ".venv" (
    python -m venv .venv
)
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
cd /d %~dp0
echo Backend dependencies installed.

echo.
echo [3/4] Installing Frontend npm dependencies...
cd /d %~dp0frontend
call npm install
cd /d %~dp0
echo Frontend dependencies installed.

echo.
echo [4/4] Setup complete!
echo You can now start PrajaAI by running .\start.bat
echo ===================================================
pause
