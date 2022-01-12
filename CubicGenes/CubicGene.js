
const obstacleRange = 2;

class CubicGene {

    constructor(startPosition, goalPosition, obstacle) {
        this.positions = [];

        this.posX = startPosition.x;
        this.posY = startPosition.y;

        this.obstacle = obstacle;
        this.goal = goalPosition;

        this.fillColor = `rgba(${Math.random()*256},${Math.random()*256},${Math.random()*256},.2)`;
    }

    fitness() {
        return Math.hypot(this.goal.x - this.posX, this.goal.y - this.posY);
    }

    xFitness() {
        let extra = this.penalties();

        if (extra > 0) {
            let distFromLine = Math.abs(this.distToSegment({x:this.posX, y:this.posY}, this.obstacle.start, this.obstacle.end));
            extra = extra - distFromLine;
            if (extra < 0) {
                extra = 0
            }
        }

        // return Math.abs(this.goal.x - this.posX) + extra;
        return this.computeFinalFitness(Math.abs(this.goal.x - this.posX), extra);
    }

    yFitness() {
        let extra = this.penalties();

        if (extra > 0) {
            let distFromLine = Math.abs(this.distToSegment({x:this.posX, y:this.posY}, this.obstacle.start, this.obstacle.end));
            extra = extra - distFromLine;
            if (extra < 0) {
                extra = 0
            }
        }

        // return Math.abs(this.goal.y - this.posY) + extra;
        return this.computeFinalFitness(Math.abs(this.goal.y - this.posY), extra);
    }

    computeFinalFitness(basicDist, extra) {
        const bonusAtGoal = 50;

        if (basicDist === 0) {
            return basicDist + extra - bonusAtGoal;
        } else {
             return basicDist + extra;
        }
    }

    penalties() {
        let stepCalc = Math.floor(Math.hypot(startPosition.x - goalPosition.x, startPosition.y - goalPosition.y));

        if (this.intersects()) {
            return stepCalc/2;
        } else {
            return -stepCalc;
        }
    }

    // Return minimum distance between line segment vw and point p
    sqr(x) { return x * x }
    dist2(v, w) { return this.sqr(v.x - w.x) + this.sqr(v.y - w.y) }
    distToSegmentSquared(p, v, w) {
        let l2 = this.dist2(v, w);
        if (l2 === 0) return this.dist2(p, v);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return this.dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
    }
    distToSegment(p, v, w) { return Math.sqrt(this.distToSegmentSquared(p, v, w)); }

    // checking if two lines intersect from: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    intersects() {
          let det, gamma, lambda;

          let a = this.posX;
          let b = this.posY;
          let c = this.goal.x;
          let d = this.goal.y;
          let p = this.obstacle.start.x;
          let q = this.obstacle.start.y;
          let r = this.obstacle.end.x;
          let s = this.obstacle.end.y;

          det = (c - a) * (s - q) - (r - p) * (d - b);
          if (det === 0) {
            return false;
          } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
          }
    };

    updatePosition(overallBias) {
        if (!this.atBorder() && !this.atObstacle()) {
            let delta = this.biasMoveXY(overallBias);
            this.positions.push([delta[0] + this.posX, delta[1] + this.posY]);

            this.posX += delta[0];
            this.posY += delta[1];
        } else {
            this.positions.push([this.posX, this.posY]);
        }
    }


    randMove() {
        let rand = Math.random();

        if (rand >= .5) {
            return 1;
        } else {
            return -1;
        }
    }

    biasMove(bias) {
        let rand = Math.random();

        if (rand >= bias) {
            return -1;
        } else {
            return 1;
        }
    }

    biasMoveXY(bias) {
        let randx = Math.random();
        let randy = Math.random();

        let xyBias = this.genXYBias(bias);

        let move = []

        if (randx >= xyBias[0]) {
            move.push(-1);
        } else {
            move.push(1);
        }

        if (randy >= xyBias[1]) {
            move.push(-1);
        } else {
            move.push(1);
        }

        return move;
    }

    genXYBias(bias) {
        let slope = 3*bias[0]*Math.pow(this.posX, 2) + 2*bias[1]*this.posX + bias[2]*this.posX;

        if (slope >= 0) {
            if (slope >= 1) {
                return [1/slope, 1];
            } else {
                return [1, slope];
            }
        } else {
            if (slope <= -1) {
                return [1/slope, 1];
            } else {
                return [1, slope];
            }
        }


    }


    drawGene() {
        ctx.beginPath();

        ctx.arc(this.posX, this.posY, radius, 0, 2 * Math.PI);

        ctx.fillStyle = this.fillColor;
        ctx.fill();
    }

    atBorder() {
        return this.posX < 0 || this.posX > canvas.width || this.posY < 0 || this.posY > canvas.height;
    }

    atObstacle() {
        if (this.obstacle.start.x === this.obstacle.end.x) {
            let verticalCheck = this.posY < this.obstacle.end.y + obstacleRange && this.posY > this.obstacle.start.y - obstacleRange;

            return Math.abs(this.posX - this.obstacle.start.x) <= obstacleRange && verticalCheck;
        } else {
            let predY = this.obstacle.equation(this.posX, this.posY);
            return Math.abs(predY - this.posY) <= obstacleRange;
        }


    }
}