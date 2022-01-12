



class ComplexGeneration {


    constructor(geneNum, startPosition, goalPosition, steps, biasX, biasY, obstacle) {
        this.geneNum = geneNum;
        this.startPos = startPosition;
        this.goalPos = goalPosition;
        this.steps = steps;
        this.biasX = biasX;
        this.biasY = biasY;

        // number of best genes to take
        this.topEvolve = 20;


        this.genes = [];
        for (let i = 0; i < this.geneNum; i++) {
            // this.genes.push(new EquationGene(this.startPos, this.goalPos, obstacle));
            this.genes.push(new EquationGene(this.startPos, this.goalPos, obstacle));
        }
    }


    async drawGeneration() {

        for (let i = 0; i < this.steps; i++) {
            for (let j = 0; j < this.geneNum; j++) {
                // this.genes[j].updatePosition(this.biasX[i], this.biasY[i]);
                this.genes[j].updatePosition(this.biasX[i], this.biasY[i]);

                this.genes[j].drawGene();

                // await sleep(20);
            }

        }
    }


    // make weights individualized for each move
    createBias() {


        let rankingsX = [];
        let rankingsY = [];

        let finalFitnessX = [];
        let finalFitnessY = [];

        let sortedFitnessX = [];
        let sortedFitnessY = [];


        for (let i = 0; i < this.geneNum; i++) {
            finalFitnessX.push(this.genes[i].xFitness());
            sortedFitnessX.push(this.genes[i].xFitness());

            finalFitnessY.push(this.genes[i].yFitness());
            sortedFitnessY.push(this.genes[i].yFitness());
        }

        // orders from smallest to largest
        sortedFitnessX = sortedFitnessX.sort(function(a, b) {return a - b;});
        sortedFitnessY = sortedFitnessY.sort(function(a, b) {return a - b;});

        let selectedFitnessX = sortedFitnessX.slice(-this.topEvolve);
        let selectedFitnessY = sortedFitnessY.slice(-this.topEvolve);

        let updateRankingsX = []
        let updateRankingsY = []


        for (let i = this.geneNum - this.topEvolve; i < this.geneNum; i++) {
            for (let j = 0; j < this.topEvolve; j++) {
                if (finalFitnessX[i] === selectedFitnessX[j]) {
                    updateRankingsX.push(j);
                    break;
                }
            }

            for (let j = 0; j < this.topEvolve; j++) {
                if (finalFitnessY[i] === selectedFitnessY[j]) {
                    updateRankingsY.push(j);
                    break;
                }
            }
        }

        for (let i = 0; i < this.geneNum; i++) {
            for (let j = 0; j < this.geneNum; j++) {
                if (finalFitnessX[i] === sortedFitnessX[j]) {
                    rankingsX.push(j);
                    break;
                }
            }

            for (let j = 0; j < this.geneNum; j++) {
                if (finalFitnessY[i] === sortedFitnessY[j]) {
                    rankingsY.push(j);
                    break;
                }
            }
        }

        let smallerRankingsXIndex = []
        let smallerRankingsYIndex = []

        let count = 0;

        for (let i = 0; i < this.geneNum; i++) {
            if (count > this.topEvolve) {
                break;
            }

            if (rankingsX[i] < this.topEvolve) {
                smallerRankingsXIndex.push(i);
            }

            count++;
        }

        count = 0;

        for (let i = 0; i < this.geneNum; i++) {
            if (count > this.topEvolve) {
                break;
            }

            if (rankingsY[i] < this.topEvolve) {
                smallerRankingsYIndex.push(i);
            }

            count++;
        }

        // need to do if statement to see if the ranking is less than topEvolve or do it after some calculation
        // w/geneNum after the next for loop


        // bug for later: sometimes same rankings. ex [0, 1, 1, 3, 4]

        // console.log(rankingsY);

        for (let i = 0; i < this.topEvolve; i++) {
            updateRankingsX[i] = 1 - updateRankingsX[i]/(this.topEvolve-1);
            updateRankingsY[i] = 1 - updateRankingsY[i]/(this.topEvolve-1);
        }

        let xBiases = [];
        let yBiases = [];

        console.log(updateRankingsX);
        console.log(smallerRankingsXIndex);

        for (let i = 0; i < this.steps; i++) {
            let sumMovesX = 0;
            let sumMovesY = 0;


            for (let j = 0; j < this.topEvolve; j++) {
                let indexX = smallerRankingsXIndex[j];
                let indexY = smallerRankingsYIndex[j];
                sumMovesX += updateRankingsX[j] * this.genes[j].geneMoves[indexX][0];
                // sumMovesY += updateRankingsY[j] * this.genes[j].geneMoves[indexY][1];
                sumMovesY += updateRankingsY[j] * this.genes[j].geneMoves[i][1];
            }

            let newBiasX = .5 + this.capScale(sumMovesX/(this.topEvolve));
            let newBiasY = .5 + this.capScale(sumMovesY/(this.topEvolve));

            xBiases.push(newBiasX);
            yBiases.push(newBiasY);

        }


        return [xBiases, yBiases];

    }

    capScale(num) {
        let newNum = 1 * num;

        if (newNum > .5) {
            return .5;
        } else if (newNum < -.5) {
            return -.5;
        } else {
            return newNum;
        }
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


}