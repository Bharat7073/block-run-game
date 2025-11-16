// Game Canvas Setup - will be initialized after DOM loads
let canvas = null;
let ctx = null;

// Make canvas accessible globally for debugging
window.canvas = canvas;
window.ctx = ctx;

// Game State
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let distance = 0;
let gameSpeed = 3;
let platforms = [];
let lastPlatformY = 300;

// Player
const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 50,
    velocityY: 0,
    isJumping: false,
    groundY: 300,
    color: '#ff6b6b'
};

// Platform Types
const PLATFORM_TYPES = {
    LAND: 'land',
    ROPE: 'rope',
    MOUNTAIN: 'mountain'
};

// Initialize platforms
function initPlatforms() {
    platforms = [];
    // Create initial platform for player to start on
    createPlatform(50, lastPlatformY);
    // Create more platforms ahead
    for (let i = 1; i < 10; i++) {
        createPlatform(50 + i * 200, lastPlatformY);
    }
}

function createPlatform(x, y) {
    const types = [PLATFORM_TYPES.LAND, PLATFORM_TYPES.ROPE, PLATFORM_TYPES.MOUNTAIN];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let width, height, color, ropeSegments = 0;
    
    switch(type) {
        case PLATFORM_TYPES.LAND:
            width = 150 + Math.random() * 100;
            height = 30;
            color = '#8B4513';
            break;
        case PLATFORM_TYPES.ROPE:
            width = 80;
            height = 20;
            color = '#654321';
            ropeSegments = 5;
            break;
        case PLATFORM_TYPES.MOUNTAIN:
            width = 120 + Math.random() * 80;
            height = 40 + Math.random() * 30;
            color = '#696969';
            break;
    }
    
    // Vary Y position for variety, but keep it reasonable
    const yVariation = (Math.random() - 0.5) * 120;
    const newY = Math.max(200, Math.min(450, y + yVariation));
    lastPlatformY = newY;
    
    platforms.push({
        x: x,
        y: newY,
        width: width,
        height: height,
        type: type,
        color: color,
        ropeSegments: ropeSegments
    });
}

// Draw Functions
function drawPlayer() {
    if (!ctx) return;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw simple face
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 10, player.y + 10, 8, 8);
    ctx.fillRect(player.x + 22, player.y + 10, 8, 8);
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x + 12, player.y + 12, 4, 4);
    ctx.fillRect(player.x + 24, player.y + 12, 4, 4);
    
    // Draw arms (running animation)
    ctx.fillStyle = player.color;
    const armOffset = Math.sin(Date.now() / 100) * 5;
    ctx.fillRect(player.x - 5, player.y + 15 + armOffset, 8, 20);
    ctx.fillRect(player.x + player.width - 3, player.y + 15 - armOffset, 8, 20);
}

function drawPlatform(platform) {
    if (!ctx) return;
    ctx.fillStyle = platform.color;
    
    switch(platform.type) {
        case PLATFORM_TYPES.LAND:
            // Draw land platform with grass
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.fillStyle = '#228B22';
            ctx.fillRect(platform.x, platform.y, platform.width, 5);
            break;
            
        case PLATFORM_TYPES.ROPE:
            // Draw rope bridge
            const segments = platform.ropeSegments || 5;
            const segmentWidth = platform.width / segments;
            for (let i = 0; i < segments; i++) {
                const segmentX = platform.x + i * segmentWidth;
                // Rope segments
                ctx.fillStyle = '#654321';
                ctx.fillRect(segmentX, platform.y, segmentWidth, 3);
                // Wood planks
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(segmentX, platform.y + 3, segmentWidth, platform.height - 3);
            }
            // Draw rope lines above
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(platform.x, platform.y - 20);
            ctx.lineTo(platform.x + platform.width, platform.y - 20);
            ctx.stroke();
            break;
            
        case PLATFORM_TYPES.MOUNTAIN:
            // Draw mountain platform
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            // Add some texture
            ctx.fillStyle = '#808080';
            for (let i = 0; i < 3; i++) {
                const rockX = platform.x + Math.random() * platform.width;
                const rockY = platform.y + Math.random() * platform.height;
                ctx.fillRect(rockX, rockY, 10, 10);
            }
            break;
    }
}

function drawBackground() {
    if (!ctx || !canvas) return;
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#98D8C8');
    gradient.addColorStop(1, '#6B8E23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 5; i++) {
        const cloudX = (i * 200 + Date.now() / 50) % (canvas.width + 100) - 50;
        const cloudY = 50 + i * 30;
        drawCloud(cloudX, cloudY);
    }
}

function drawCloud(x, y) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Physics and Collision
function updatePlayer() {
    // Apply gravity
    player.velocityY += 0.5;
    player.y += player.velocityY;
    
    // Check platform collision
    let onPlatform = false;
    for (let platform of platforms) {
        if (player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height + 5 &&
            player.velocityY >= 0) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            player.groundY = platform.y;
            onPlatform = true;
            break;
        }
    }
    
    // If not on platform and falling, mark as jumping
    if (!onPlatform && player.velocityY > 0) {
        player.isJumping = true;
    }
    
    // Fall detection
    if (canvas && player.y > canvas.height) {
        gameOver();
    }
    
    // Keep player on screen horizontally
    if (canvas) {
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }
}

