let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

const radius = 10;

class ConstantGene {

    constructor(startPosition, goalPosition) {
        this.geneMoves = [];

        this.posX = startPosition.x;
        this.posY = startPosition.y;


        this.goal = goalPosition;

        this.fillColor = `rgba(${Math.random()*256},${Math.random()*256},${Math.random()*256},.2)`;
    }

    fitness() {
        return Math.hypot(this.goal.x - this.posX, this.goal.y - this.posY);
    }

    xFitness() {
        return Math.abs(this.goal.x - this.posX);
    }

    yFitness() {
        return Math.abs(this.goal.y - this.posY);
    }

    updatePosition(xBias, yBias) {
        if (!this.atBorder()) {
            let newGene = [this.biasMove(xBias), this.biasMove(yBias)];
            this.geneMoves.push(newGene);

            this.posX += newGene[0];
            this.posY += newGene[1];
        }
    }

    /*
        later - create a bias move
            so that there is an element for each gene based on results of previous generation
            this will give bias to one move over another

            find ratio between successful and unsuccessful and their genes

            bias has range 0 to 1 - percentage that are closer to 1

     */

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


    drawGene() {
        ctx.beginPath();

        ctx.arc(this.posX, this.posY, radius, 0, 2 * Math.PI);

        ctx.fillStyle = this.fillColor;
        ctx.fill();
    }

    atBorder() {
        return this.posX < 0 || this.posX > canvas.width || this.posY < 0 || this.posY > canvas.height;
    }
}