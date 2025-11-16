# How to Start the Game Server

## Option 1: Using npm (Recommended)
Open a terminal in this folder and run:
```bash
npm run dev
```

Or:
```bash
npm start
```

## Option 2: Using the Batch File (Windows)
Double-click `start-server.bat`

## Option 3: Using Python
If you have Python installed, run:
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

## Option 4: Direct Browser (No Server)
You can also open `index.html` directly in your browser, but some features might not work.

## After Starting the Server:
1. The browser should open automatically to `http://localhost:8080`
2. If not, manually go to `http://localhost:8080` in your browser
3. Click "Start Game" to play!

## Troubleshooting:
- **Port 8080 already in use?** Change the port in `package.json` or use a different port
- **Server won't start?** Make sure Node.js is installed: `node --version`
- **Still not working?** Try opening `test-minimal.html` instead

