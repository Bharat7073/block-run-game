Write-Host "Starting Temple Run Game Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will start on http://localhost:8080" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
npx http-server -p 8080 -o

