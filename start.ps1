# PrajaAI - Smart Village AI Platform Launcher (PowerShell)
Write-Host "===================================================" -ForegroundColor Green
Write-Host "    PrajaAI - Smart Village AI Platform" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

$root = $PSScriptRoot

Write-Host "[1/2] Starting Backend FastAPI Server (Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

Write-Host "[2/2] Starting Frontend Vite Server (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Launching web browser..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:5173"

Write-Host ""
Write-Host "PrajaAI is running!" -ForegroundColor Green
Write-Host "Frontend URL:    http://127.0.0.1:5173" -ForegroundColor White
Write-Host "Backend API URL: http://127.0.0.1:8000/docs" -ForegroundColor White