function jump() {
    if (!player.isJumping) {
        player.velocityY = -12;
        player.isJumping = true;
    }
}

function updatePlatforms() {
    // Move platforms
    for (let i = platforms.length - 1; i >= 0; i--) {
        platforms[i].x -= gameSpeed;
        
        // Remove off-screen platforms
        if (platforms[i].x + platforms[i].width < 0) {
            platforms.splice(i, 1);
        }
    }
    
    // Create new platforms
    const lastPlatform = platforms[platforms.length - 1];
    if (lastPlatform && lastPlatform.x < canvas.width) {
        createPlatform(lastPlatform.x + lastPlatform.width + 100 + Math.random() * 100, lastPlatformY);
    }
    
    // Update game speed (gradual increase)
    gameSpeed += 0.001;
}

// Game Functions
function startGame() {
    gameState = 'playing';
    score = 0;
    distance = 0;
    gameSpeed = 3;
    lastPlatformY = 300;
    initPlatforms();
    // Position player on first platform
    if (platforms.length > 0) {
        const firstPlatform = platforms[0];
        player.y = firstPlatform.y - player.height;
        player.groundY = firstPlatform.y;
    } else {
        player.y = 300;
        player.groundY = 300;
    }
    player.velocityY = 0;
    player.isJumping = false;
    
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (startScreen) startScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
}

function gameOver() {
    gameState = 'gameOver';
    const finalScoreElement = document.getElementById('finalScore');
    const finalDistanceElement = document.getElementById('finalDistance');
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    if (finalScoreElement) finalScoreElement.textContent = score;
    if (finalDistanceElement) finalDistanceElement.textContent = Math.floor(distance) + 'm';
    if (gameOverScreen) gameOverScreen.classList.remove('hidden');
}

function updateScore() {
    distance += gameSpeed * 0.1;
    score = Math.floor(distance * 10);
    const scoreElement = document.getElementById('score');
    const distanceElement = document.getElementById('distance');
    if (scoreElement) scoreElement.textContent = score;
    if (distanceElement) distanceElement.textContent = Math.floor(distance) + 'm';
}

// Game Loop
function gameLoop() {
    if (!canvas || !ctx) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Always draw background
    drawBackground();
    
    if (gameState === 'playing') {
        // Update game
        updatePlayer();
        updatePlatforms();
        updateScore();
        
        // Draw platforms
        for (let platform of platforms) {
            drawPlatform(platform);
        }
        
        // Draw player
        drawPlayer();
    } else if (gameState === 'start') {
        // Draw initial platforms and player on start screen
        for (let platform of platforms) {
            drawPlatform(platform);
        }
        drawPlayer();
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize function
function initialize() {
    console.log('=== GAME INITIALIZATION STARTED ===');
    
    try {
        // Get canvas element
        canvas = document.getElementById('gameCanvas');
        window.canvas = canvas; // Make globally accessible
        if (!canvas) {
            console.error('ERROR: Canvas element not found!');
            alert('Error: Canvas not found. Check HTML structure.');
            return;
        }
        console.log('✓ Canvas found');
        
        // Get context
        ctx = canvas.getContext('2d');
        window.ctx = ctx; // Make globally accessible
        if (!ctx) {
            console.error('ERROR: Could not get 2d context!');
            alert('Error: Could not get canvas context.');
            return;
        }
        console.log('✓ Context obtained');
        
        // Set canvas dimensions
        canvas.width = 800;
        canvas.height = 600;
        console.log('✓ Canvas dimensions set:', canvas.width, 'x', canvas.height);
        
        // Set up event listeners
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        
        if (startButton) {
            startButton.onclick = function() {
                console.log('Start button clicked');
                startGame();
            };
            console.log('✓ Start button listener attached');
        } else {
            console.error('ERROR: Start button not found!');
        }
        
        if (restartButton) {
            restartButton.onclick = function() {
                console.log('Restart button clicked');
                startGame();
            };
            console.log('✓ Restart button listener attached');
        } else {
            console.error('ERROR: Restart button not found!');
        }
        
        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            if (gameState === 'playing') {
                if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    e.preventDefault();
                    jump();
                }
            }
        });
        console.log('✓ Keyboard controls attached');
        
        // Initialize game
        initPlatforms();
        console.log('✓ Platforms initialized:', platforms.length);
        drawBackground();
        console.log('✓ Background drawn');
        gameLoop();
        console.log('✓ Game loop started');
        console.log('=== GAME INITIALIZED SUCCESSFULLY ===');
        
    } catch (error) {
        console.error('ERROR during initialization:', error);
        alert('Error initializing game: ' + error.message);
    }
}

// Multiple initialization strategies to ensure it works
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // DOM already loaded
    setTimeout(initialize, 1);
} else {
    // Wait for DOM
    document.addEventListener('DOMContentLoaded', initialize);
}

// Fallback: also try on window load
window.addEventListener('load', function() {
    if (!canvas || !ctx) {
        console.log('Retrying initialization on window load...');
        setTimeout(initialize, 100);
    }
});

