@echo off

rem "Init app"
start "Frontend" cmd /k "python -m http.server 8000"

rem "Open app"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000"


