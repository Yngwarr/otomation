const DIR_UP = 0;
const DIR_RIGHT = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;

class Cell {
    constructor() {
        this.revert();
    }

    revert() {
        this.soundbank = 'c-nine';
        this.direction = DIR_UP;
        this.position = { x: 0, y: 0 };
    }

    move(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    step() {
        const {x, y} = this.position;
        switch (this.direction) {
            case DIR_UP: return { x: x, y: y - 1 };
            case DIR_DOWN: return { x: x, y: y + 1 };
            case DIR_LEFT: return { x: x - 1, y: y };
            case DIR_RIGHT: return { x: x + 1, y: y };
        }
        throw `direction must be 0-3, got ${this.direction}`;
    }

    rotate() {
        this.direction = (this.direction+1) % 4;
    }
}
