

class Obstacle {
    start;
    end;

    constructor(x1, y1, x2, y2) {
        this.start = {
            "x" : x1,
            "y" : y1
        }

        this.end = {
            "x" : x2,
            "y" : y2
        }
    }

    drawObstacle() {
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }

    equation(x) {
        return (((this.end.y - this.start.y)/(this.end.x - this.start.x)) * (x - this.start.x)) + this.start.y;
    }

    drawDot(x, y) {
        ctx.beginPath();

        ctx.arc(x, y, 2, 0, 2 * Math.PI);

        ctx.fillStyle = "black";
        ctx.fill();
    }

    checkEquation() {
        for (let i = this.start.x; i <= this.end.x; i++) {
            this.drawDot(i, this.equation(i));
        }
    }
}