@echo off
echo Starting Clinio API (port 4000)...
start "Clinio API" cmd /k "cd /d %~dp0backend && node src/index.js"

echo Starting Clinio UI (port 5173)...
start "Clinio UI" cmd /k "cd /d %~dp0frontend && npx vite --port 5173"

echo.
echo Clinio is launching in two windows.
echo   UI:  http://localhost:5173
echo   API: http://localhost:4000
pause
