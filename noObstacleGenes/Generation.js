
class Generation {


    constructor(geneNum, startPosition, goalPosition, steps, biasX, biasY) {
        this.geneNum = geneNum;
        this.startPos = startPosition;
        this.goalPos = goalPosition;
        this.steps = steps;
        this.biasX = biasX;
        this.biasY = biasY;

        this.genes = [];
        for (let i = 0; i < this.geneNum; i++) {
            this.genes.push(new ConstantGene(this.startPos, this.goalPos));
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



        for (let i = 0; i < this.geneNum; i++) {
            finalFitnessX.push(this.genes[i].xFitness());
            sortedFitnessX.push(this.genes[i].xFitness());

            finalFitnessY.push(this.genes[i].yFitness());
            sortedFitnessY.push(this.genes[i].yFitness());
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

        // bug for later: sometimes same rankings. ex [0, 1, 1, 3, 4]

        // console.log(rankingsY);

        for (let i = 0; i < this.geneNum; i++) {
            rankingsX[i] = 1 - rankingsX[i]/(this.geneNum-1);
            rankingsY[i] = 1 - rankingsY[i]/(this.geneNum-1);
        }

        // console.log(finalFitnessY);

        let xBiases = [];
        let yBiases = [];

        for (let i = 0; i < this.steps; i++) {
            let sumMovesX = 0;
            let sumMovesY = 0;


            for (let j = 0; j < this.geneNum; j++) {
                sumMovesX += rankingsX[j] * this.genes[j].geneMoves[i][0];
                sumMovesY += rankingsY[j] * this.genes[j].geneMoves[i][1];
            }

            let newBiasX = .5 + this.capScale(sumMovesX/(this.geneNum));
            let newBiasY = .5 + this.capScale(sumMovesY/(this.geneNum));

            xBiases.push(newBiasX);
            yBiases.push(newBiasY);

        }


        return [xBiases, yBiases];

    }


    // biasOneD(axis) {
    //     let rankingsX = [];
    //     let finalFitnessX = [];
    //     let sortedFitnessX = [];
    //
    //
    //     if (axis === 0) {
    //         for (let i = 0; i < this.geneNum; i++) {
    //             finalFitnessX.push(this.genes[i].xFitness());
    //             sortedFitnessX.push(this.genes[i].xFitness());
    //         }
    //     } else if (axis === 1) {
    //         for (let i = 0; i < this.geneNum; i++) {
    //             finalFitnessX.push(this.genes[i].yFitness());
    //             sortedFitnessX.push(this.genes[i].yFitness());
    //         }
    //     }
    //
    //
    //
    //     sortedFitnessX = sortedFitnessX.sort(function(a, b) {return a - b;});
    //
    //
    //     for (let i = 0; i < this.geneNum; i++) {
    //         for (let j = 0; j < this.geneNum; j++) {
    //             if (finalFitnessX[i] === sortedFitnessX[j]) {
    //                 rankingsX.push(j);
    //                 break;
    //             }
    //         }
    //     }
    //
    //     for (let i = 0; i < this.geneNum; i++) {
    //         rankingsX[i] = 1 - rankingsX[i]/(this.geneNum-1);
    //     }
    //
    //
    //     let xBiases = [];
    //
    //     for (let i = 0; i < this.steps; i++) {
    //         let sumMovesX = 0;
    //
    //
    //         for (let j = 0; j < this.geneNum; j++) {
    //             sumMovesX += rankingsX[j] * this.genes[j].geneMoves[i][axis];
    //         }
    //
    //         let newBiasX = .5 + this.capScale(sumMovesX/(this.geneNum));
    //
    //         xBiases.push(newBiasX);
    //     }
    //
    //     return xBiases;
    //
    // }

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