@echo off
setlocal EnableExtensions

title Brozler Studios - Publisher

cd /d "%~dp0"

echo.
echo ==========================================
echo        BROZLER STUDIOS PUBLISHER
echo ==========================================
echo.

echo [1/7] Checking Git...

git --version >nul 2>&1

if errorlevel 1 (
    echo.
    echo ERROR: Git is not installed or unavailable.
    echo.
    pause
    exit /b 1
)

echo Git OK.
echo.

echo [2/7] Checking for local Next.js server...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$pids = Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'node.exe' -and $_.CommandLine -match 'next[\\\/ ]+dev' } | Select-Object -ExpandProperty ProcessId; if ($pids) { Write-Host 'Stopping local Next.js development server...'; $pids | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; Start-Sleep -Seconds 2 } else { Write-Host 'No local Next.js development server found.' }"

echo.
echo [3/7] Optimizing videos...

node optimize-videos.mjs

if errorlevel 1 (
    echo.
    echo ==========================================
    echo       VIDEO OPTIMIZATION FAILED
    echo ==========================================
    echo.
    echo Your changes were NOT pushed to GitHub.
    echo.
    pause
    exit /b 1
)

echo.
echo Video optimization complete.
echo.

echo [4/7] Building production version...

call npm run build

if errorlevel 1 (
    echo.
    echo ==========================================
    echo            BUILD FAILED
    echo ==========================================
    echo.
    echo Your changes were NOT pushed to GitHub.
    echo.
    echo Fix the build error and run this file again.
    echo.
    pause
    exit /b 1
)

echo.
echo Build successful.
echo.

echo [5/7] Staging changes...

git add .

if errorlevel 1 (
    echo.
    echo ERROR: Git could not stage the changes.
    echo.
    pause
    exit /b 1
)

echo Changes staged.
echo.

echo [6/7] Checking for changes...

git diff --cached --quiet

if errorlevel 0 (
    echo.
    echo ==========================================
    echo          NO CHANGES TO PUBLISH
    echo ==========================================
    echo.
    echo Your GitHub repository is already up to date.
    echo.
    pause
    exit /b 0
)

echo Changes detected.
echo.

echo Creating commit...

git commit -m "Update Brozler Studios portfolio"

if errorlevel 1 (
    echo.
    echo ERROR: Commit failed.
    echo.
    pause
    exit /b 1
)

echo.
echo Commit created.
echo.

echo [7/7] Pushing to GitHub...

git push origin main

if errorlevel 1 (
    echo.
    echo ==========================================
    echo             PUSH FAILED
    echo ==========================================
    echo.
    echo The changes were committed locally,
    echo but could not be pushed to GitHub.
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo       PUBLISHED SUCCESSFULLY
echo ==========================================
echo.
echo GitHub has been updated.
echo.
echo Vercel will automatically deploy
echo the new version.
echo.
echo ==========================================
echo.

pause