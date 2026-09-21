@echo off
setlocal EnableExtensions

title Brozler Studios - Publisher

cd /d "%~dp0"

set "LOCK_DIR=%~dp0.brozler-publish.lock"

echo.
echo ==========================================
echo        BROZLER STUDIOS PUBLISHER
echo ==========================================
echo.

REM ============================================================
REM SINGLE INSTANCE PROTECTION
REM ============================================================

if exist "%LOCK_DIR%" (
    echo.
    echo ==========================================
    echo      PUBLISHER ALREADY RUNNING
    echo ==========================================
    echo.
    echo Another Brozler Publisher process is
    echo already running.
    echo.
    echo Please wait for it to finish.
    echo.
    pause
    exit /b 1
)

mkdir "%LOCK_DIR%" >nul 2>&1

if errorlevel 1 (
    echo.
    echo ERROR: Could not create publisher lock.
    echo.
    pause
    exit /b 1
)

REM ============================================================
REM GIT CHECK
REM ============================================================

echo [1/7] Checking Git...

git --version >nul 2>&1

if errorlevel 1 (
    echo.
    echo ERROR: Git is not installed or unavailable.
    echo.
    rmdir "%LOCK_DIR%" >nul 2>&1
    pause
    exit /b 1
)

echo Git OK.
echo.

REM ============================================================
REM STOP LOCAL NEXT DEV SERVER
REM ============================================================

echo [2/7] Checking for local Next.js server...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$pids = Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'node.exe' -and $_.CommandLine -match 'next[\\\/ ]+dev' } | Select-Object -ExpandProperty ProcessId; if ($pids) { Write-Host 'Stopping local Next.js development server...'; $pids | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; Start-Sleep -Seconds 2 } else { Write-Host 'No local Next.js development server found.' }"

echo.

REM ============================================================
REM OPTIMIZE VIDEOS
REM ============================================================

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

    rmdir "%LOCK_DIR%" >nul 2>&1

    pause
    exit /b 1
)

echo.
echo Video optimization complete.
echo.

REM ============================================================
REM PRODUCTION BUILD
REM ============================================================

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

    rmdir "%LOCK_DIR%" >nul 2>&1

    pause
    exit /b 1
)

echo.
echo Build successful.
echo.

REM ============================================================
REM STAGE ALL CHANGES INCLUDING DELETIONS
REM ============================================================

echo [5/7] Staging all changes...

git add -A

if errorlevel 1 (
    echo.
    echo ERROR: Git could not stage the changes.
    echo.

    rmdir "%LOCK_DIR%" >nul 2>&1

    pause
    exit /b 1
)

echo Changes staged.
echo.

REM ============================================================
REM SHOW EXACT CHANGES
REM ============================================================

echo ==========================================
echo        CHANGES TO BE PUBLISHED
echo ==========================================
echo.

git status --short

echo.
echo ==========================================
echo.

REM ============================================================
REM CHECK FOR CHANGES
REM ============================================================

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

    rmdir "%LOCK_DIR%" >nul 2>&1

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

    rmdir "%LOCK_DIR%" >nul 2>&1

    pause
    exit /b 1
)

echo.
echo Commit created.
echo.

REM ============================================================
REM PUSH TO GITHUB
REM ============================================================

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

    rmdir "%LOCK_DIR%" >nul 2>&1

    pause
    exit /b 1
)

REM ============================================================
REM SUCCESS
REM ============================================================

rmdir "%LOCK_DIR%" >nul 2>&1

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