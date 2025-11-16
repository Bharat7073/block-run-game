@echo off
echo Starting Temple Run Game Server...
echo.
echo Server will start on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
npx http-server -p 8080 -o
pause

