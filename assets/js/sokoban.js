class Sokoban {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = 60;
        this.level = 0;
        this.moves = 0;
        
        // Game kleuren
        this.colors = {
            wall: '#3B4252',
            floor: '#2E3440',
            box: '#D08770',
            target: '#A3BE8C',
            player: '#88C0D0'
        };

        // Level ontwerpen
        this.levels = [
            [
                "WWWWWWWW",
                "W  P  TW",
                "W  B   W",
                "W      W",
                "WWWWWWWW"
            ],
            [
                "WWWWWWWWW",
                "W   W   W",
                "W B P B W",
                "W T W T W",
                "WWWWWWWWW"
            ],
            [
                "WWWWWWWWW",
                "W  T T  W",
                "W BWP B W",
                "W       W",
                "WWWWWWWWW"
            ]
        ];

        this.init();
    }

    init() {
        this.loadLevel(this.level);
        
        // Toetsenbord besturing
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) {
                if (e.key === 'Enter') {
                    this.nextLevel();
                }
                return;
            }
            
            switch(e.key) {
                case 'ArrowUp':
                    this.movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                    this.movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                    this.movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePlayer(1, 0);
                    break;
                case 'r':
                    this.loadLevel(this.level);
                    break;
            }
        });

        this.gameLoop();
    }

    loadLevel(levelNum) {
        if (levelNum >= this.levels.length) {
            this.gameComplete = true;
            return;
        }

        this.moves = 0;
        this.gameOver = false;
        this.map = [];
        this.boxes = [];
        this.targets = [];
        
        const level = this.levels[levelNum];
        
        for (let y = 0; y < level.length; y++) {
            this.map[y] = [];
            for (let x = 0; x < level[y].length; x++) {
                const char = level[y][x];
                this.map[y][x] = char === 'W' ? 'wall' : 'floor';
                
                if (char === 'B') this.boxes.push({x, y});
                if (char === 'T') this.targets.push({x, y});
                if (char === 'P') this.player = {x, y};
            }
        }

        // Canvas grootte aanpassen aan level
        this.canvas.width = level[0].length * this.tileSize;
        this.canvas.height = level.length * this.tileSize;
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        if (this.map[newY][newX] === 'wall') return;
        
        const boxIndex = this.boxes.findIndex(box => box.x === newX && box.y === newY);
        
        if (boxIndex !== -1) {
            const newBoxX = newX + dx;
            const newBoxY = newY + dy;
            
            if (this.map[newBoxY][newBoxX] === 'wall') return;
            if (this.boxes.some(box => box.x === newBoxX && box.y === newBoxY)) return;
            
            this.boxes[boxIndex].x = newBoxX;
            this.boxes[boxIndex].y = newBoxY;
        }
        
        this.player.x = newX;
        this.player.y = newY;
        this.moves++;
        
        this.checkWin();
    }

    checkWin() {
        const allBoxesOnTarget = this.targets.every(target =>
            this.boxes.some(box => box.x === target.x && box.y === target.y)
        );
        
        if (allBoxesOnTarget) {
            this.gameOver = true;
            setTimeout(() => {
                if (this.level < this.levels.length - 1) {
                    this.level++;
                    this.loadLevel(this.level);
                } else {
                    this.gameComplete = true;
                }
            }, 1000);
        }
    }

    nextLevel() {
        if (this.level < this.levels.length - 1) {
            this.level++;
            this.loadLevel(this.level);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Teken vloer en muren
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                this.ctx.fillStyle = this.colors[this.map[y][x]];
                this.ctx.fillRect(
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
        
        // Teken doelen
        this.targets.forEach(target => {
            this.ctx.fillStyle = this.colors.target;
            this.ctx.beginPath();
            this.ctx.arc(
                target.x * this.tileSize + this.tileSize/2,
                target.y * this.tileSize + this.tileSize/2,
                this.tileSize/4,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
        
        // Teken dozen
        this.boxes.forEach(box => {
            this.ctx.fillStyle = this.colors.box;
            this.ctx.fillRect(
                box.x * this.tileSize + 4,
                box.y * this.tileSize + 4,
                this.tileSize - 8,
                this.tileSize - 8
            );
        });
        
        // Teken speler
        this.ctx.fillStyle = this.colors.player;
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x * this.tileSize + this.tileSize/2,
            this.player.y * this.tileSize + this.tileSize/2,
            this.tileSize/3,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Teken score en level info
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Level: ${this.level + 1}`, 10, 25);
        this.ctx.fillText(`Zetten: ${this.moves}`, 10, 50);
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            
            if (this.gameComplete) {
                this.ctx.fillText(
                    'Gefeliciteerd! Alle levels voltooid!',
                    this.canvas.width/2,
                    this.canvas.height/2
                );
            } else {
                this.ctx.fillText(
                    'Level Voltooid!',
                    this.canvas.width/2,
                    this.canvas.height/2 - 20
                );
                this.ctx.font = '20px Arial';
                this.ctx.fillText(
                    'Druk op Enter voor het volgende level',
                    this.canvas.width/2,
                    this.canvas.height/2 + 20
                );
            }
        }
    }

    gameLoop() {
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
} 