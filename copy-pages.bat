@echo off
setlocal enabledelayedexpansion

:: Source directory (your webpages folder)
set SOURCE_DIR=C:\references-referencias\webpages

:: Destination directory (development folder)
set DEST_DIR=development

:: Create destination directories (if they don't exist)
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"
if not exist "%DEST_DIR%\join" mkdir "%DEST_DIR%\join"
if not exist "%DEST_DIR%\home" mkdir "%DEST_DIR%\home"
if not exist "%DEST_DIR%\powerline" mkdir "%DEST_DIR%\powerline"
if not exist "%DEST_DIR%\powerlineShow" mkdir "%DEST_DIR%\powerlineShow"
if not exist "%DEST_DIR%\payplan" mkdir "%DEST_DIR%\payplan"
if not exist "%DEST_DIR%\product" mkdir "%DEST_DIR%\product"
if not exist "%DEST_DIR%\profile" mkdir "%DEST_DIR%\profile"
if not exist "%DEST_DIR%\enroller" mkdir "%DEST_DIR%\enroller"
if not exist "%DEST_DIR%\FAQS" mkdir "%DEST_DIR%\FAQS"
if not exist "%DEST_DIR%\leaderboard" mkdir "%DEST_DIR%\leaderboard"
if not exist "%DEST_DIR%\contactus" mkdir "%DEST_DIR%\contactus"
if not exist "%DEST_DIR%\login" mkdir "%DEST_DIR%\login"
if not exist "%DEST_DIR%\logout" mkdir "%DEST_DIR%\logout"

:: Copy files for each page
for %%p in (join home powerline powerlineShow payplan product profile enroller FAQS leaderboard contactus login logout) do (
    echo Copying files for %%p...
    if exist "%SOURCE_DIR%\%%p" (
        xcopy /E /I /Y /Q "%SOURCE_DIR%\%%p\*" "%DEST_DIR%\%%p\"
        echo Completed copying files for %%p
    ) else (
        echo Warning: Source directory %SOURCE_DIR%\%%p does not exist
    )
)

echo All files have been copied successfully!
pause 