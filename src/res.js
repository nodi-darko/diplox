import { getColorFromNumber } from "./utils";

export class Res {

    constructor(resId, x, y, t = 0, a = 1000) {
        this.posx = x
        this.posy = y;
        this.type = t;
        this.amount = a;

        this.width = 20;
        this.height = 20;
        this.id = resId;
        this.color = getColorFromNumber(t);
        this.open = true;
        this.level = 0;
    }

    // We will look at static and subclassed methods shortly
}

