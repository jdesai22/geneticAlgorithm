
class CubicGeneration {


    constructor(geneNum, startPosition, goalPosition, steps, bias, obstacle) {
        this.geneNum = geneNum;
        this.startPos = startPosition;
        this.goalPos = goalPosition;
        this.steps = steps;
        this.bias = bias;

        this.genes = [];
        for (let i = 0; i < this.geneNum; i++) {
            // this.genes.push(new EquationGene(this.startPos, this.goalPos, obstacle));
            this.genes.push(new EquationGene(this.startPos, this.goalPos, obstacle));
        }
    }


    async drawGeneration() {

        for (let i = 0; i < this.steps; i++) {
            for (let j = 0; j < this.geneNum; j++) {
                this.genes[j].updatePosition(this.biasX[i], this.biasY[i]);

                this.genes[j].drawGene();

                // await sleep(20);
            }

        }
    }

    // async drawGenes() {
    //     for (let j = 0; j < this.geneNum; j++) {
    //         this.genes[j].updatePosition();
    //         this.genes[j].drawGene();
    //
    //         // await sleep(20);
    //     }
    // }

    // make weights individualized for each move
    createBias() {


        let rankingsX = [];
        let rankingsY = [];

        let finalFitnessX = [];
        let finalFitnessY = [];

        let sortedFitnessX = [];
        let sortedFitnessY = [];

        let coeff = [];


        for (let i = 0; i < this.geneNum; i++) {
            finalFitnessX.push(this.genes[i].xFitness());
            sortedFitnessX.push(this.genes[i].xFitness());

            finalFitnessY.push(this.genes[i].yFitness());
            sortedFitnessY.push(this.genes[i].yFitness());

            coeff.push(regression.polynomial(this.genes[i].positions, { order: 3 }));
        }

        // orders from smallest to largest
        sortedFitnessX = sortedFitnessX.sort(function(a, b) {return a - b;});
        sortedFitnessY = sortedFitnessY.sort(function(a, b) {return a - b;});

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

        for (let i = 0; i < this.geneNum; i++) {
            rankingsX[i] = 1 - rankingsX[i]/(this.geneNum-1);
            rankingsY[i] = 1 - rankingsY[i]/(this.geneNum-1);
        }

        let newCoeffs = [];

        for (let i = 0; i < this.steps; i++) {
            let sumCoeffX = 0;
            let sumCoeffY = 0;


            for (let j = 0; j < this.geneNum; j++) {
                sumCoeffX += rankingsX[j] * this.genes[j].geneMoves[i][0];
                sumCoeffY += rankingsY[j] * this.genes[j].geneMoves[i][1];
            }

            let newBiasX = sumCoeffX/(this.geneNum);
            let newBiasY = sumCoeffY/(this.geneNum);

            newCoeffs.push((newBiasX + newBiasY)/2);
        }


        return [xBiases, yBiases];
    }


    // capScale(num) {
    //     let newNum = 1 * num;
    //
    //     if (newNum > .5) {
    //         return .5;
    //     } else if (newNum < -.5) {
    //         return -.5;
    //     } else {
    //         return newNum;
    //     }
    // }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


}