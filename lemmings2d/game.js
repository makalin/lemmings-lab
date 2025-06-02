class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.loadSounds();
    }

    loadSounds() {
        // Sound effects
        this.sounds = {
            dig: new Audio('assets/sounds/dig.mp3'),
            build: new Audio('assets/sounds/build.mp3'),
            select: new Audio('assets/sounds/select.mp3'),
            exit: new Audio('assets/sounds/exit.mp3'),
            death: new Audio('assets/sounds/death.mp3')
        };

        // Background music
        this.music = new Audio('assets/sounds/music.mp3');
        this.music.loop = true;
        this.music.volume = 0.3;
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    }

    startMusic() {
        this.music.play();
    }

    stopMusic() {
        this.music.pause();
        this.music.currentTime = 0;
    }
}

class Particle {
    constructor(x, y, color, velocity, life = 1000) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.life = life;
        this.maxLife = life;
        this.size = 2 + Math.random() * 3;
    }

    update(deltaTime) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= deltaTime;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            this.particles.push(new Particle(x, y, color, velocity));
        }
    }

    update(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            return particle.life > 0;
        });
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
}

class Level {
    constructor(data) {
        this.data = data;
        this.requiredLemmings = data.requiredLemmings || 5;
        this.timeLimit = data.timeLimit || 120;
        this.availableSkills = data.availableSkills || {
            digger: 3,
            builder: 3,
            climber: 3,
            blocker: 3
        };
    }
}

class Water {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    update(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer > 100) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw water animation
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        for (let i = 0; i < this.width; i += 20) {
            const waveHeight = Math.sin((i + this.animationFrame * 20) * 0.1) * 5;
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y + waveHeight);
            ctx.lineTo(this.x + i + 10, this.y + waveHeight + 5);
            ctx.stroke();
        }
    }
}

class Trap {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    update(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer > 200) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.animationFrame === 0 ? '#e74c3c' : '#c0392b';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw spikes
        ctx.fillStyle = '#95a5a6';
        for (let i = 0; i < this.width; i += 10) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i + 5, this.y - 10);
            ctx.lineTo(this.x + i + 10, this.y);
            ctx.fill();
        }
    }
}

class Lemming {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 2;
        this.direction = 1;
        this.skills = {
            digger: false,
            builder: false,
            climber: false,
            blocker: false
        };
        this.isBlocking = false;
        this.isClimbing = false;
        this.isDigging = false;
        this.isBuilding = false;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.reachedExit = false;
        this.isDead = false;
        this.climbHeight = 0;
        this.maxClimbHeight = 100;
    }

    update(terrain, deltaTime, soundManager, water, traps) {
        if (this.isBlocking || this.reachedExit || this.isDead) return;

        this.animationTimer += deltaTime;
        if (this.animationTimer > 100) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }

        // Check for water collision
        if (water && this.x + this.width > water.x && this.x < water.x + water.width &&
            this.y + this.height > water.y && this.y < water.y + water.height) {
            this.isDead = true;
            soundManager.play('death');
            return;
        }

        // Check for trap collision
        if (traps) {
            for (const trap of traps) {
                if (this.x + this.width > trap.x && this.x < trap.x + trap.width &&
                    this.y + this.height > trap.y && this.y < trap.y + trap.height) {
                    this.isDead = true;
                    soundManager.play('death');
                    return;
                }
            }
        }

        // Basic movement
        if (!this.isClimbing && !this.isDigging && !this.isBuilding) {
            this.x += this.speed * this.direction;
        }

        // Gravity
        if (!this.isClimbing && !this.isDigging) {
            this.y += 2;
        }

        // Climbing mechanics
        if (this.isClimbing) {
            this.climbHeight += 2;
            if (this.climbHeight >= this.maxClimbHeight) {
                this.isClimbing = false;
                this.climbHeight = 0;
            }
        }

        // Check for collisions with terrain
        this.checkCollisions(terrain, soundManager);

        // Check if reached exit
        if (this.x >= terrain.exitX - 20 && this.x <= terrain.exitX + 20 &&
            this.y >= terrain.exitY - 20 && this.y <= terrain.exitY + 20) {
            this.reachedExit = true;
            soundManager.play('exit');
        }
    }

    checkCollisions(terrain, soundManager) {
        const terrainHeight = terrain.getHeightAt(this.x);
        
        // Check if lemming is below terrain
        if (this.y + this.height > terrainHeight) {
            this.y = terrainHeight - this.height;
            
            // Start digging if digger skill is active
            if (this.skills.digger && !this.isDigging) {
                this.isDigging = true;
                soundManager.play('dig');
            }
            
            // Start building if builder skill is active
            if (this.skills.builder && !this.isBuilding) {
                this.isBuilding = true;
                soundManager.play('build');
            }

            // Start climbing if climber skill is active and there's a wall
            if (this.skills.climber && !this.isClimbing && 
                terrain.getHeightAt(this.x + this.direction * 20) > this.y + this.height) {
                this.isClimbing = true;
                this.climbHeight = 0;
            }
        }

        // Handle digging
        if (this.isDigging) {
            terrain.dig(this.x, this.y + this.height);
        }

        // Handle building
        if (this.isBuilding) {
            terrain.build(this.x, this.y + this.height);
        }

        // Check if lemming has fallen off the screen
        if (this.y > terrain.height) {
            this.isDead = true;
            soundManager.play('death');
        }
    }

    draw(ctx) {
        if (this.isDead) return;

        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.scale(this.direction, 1);

        // Draw lemming body
        ctx.fillStyle = this.isBlocking ? '#e74c3c' : '#3498db';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(-this.width/4, -this.height/4, 4, 4);

        // Draw animation
        if (!this.isBlocking) {
            ctx.fillStyle = '#2980b9';
            const legHeight = 4 + Math.sin(this.animationFrame * Math.PI/2) * 2;
            ctx.fillRect(-this.width/3, this.height/2 - legHeight, 4, legHeight);
            ctx.fillRect(this.width/3, this.height/2 - legHeight, 4, legHeight);
        }

        ctx.restore();
    }
}

