@echo off
setlocal EnableDelayedExpansion

rem === Path to source and output folders ===
set "SOURCE=H:\TLLib\sources"
set "OUTPUT=H:\TLLib\docs\sources"

rem === Make sure output folder exists ===
if not exist "%OUTPUT%" mkdir "%OUTPUT%"

rem === Loop through all files in subfolders ===
for /R "%SOURCE%" %%F in (*) do (
    rem Get just the filename
    set "filepath=%%~fF"
    set "filename=%%~nxF"

    rem Compress using 7z (GZIP format)
    7z a -tgzip "%OUTPUT%\!filename!.gz" "!filepath!" >nul

    echo Compressed: !filename!.gz
)