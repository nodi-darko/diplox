import { getColorFromNumber } from "./utils";

export class Res {

    constructor(resId, x, y, t, a) {
        this.posx = x
        this.posy = y;
        this.type = t;
        this.amount = a;

        this.width = 20;
        this.height = 20;
        this.id = resId;
        this.color = getColorFromNumber(t);
        this.open = true;
    }
  
    // Simple class instance methods using short-hand method
    // declaration
    sayName() {
        console.log('Hi , I m a ', this.name + '.');
    }
  
    sayHistory() {
        console.log('"Polyg on" is der ived from the Greek polus (many) ' +
        'and gonia (angle).');
    }
    // We will look at static and subclassed methods shortly
}

