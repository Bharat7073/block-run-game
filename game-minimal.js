// Minimal working version - TEMPLE RUN GAME
console.log('game-minimal.js loading...');

// Wait for DOM
(function() {
    'use strict';
    
    let canvas, ctx;
    let gameState = 'start';
    let platforms = [];
    let player = { x: 100, y: 300, width: 40, height: 50, velocityY: 0, isJumping: false };
    let gameSpeed = 3;
    let score = 0;
    let distance = 0;
    
    function init() {
        console.log('Initializing minimal game...');
        
        canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas not found!');
            return;
        }
        
        ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // Buttons
        const startBtn = document.getElementById('startButton');
        const restartBtn = document.getElementById('restartButton');
        
        if (startBtn) startBtn.onclick = startGame;
        if (restartBtn) restartBtn.onclick = startGame;
        
        // Keyboard
        document.onkeydown = function(e) {
            if (gameState === 'playing' && (e.key === ' ' || e.key === 'ArrowUp')) {
                e.preventDefault();
                if (!player.isJumping) {
                    player.velocityY = -12;
                    player.isJumping = true;
                }
            }
        };
        
        // Create initial platforms
        for (let i = 0; i < 10; i++) {
            platforms.push({
                x: 50 + i * 200,
                y: 300,
                width: 150,
                height: 30,
                color: '#8B4513'
            });
        }
        
        draw();
        gameLoop();
        console.log('Minimal game initialized!');
    }
    
    function startGame() {
        console.log('Starting game...');
        gameState = 'playing';
        score = 0;
        distance = 0;
        gameSpeed = 3;
        player.y = 300;
        player.velocityY = 0;
        player.isJumping = false;
        
        platforms = [];
        for (let i = 0; i < 10; i++) {
            platforms.push({
                x: 50 + i * 200,
                y: 300,
                width: 150,
                height: 30,
                color: '#8B4513'
            });
        }
        
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
    }
    
    function draw() {
        if (!ctx) return;
        
        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, '#87CEEB');
        grad.addColorStop(0.5, '#98D8C8');
        grad.addColorStop(1, '#6B8E23');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
        
        if (gameState === 'playing') {
            // Platforms
            ctx.fillStyle = '#8B4513';
            for (let p of platforms) {
                ctx.fillRect(p.x, p.y, p.width, p.height);
            }
            
            // Player
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }
    
    function update() {
        if (gameState !== 'playing') return;
        
        // Gravity
        player.velocityY += 0.5;
        player.y += player.velocityY;
        
        // Platform collision
        let onPlatform = false;
        for (let p of platforms) {
            if (player.x + player.width > p.x &&
                player.x < p.x + p.width &&
                player.y + player.height >= p.y &&
                player.y + player.height <= p.y + p.height + 5 &&
                player.velocityY >= 0) {
                player.y = p.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                onPlatform = true;
                break;
            }
        }
        
        // Move platforms
        for (let i = platforms.length - 1; i >= 0; i--) {
            platforms[i].x -= gameSpeed;
            if (platforms[i].x + platforms[i].width < 0) {
                platforms.splice(i, 1);
            }
        }
        
        // Create new platforms
        if (platforms.length < 10) {
            const last = platforms[platforms.length - 1];
            if (last && last.x < 800) {
                platforms.push({
                    x: last.x + last.width + 100,
                    y: 300,
                    width: 150,
                    height: 30,
                    color: '#8B4513'
                });
            }
        }
        
        // Update score
        distance += gameSpeed * 0.1;
        score = Math.floor(distance * 10);
        const scoreEl = document.getElementById('score');
        const distEl = document.getElementById('distance');
        if (scoreEl) scoreEl.textContent = score;
        if (distEl) distEl.textContent = Math.floor(distance) + 'm';
        
        // Game over
        if (player.y > 600) {
            gameState = 'gameOver';
            const finalScore = document.getElementById('finalScore');
            const finalDist = document.getElementById('finalDistance');
            const gameOverScreen = document.getElementById('gameOverScreen');
            if (finalScore) finalScore.textContent = score;
            if (finalDist) finalDist.textContent = Math.floor(distance) + 'm';
            if (gameOverScreen) gameOverScreen.style.display = 'flex';
        }
    }
    
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('game-minimal.js loaded');
})();

