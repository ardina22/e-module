@echo off
setlocal

:: Remove .gh-pages directory if it exists
if exist .gh-pages (
    rmdir /s /q .gh-pages
)

:: Clone the gh-pages branch
git clone -b gh-pages https://github.com/ardina22/e-module.git .gh-pages
if errorlevel 1 (
    echo ❌ Failed to clone repository
    exit /b 1
)

:: Remove old public/modules and public/images
if exist public\modules (
    rmdir /s /q public\modules
)
if exist public\images (
    rmdir /s /q public\images
)

:: Copy images and modules from .gh-pages
xcopy /e /i /y .gh-pages\assets\images public\images
xcopy /e /i /y .gh-pages\modules public\modules

:: Remove .gh-pages again
rmdir /s /q .gh-pages

echo ✅ Clone and copy completed successfully
endlocal
