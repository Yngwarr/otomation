class Pool {
    constructor(constr, size) {
        this.arr = [];
        this.constr = constr;
        // use revert function of a constr after it was freed
        this.revert = true;
        this.expand(size);
    }

    expand(n = 1) {
        for (let i = 0; i < n; ++i) {
            let el = new this.constr();
            el._in_use = false;
            this.arr.push(el);
        }
    }

    alloc() {
        return this.arr[this.alloc_n()]
    }

    alloc_n() {
        let i = 0;
        for (; i < this.arr.length && this.arr[i]._in_use; ++i);
        if (i === this.arr.length) {
            this.expand();
        }
        this.arr[i]._in_use = true;
        return i;
    }

    get(n) {
        if (!this.arr[n]) {
            throw `tried to get '${n}' of ${this.arr.length}`;
        }
        if (!this.arr[n]._in_use) {
            throw `can't get '${n}' which is not allocated (use alloc_n)`;
        }
        return this.arr[n];
    }

    free(el) {
        let i = 0;
        for (; i < this.arr.length && this.arr[i] !== el; ++i);
        if (i === this.arr.length) {
            console.warn("tried to free what's not here");
            return;
        }
        this.arr[i]._in_use = false;
        if (this.revert && this.arr[i].revert) this.arr[i].revert();
    }

    free_n(n) {
        if (!this.arr[n]) {
            console.warn(`tried to free '${n}' of ${this.arr.length}`);
            return;
        }
        this.arr[n]._in_use = false;
        if (this.revert && this.arr[n].revert) this.arr[n].revert();
    }

    for_each(callback) {
        for (let i = 0; i < this.arr.length; ++i) {
            if (!this.arr[i]._in_use) continue;
            callback(this.arr[i]);
        }
    }
}
