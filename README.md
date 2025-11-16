# Temple Run - Endless Runner Game

A classic endless runner game where you control a character running across multiple platform types including land, rope bridges, and mountain platforms.

## How to Run

### Option 1: Using npm (Recommended)
```bash
npm run dev
```
This will start a local server on `http://localhost:8000` and open it in your browser automatically.

### Option 2: Direct Browser
Simply open `index.html` in your web browser.

### Option 3: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

## How to Play

1. Click "Start Game" to begin
2. Use **SPACE** or **UP ARROW** to jump
3. Avoid falling off platforms
4. Your score increases based on distance traveled
5. The game speed gradually increases as you progress

## Features

- **Multiple Platform Types:**
  - **Land Platforms**: Brown platforms with grass on top
  - **Rope Bridges**: Suspended rope bridges with wooden planks
  - **Mountain Platforms**: Rocky mountain platforms with varying heights

- **Game Mechanics:**
  - Smooth jumping physics
  - Collision detection
  - Progressive difficulty (speed increases over time)
  - Score and distance tracking
  - Beautiful gradient backgrounds with animated clouds

## Controls

- **SPACE** or **UP ARROW**: Jump
- **Mouse**: Click buttons to start/restart game

## Technical Details

- Built with HTML5 Canvas and vanilla JavaScript
- No build process required - runs directly in browser
- Responsive design with modern UI
- Smooth 60 FPS gameplay
- Development server via `http-server` (optional)

Enjoy the game!

