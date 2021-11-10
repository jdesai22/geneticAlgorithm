const startPosition = {
    "x" : 3*canvas.width/4,
    "y" : canvas.height/3,
}

const goalPosition = {
    "x" : canvas.width/4,
    "y" : canvas.height/3
}

const geneNum = 150;
const gens = 40;

let steps = Math.hypot(startPosition.x - goalPosition.x, startPosition.y - goalPosition.y);

steps += Math.floor(steps*(.1));

function getMouse(evt) {
    let bRect = canvas.getBoundingClientRect();
    let mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
    let mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
    return [mouseX, mouseY];
}

// function minSteps() {
//     let min = Math.hypot(startPosition.x - goalPosition.x, startPosition.y - goalPosition.y)
//     if (steps < min) {
//         steps = min;
//     }
//     console.log(steps);
// }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawGoal() {
    ctx.beginPath();
    ctx.arc(goalPosition.x, goalPosition.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}


const average = (array) => array.reduce((a, b) => a + b) / array.length;

async function app() {

    ctx.font = "30px Arial";

    drawGoal();

    // console.log(steps);
    //
    // let gen1 = new Generation(geneNum, startPosition, goalPosition, steps);
    //
    // await gen1.drawGeneration();

    let nextBias = [[], []];

    for (let i = 0; i < steps; i++) {
        nextBias[0].push(.5);
        nextBias[1].push(.5);
    }

    let initBias = nextBias;

    for (let i = 0; i < gens; i++) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillText("Gen: " + i, 5, 40);

        drawGoal();

        let gen = new Generation(geneNum, startPosition, goalPosition, steps, nextBias[0], nextBias[1]);

        await gen.drawGeneration();

        await sleep(20);

        nextBias = gen.createBias();

        console.log(average(nextBias[1]));

        // let moveRight = 0;
        // let moveDown = 0;
        //
        //
        // for (let i = 0; i < steps; i++) {
        //     if (nextBias[0][i] < .5) {
        //         moveRight++;
        //     }
        //     if (nextBias[1][i] < .5) {
        //         moveDown++;
        //     }
        // }
        //
        // console.log(moveRight + "       " + moveDown);
        //
        // console.log(average(nextBias[0]));

    }



}

let loadHandler = function (evt) {
    app();
}

window.addEventListener("load", loadHandler)