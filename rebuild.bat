@echo off
REM Quick rebuild script for Windows users

cd /d "%~dp0"
call venv\Scripts\activate.bat
mkdocs build
echo.
echo ✓ Site rebuilt! Refresh your browser at http://127.0.0.1:8000

