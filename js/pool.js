class Pool {
    constructor(constr, size) {
        this.arr = [];
        this.constr = constr;
        this.expand(size);
    }

    expand(n = 1) {
        for (let i = 0; i < n; ++i) {
            let el = new this.constr();
            el._in_use = false;
            this.arr.push(el);
        }
    }

    get() {
        let i = 0;
        for (; i < this.arr.length && this.arr[i]._in_use; ++i);
        if (i === this.arr.length) {
            this.expand();
        }
        this.arr[i]._in_use = true;
        return this.arr[i];
    }

    rm(el) {
        let i = 0;
        for (; i < this.arr.length && this.arr[i] !== el; ++i);
        if (i === this.arr.length) {
            console.warn("tried to remove what's not here");
            return;
        }
        this.arr[i]._in_use = false;
    }
}
