const TOTAL = 100



class neatModel {
    constructor(step) {
        this.neat = new Neat(
            step,
            2,

        )
    }

    fitness(final, initial) {
        return Math.hypot(final[1] - this.posX, this.goal.y - this.posY);

    }

}