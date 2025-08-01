@echo off
setlocal

:: Get the absolute path to the project root (assuming script is in scripts\)
cd /d %~dp0\..
start cmd /k "npm run dev"
start cmd /k "node server\index.js"

endlocal
