// Minimal working version - TEMPLE RUN GAME
console.log('game.js loading...');

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
    let animationFrame = 0; // For animation
    
    // Expose variables globally for debugging/verification
    window.canvas = canvas;
    window.gameState = gameState;
    
    function init() {
        console.log('Initializing minimal game...');
        
        canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('Canvas not found!');
            return;
        }
        
        // Update global reference
        window.canvas = canvas;
        
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
        // Update global reference
        window.gameState = gameState;
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
        
        // Platforms
        ctx.fillStyle = '#8B4513';
        for (let p of platforms) {
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
        
        // Draw animated running player (always visible, on top of platforms)
        if (gameState === 'playing' || gameState === 'start') {
            drawRunningPlayer(player.x, player.y);
        }
    }
    
    function drawRunningPlayer(x, y) {
        if (!ctx) {
            console.log('No context in drawRunningPlayer');
            return;
        }
        
        // Always update animation frame for smooth animation
        animationFrame += 0.3;
        if (animationFrame > Math.PI * 2) animationFrame = 0;
        
        const sin = Math.sin(animationFrame);
        const cos = Math.cos(animationFrame);
        
        // Draw directly at position - SIMPLIFIED AND BIGGER
        const centerX = x + 20;
        const centerY = y + 25;
        
        // If jumping, draw jumping pose
        if (player.isJumping) {
            drawJumpingPoseDirect(centerX, centerY);
            return;
        }
        
        // Draw character parts directly - BRIGHT COLORS AND BIG
        // Body (torso) - BRIGHT BLUE - VERY BIG
        ctx.fillStyle = '#0066ff';
        ctx.fillRect(centerX - 18, centerY - 25, 36, 40);
        
        // Head - BRIGHT YELLOW/SKIN - VERY BIG
        ctx.fillStyle = '#ffcc99';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 30, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes - BIG BLACK
        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 8, centerY - 35, 4, 4);
        ctx.fillRect(centerX + 4, centerY - 35, 4, 4);
        
        // Hair - DARK BROWN - BIG
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 40, 15, 0, Math.PI);
        ctx.fill();
        
        // Arms (animated - swinging) - BRIGHT AND THICK
        ctx.strokeStyle = '#ffcc99';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        
        // Left arm (back) - animated
        const leftArmAngle = sin * 0.5;
        ctx.save();
        ctx.translate(centerX - 18, centerY - 18);
        ctx.rotate(leftArmAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-15, 25);
        ctx.stroke();
        ctx.restore();
        
        // Right arm (front) - animated
        const rightArmAngle = -sin * 0.5;
        ctx.save();
        ctx.translate(centerX + 18, centerY - 18);
        ctx.rotate(rightArmAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 25);
        ctx.stroke();
        ctx.restore();
        
        // Legs (animated - running) - DARK AND THICK
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 10;
        
        // Left leg (back) - animated
        const leftLegAngle = sin * 0.4;
        ctx.save();
        ctx.translate(centerX - 10, centerY + 15);
        ctx.rotate(leftLegAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-12, 32);
        ctx.stroke();
        // Foot - BRIGHT WHITE
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX - 22, centerY + 42, 12, 6);
        ctx.restore();
        
        // Right leg (front) - animated
        const rightLegAngle = -sin * 0.4;
        ctx.save();
        ctx.translate(centerX + 10, centerY + 15);
        ctx.rotate(rightLegAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(12, 32);
        ctx.stroke();
        // Foot - BRIGHT WHITE
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX + 10, centerY + 42, 12, 6);
        ctx.restore();
        
        // Shirt details - WHITE LINE
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 18, centerY - 8);
        ctx.lineTo(centerX + 18, centerY - 8);
        ctx.stroke();
    }
    
    function drawJumpingPoseDirect(centerX, centerY) {
        // Body (torso)
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(centerX - 15, centerY - 20, 30, 35);
        
        // Head
        ctx.fillStyle = '#ffdbac';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 25, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 6, centerY - 30, 3, 3);
        ctx.fillRect(centerX + 3, centerY - 30, 3, 3);
        
        // Hair
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 35, 12, 0, Math.PI);
        ctx.fill();
        
        // Arms up (jumping pose)
        ctx.strokeStyle = '#ffdbac';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        
        // Left arm up
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 15);
        ctx.lineTo(centerX - 20, centerY - 35);
        ctx.stroke();
        
        // Right arm up
        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY - 15);
        ctx.lineTo(centerX + 20, centerY - 35);
        ctx.stroke();
        
        // Legs bent (jumping)
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 8;
        
        // Left leg
        ctx.beginPath();
        ctx.moveTo(centerX - 8, centerY + 15);
        ctx.lineTo(centerX - 12, centerY + 30);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillRect(centerX - 15, centerY + 28, 10, 5);
        
        // Right leg
        ctx.beginPath();
        ctx.moveTo(centerX + 8, centerY + 15);
        ctx.lineTo(centerX + 12, centerY + 30);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillRect(centerX + 5, centerY + 28, 10, 5);
        
        // Shirt details
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 5);
        ctx.lineTo(centerX + 15, centerY - 5);
        ctx.stroke();
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
            // Update global reference
            window.gameState = gameState;
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
    
    console.log('game.js loaded');
})();

