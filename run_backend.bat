@echo off
cd backend
:loop
venv\Scripts\python -c "import fastapi, pandas, statsmodels, firebase_admin" 2>nul
if %errorlevel% equ 0 (
    echo All dependencies found. Starting server...
    venv\Scripts\uvicorn main:app --reload --port 8000
) else (
    echo Waiting for pip install to finish...
    timeout /t 5 >nul
    goto loop
)