class Terrain {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.heights = new Array(width).fill(height - 100);
        this.exitX = width - 100;
        this.exitY = height - 150;
        this.generateTerrain();
    }

    generateTerrain() {
        // Generate some random terrain features
        for (let x = 0; x < this.width; x++) {
            // Base terrain
            this.heights[x] = this.height - 100 + Math.sin(x * 0.02) * 20;
            
            // Add some random hills
            if (Math.random() < 0.01) {
                const hillHeight = 30 + Math.random() * 50;
                const hillWidth = 50 + Math.random() * 100;
                for (let i = 0; i < hillWidth; i++) {
                    if (x + i < this.width) {
                        this.heights[x + i] = Math.min(
                            this.heights[x + i],
                            this.height - 100 - hillHeight * Math.sin((i / hillWidth) * Math.PI)
                        );
                    }
                }
            }
        }

        // Create path to exit
        const pathWidth = 40;
        for (let x = this.exitX - 200; x < this.exitX; x++) {
            if (x >= 0 && x < this.width) {
                this.heights[x] = this.exitY;
            }
        }
    }

    getHeightAt(x) {
        const index = Math.floor(x);
        return this.heights[index] || this.height;
    }

    dig(x, y) {
        const index = Math.floor(x);
        if (index >= 0 && index < this.width) {
            this.heights[index] = Math.min(this.heights[index] + 2, this.height);
        }
    }

    build(x, y) {
        const index = Math.floor(x);
        if (index >= 0 && index < this.width) {
            this.heights[index] = Math.max(this.heights[index] - 2, 0);
        }
    }

    draw(ctx) {
        // Draw terrain
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(0, this.height);
        
        for (let x = 0; x < this.width; x++) {
            ctx.lineTo(x, this.heights[x]);
        }
        
        ctx.lineTo(this.width, this.height);
        ctx.closePath();
        ctx.fill();

        // Draw exit
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(this.exitX, this.exitY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.terrain = new Terrain(this.canvas.width, this.canvas.height);
        this.lemmings = [];
        this.selectedLemming = null;
        this.spawnTimer = 0;
        this.spawnInterval = 2000;
        this.lastTime = 0;
        this.soundManager = new SoundManager();
        this.lemmingsSaved = 0;
        this.lemmingsLost = 0;
        this.particleSystem = new ParticleSystem();
        this.currentLevel = 1;
        this.gameState = 'playing'; // playing, paused, gameOver
        this.water = new Water(400, 400, 100, 50);
        this.traps = [
            new Trap(300, 300, 50, 20),
            new Trap(500, 200, 50, 20)
        ];
        this.levels = this.loadLevels();
        this.timeRemaining = this.levels[this.currentLevel - 1].timeLimit;
        this.availableSkills = { ...this.levels[this.currentLevel - 1].availableSkills };

        this.setupEventListeners();
        this.soundManager.startMusic();
    }

    loadLevels() {
        return [
            new Level({
                requiredLemmings: 5,
                timeLimit: 120,
                availableSkills: {
                    digger: 3,
                    builder: 3,
                    climber: 3,
                    blocker: 3
                }
            }),
            new Level({
                requiredLemmings: 8,
                timeLimit: 180,
                availableSkills: {
                    digger: 4,
                    builder: 4,
                    climber: 4,
                    blocker: 4
                }
            }),
            new Level({
                requiredLemmings: 12,
                timeLimit: 240,
                availableSkills: {
                    digger: 5,
                    builder: 5,
                    climber: 5,
                    blocker: 5
                }
            })
        ];
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;

            if (e.key === 'Escape') {
                this.gameState = this.gameState === 'playing' ? 'paused' : 'playing';
                return;
            }

            if (!this.selectedLemming) return;

            const skill = e.key.toLowerCase();
            if (this.availableSkills[skill] > 0) {
                switch(skill) {
                    case 'd':
                        this.selectedLemming.skills.digger = true;
                        this.availableSkills.digger--;
                        break;
                    case 'b':
                        this.selectedLemming.skills.builder = true;
                        this.availableSkills.builder--;
                        break;
                    case 'c':
                        this.selectedLemming.skills.climber = true;
                        this.availableSkills.climber--;
                        break;
                    case 'x':
                        this.selectedLemming.skills.blocker = true;
                        this.selectedLemming.isBlocking = true;
                        this.availableSkills.blocker--;
                        break;
                }
                this.soundManager.play('select');
            }
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.gameState !== 'playing') return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.selectedLemming = this.lemmings.find(lemming => 
                x >= lemming.x && x <= lemming.x + lemming.width &&
                y >= lemming.y && y <= lemming.y + lemming.height
            );

            if (this.selectedLemming) {
                this.soundManager.play('select');
            }
        });
    }

    spawnLemming() {
        const lemming = new Lemming(50, 0);
        this.lemmings.push(lemming);
    }

    update(deltaTime) {
        if (this.gameState !== 'playing') return;

        this.timeRemaining -= deltaTime / 1000;
        if (this.timeRemaining <= 0) {
            this.gameState = 'gameOver';
            return;
        }

        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnLemming();
            this.spawnTimer = 0;
        }

        this.water.update(deltaTime);
        this.traps.forEach(trap => trap.update(deltaTime));

        this.lemmings.forEach(lemming => {
            lemming.update(this.terrain, deltaTime, this.soundManager, this.water, this.traps);
            if (lemming.reachedExit) {
                this.lemmingsSaved++;
                this.particleSystem.emit(lemming.x, lemming.y, 'rgb(241, 196, 15)');
            }
            if (lemming.isDead) {
                this.lemmingsLost++;
                this.particleSystem.emit(lemming.x, lemming.y, 'rgb(231, 76, 60)');
            }
        });

        this.particleSystem.update(deltaTime);

        // Remove lemmings that have reached the exit or died
        this.lemmings = this.lemmings.filter(lemming => 
            !lemming.reachedExit && !lemming.isDead
        );

        // Check level completion
        if (this.lemmingsSaved >= this.levels[this.currentLevel - 1].requiredLemmings) {
            this.currentLevel++;
            if (this.currentLevel > this.levels.length) {
                this.gameState = 'gameOver';
            } else {
                this.resetLevel();
            }
        }
    }

    resetLevel() {
        this.terrain = new Terrain(this.canvas.width, this.canvas.height);
        this.lemmings = [];
        this.selectedLemming = null;
        this.timeRemaining = this.levels[this.currentLevel - 1].timeLimit;
        this.availableSkills = { ...this.levels[this.currentLevel - 1].availableSkills };
        this.lemmingsSaved = 0;
        this.lemmingsLost = 0;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.terrain.draw(this.ctx);
        this.water.draw(this.ctx);
        this.traps.forEach(trap => trap.draw(this.ctx));
        
        this.lemmings.forEach(lemming => {
            lemming.draw(this.ctx);
        });

        this.particleSystem.draw(this.ctx);

        if (this.selectedLemming) {
            this.ctx.strokeStyle = '#f1c40f';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.selectedLemming.x - 2,
                this.selectedLemming.y - 2,
                this.selectedLemming.width + 4,
                this.selectedLemming.height + 4
            );
        }

        // Draw UI
        this.drawUI();

        // Draw pause/game over screen
        if (this.gameState !== 'playing') {
            this.drawGameState();
        }
    }

    drawUI() {
        // Draw stats
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Level: ${this.currentLevel}`, 20, 30);
        this.ctx.fillText(`Saved: ${this.lemmingsSaved}/${this.levels[this.currentLevel - 1].requiredLemmings}`, 20, 60);
        this.ctx.fillText(`Lost: ${this.lemmingsLost}`, 20, 90);
        this.ctx.fillText(`Time: ${Math.ceil(this.timeRemaining)}s`, 20, 120);

        // Draw available skills
        const skills = [
            { key: 'D', name: 'Digger', count: this.availableSkills.digger },
            { key: 'B', name: 'Builder', count: this.availableSkills.builder },
            { key: 'C', name: 'Climber', count: this.availableSkills.climber },
            { key: 'X', name: 'Blocker', count: this.availableSkills.blocker }
        ];

        let x = this.canvas.width - 200;
        skills.forEach((skill, i) => {
            this.ctx.fillText(`${skill.key}: ${skill.name} (${skill.count})`, x, 30 + i * 30);
        });
    }

    drawGameState() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        
        if (this.gameState === 'paused') {
            this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Press ESC to resume', this.canvas.width/2, this.canvas.height/2 + 40);
        } else if (this.gameState === 'gameOver') {
            if (this.currentLevel > this.levels.length) {
                this.ctx.fillText('YOU WIN!', this.canvas.width/2, this.canvas.height/2);
            } else {
                this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
            }
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Press F5 to restart', this.canvas.width/2, this.canvas.height/2 + 40);
        }
        
        this.ctx.textAlign = 'left';
    }

    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    start() {
        this.gameLoop(0);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
    game.start();
}); 