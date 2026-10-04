@echo off
cd backend
:loop
venv\Scripts\python.exe -c "import fastapi, pandas, statsmodels, firebase_admin" 2>nul
if %errorlevel% equ 0 (
    echo All dependencies installed. Starting FastAPI server...
    venv\Scripts\uvicorn main:app --reload --port 8000
) else (
    echo Waiting for background installation to complete...
    timeout /t 5 >nul
    goto loop
)
