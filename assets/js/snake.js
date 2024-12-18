class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = 20;
        this.tileCount = 20;
        
        // Canvas grootte aanpassen aan grid
        this.canvas.width = this.tileSize * this.tileCount;
        this.canvas.height = this.tileSize * this.tileCount;
        
        // Snake initialisatie
        this.snake = [
            { x: 10, y: 10 },
        ];
        this.speed = { x: 0, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        
        // Kleuren
        this.colors = {
            snake: '#88C0D0',
            food: '#BF616A',
            background: '#2E3440',
            text: '#ECEFF4'
        };
        
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            this.handleInput(e);
        });
        
        this.gameLoop();
    }
    
    handleInput(e) {
        if (this.gameOver) {
            if (e.key === 'Enter') {
                this.resetGame();
            }
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.speed.y !== 1) {
                    this.speed = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (this.speed.y !== -1) {
                    this.speed = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (this.speed.x !== 1) {
                    this.speed = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (this.speed.x !== -1) {
                    this.speed = { x: 1, y: 0 };
                }
                break;
        }
    }
    
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }
    
    update() {
        if (this.gameOver) return;
        
        // Nieuwe positie voor slangenkop
        const newHead = {
            x: this.snake[0].x + this.speed.x,
            y: this.snake[0].y + this.speed.y
        };
        
        // Check voor game over condities
        if (
            newHead.x < 0 || 
            newHead.x >= this.tileCount ||
            newHead.y < 0 || 
            newHead.y >= this.tileCount ||
            this.snake.some(segment => 
                segment.x === newHead.x && segment.y === newHead.y)
        ) {
            this.gameOver = true;
            return;
        }
        
        // Voeg nieuwe kop toe
        this.snake.unshift(newHead);
        
        // Check voor eten
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Teken snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = this.colors.snake;
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize - 2,
                this.tileSize - 2
            );
        });
        
        // Teken voedsel
        this.ctx.fillStyle = this.colors.food;
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.tileSize + this.tileSize/2,
            this.food.y * this.tileSize + this.tileSize/2,
            this.tileSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Teken score
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                'Game Over!',
                this.canvas.width/2,
                this.canvas.height/2 - 20
            );
            this.ctx.font = '20px Arial';
            this.ctx.fillText(
                `Score: ${this.score}`,
                this.canvas.width/2,
                this.canvas.height/2 + 20
            );
            this.ctx.fillText(
                'Druk op Enter om opnieuw te spelen',
                this.canvas.width/2,
                this.canvas.height/2 + 50
            );
        }
    }
    
    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.speed = { x: 0, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
    }
    
    gameLoop() {
        this.update();
        this.draw();
        setTimeout(() => {
            requestAnimationFrame(() => this.gameLoop());
        }, 1000/10); // 10 FPS voor klassieke snake snelheid
    }
} 