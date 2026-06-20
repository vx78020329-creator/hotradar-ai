# HotRadar AI - Start Script
# Starts both backend (FastAPI) and frontend (Next.js)

Write-Host ""
Write-Host "  _   _           ___           _             " -ForegroundColor Cyan
Write-Host " | | | | ___  _ _/ _ \__ _ _ _| | __ _ _ _  " -ForegroundColor Cyan
Write-Host " | |_| |/ _ \| '_| (_) \ \/ _ | |/ _ | ' \ " -ForegroundColor Cyan
Write-Host "  \___/ \___/|_|  \___//_\__,_|_|\__,_|_||_|" -ForegroundColor Cyan
Write-Host ""
Write-Host "  AI Industry Hotspot Radar" -ForegroundColor Yellow
Write-Host "  Starting services..." -ForegroundColor Green
Write-Host ""

$python = "C:\Users\86178\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$npm = "C:\Users\86178\nodejs\npm.cmd"
$projectRoot = "C:\Users\86178\Documents\New project\hotradar-ai"

# Check if backend is already running
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  [OK] Backend already running on :8000" -ForegroundColor Green
} catch {
    Write-Host "  [START] Backend (FastAPI on :8000)..." -ForegroundColor Yellow
    Start-Process -FilePath $python -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000" -WorkingDirectory "$projectRoot\backend" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    try {
        $health = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -TimeoutSec 5
        Write-Host "  [OK] Backend started on :8000" -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] Backend may need more time to start" -ForegroundColor Yellow
    }
}

# Check if frontend is already running
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  [OK] Frontend already running on :3001" -ForegroundColor Green
} catch {
    Write-Host "  [START] Frontend (Next.js on :3001)..." -ForegroundColor Yellow
    Start-Process -FilePath $npm -ArgumentList "run","dev","--","-p","3001" -WorkingDirectory "$projectRoot\frontend" -WindowStyle Hidden
    Start-Sleep -Seconds 8
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 10
        Write-Host "  [OK] Frontend started on :3001" -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] Frontend may need more time to start" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "  ===========================================" -ForegroundColor Cyan
Write-Host "  HotRadar AI is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:  http://localhost:3001" -ForegroundColor White
Write-Host "  Backend:   http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  Swagger:   http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "  API Docs:  http://127.0.0.1:8000/redoc" -ForegroundColor White
Write-Host "  ===========================================" -ForegroundColor Cyan
Write-Host ""