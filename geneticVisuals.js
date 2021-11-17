// const startPosition = {
//     "x" : canvas.width/4,
//     "y" : 2*canvas.height/3,
// }

// const goalPosition = {
//     "x" : 3*canvas.width/4,
//     "y" : canvas.height/3
// }

const geneNum = 100;
const gens = 50;



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

function drawPoint(position) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function setPosition() {
    canvas.addEventListener("mousedown", function (evt) {
        let pos = getMouse(evt);
    })

}


function setGoalPosition(evt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let inter = getMouse(evt);
    goalPosition.x = inter[0];
    goalPosition.y = inter[1];
    ctx.fillStyle = "black";
    drawPoint(goalPosition);
}

function setStartPosition(evt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let inter = getMouse(evt);
    startPosition.x = inter[0];
    startPosition.y = inter[1];
    ctx.fillStyle = "black";
    drawPoint(goalPosition);
    ctx.fillStyle = "grey";
    drawPoint(startPosition);
}


const average = (array) => array.reduce((a, b) => a + b) / array.length;

let startPosition = {
    "x" : canvas.width/4,
    "y" : 2*canvas.height/3,
};

let goalPosition = {
    "x" : 3*canvas.width/4,
    "y" : canvas.height/3
};


async function app() {
    let steps = Math.hypot(startPosition.x - goalPosition.x, startPosition.y - goalPosition.y);

    steps += Math.floor(steps*(.1));

    drawPoint(goalPosition);


    let nextBias = [[], []];

    for (let i = 0; i < steps; i++) {
        nextBias[0].push(.5);
        nextBias[1].push(.5);
    }

    for (let i = 0; i < gens; i++) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillText("Gen: " + (i+1), 5, 40);

        ctx.fillStyle = "black";
        drawPoint(goalPosition);

        let gen = new Generation(geneNum, startPosition, goalPosition, steps, nextBias[0], nextBias[1]);

        await gen.drawGeneration();

        await sleep(20);

        // nextBias = gen.createBias();

        nextBias = gen.createBias();

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

let interval1;
let interval2;

let update = function () {
    let count = 0;
    let next = function() {
        switch(count) {
            case 0:
                // set goal position
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                interval1 = setInterval(function () {
                    ctx.fillText("Set Goal Position", 5, 40);
                    ctx.fillText("Next Step: Set Start Position", 5, canvas.height - 40);
                    canvas.addEventListener("mousedown", setGoalPosition);
                }, 30)
                break;
            case 1:
                canvas.removeEventListener("mousedown", setGoalPosition);
                clearInterval(interval1);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawPoint(goalPosition);
                interval2 = setInterval(function () {
                    ctx.fillText("Set Start Position", 5, 40);
                    ctx.fillText("Next Step: Run Simulation", 5, canvas.height - 40);
                    canvas.addEventListener("mousedown", setStartPosition);
                }, 30)
            break;
            case 2:
            // run simulation
                canvas.removeEventListener("mousedown", setStartPosition);
                clearInterval(interval2);
                app();
            break;
        }
        count++;
    }
    return next;
}

let loadHandler = function (evt) {
    ctx.font = "30px Arial";
    let onclick = update();
    let btn = document.getElementById("setup");
    ctx.fillText("Press Button to Start Setup", 5, 40);
    btn.addEventListener("click", onclick, false);

}

// window.addEventListener("load", loadHandler)
onload = loadHandler;