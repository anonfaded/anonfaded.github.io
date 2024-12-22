class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fontSize = 14;
        this.drops = [];
        this.symbols = [];
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initializeDrops();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.initializeDrops();
    }

    initializeDrops() {
        this.drops = [];
        this.symbols = [];
        
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
            this.symbols[i] = [];
            this.generateSymbolColumn(i);
        }
    }

    generateSymbolColumn(column) {
        const length = Math.floor(Math.random() * 20) + 10;
        for (let i = 0; i < length; i++) {
            this.symbols[column][i] = {
                value: Math.random() > 0.9 ? 
                    String.fromCharCode(0x30A0 + Math.random() * 96) :
                    Math.round(Math.random()).toString(),
                opacity: Math.random() * 0.5 + 0.5,
                speed: Math.random() * 2 + 1
            };
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.drops.length; i++) {
            for (let j = 0; j < this.symbols[i].length; j++) {
                const symbol = this.symbols[i][j];
                const y = this.drops[i] + j * this.fontSize;
                
                if (y > this.canvas.height) continue;
                
                const alpha = Math.max(0, Math.min(1, 
                    (1 - j / this.symbols[i].length) * symbol.opacity));
                
                // First symbol in each column is brighter
                if (j === 0) {
                    this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 1.5})`;
                } else {
                    const red = Math.floor(255 * (1 - j / this.symbols[i].length));
                    this.ctx.fillStyle = `rgba(${red}, 0, 0, ${alpha})`;
                }
                
                this.ctx.font = this.fontSize + 'px monospace';
                this.ctx.fillText(
                    symbol.value,
                    i * this.fontSize,
                    y
                );

                // Randomly change symbols
                if (Math.random() < 0.002) {
                    symbol.value = Math.random() > 0.9 ? 
                        String.fromCharCode(0x30A0 + Math.random() * 96) :
                        Math.round(Math.random()).toString();
                }
            }

            this.drops[i] += this.symbols[i][0].speed;

            // Reset column when it goes off screen
            if (this.drops[i] * this.fontSize > this.canvas.height && 
                Math.random() > 0.975) {
                this.drops[i] = -this.symbols[i].length;
                this.generateSymbolColumn(i);
            }
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
