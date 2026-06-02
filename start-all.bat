@echo off
echo Starting ClinicFlow Backend (port 4000)...
start "ClinicFlow API" cmd /k "cd /d E:\ClinicFlow\backend && node src/index.js"

echo Starting CounselFlow Backend (port 4001)...
start "CounselFlow API" cmd /k "cd /d E:\CounselFlow\backend && node src/index.js"

echo Starting ClinicFlow Frontend (port 5173)...
start "ClinicFlow UI" cmd /k "cd /d E:\ClinicFlow\frontend && npx vite --port 5173"

echo Starting CounselFlow Frontend (port 5174)...
start "CounselFlow UI" cmd /k "cd /d E:\CounselFlow\frontend && npx vite --port 5174"

echo.
echo All 4 servers launching in separate windows.
echo   ClinicFlow:   http://localhost:5173  (API: http://localhost:4000)
echo   CounselFlow:  http://localhost:5174  (API: http://localhost:4001)
pause
