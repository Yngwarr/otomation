class Board {
    constructor(side, onclick) {
        this.w = side;
        // will be filled by add_rows
        this.h = 0;
        this.onclick = onclick;
        this.elem = mk_elem('.board');
        this.add_rows(side);
    }

    add_rows(n) {
        if (n < 0) {
            console.error(`n must be > 0, got '${n}'`);
            console.info('to remove rows use rm_rows');
            return;
        }

        for (let i = 0; i < n; ++i) {
            const row = mk_elem('.row');
            for (let j = 0; j < this.w; ++j) {
                let btn = this.mk_btn();
                btn.dataset.x = j;
                btn.dataset.y = this.h + i;
                row.appendChild(btn);
            }
            this.elem.appendChild(row);
        }
        this.h += n;
    }

    add_columns(n) {
        if (n < 0) {
            console.error(`n must be > 0, got '${n}'`);
            console.info('to remove columns use rm_columns');
            return;
        }

        this.elem.querySelectorAll('.row').forEach((row, i) => {
            for (let j = 0; j < n; ++j) {
                let btn = this.mk_btn();
                btn.dataset.x = this.w + j;
                btn.dataset.y = i;
                row.appendChild(btn);
            }
        });
        this.w += n;
    }

    mk_btn() {
        let btn = mk_elem('button.empty');
        btn.innerText = '△';
        btn.addEventListener('mousedown', this.onclick);
        btn.addEventListener('contextmenu', e => e.preventDefault());
        return btn;
    }

    rm_rows(n) {
        for (let i = 0; i < n; ++i) {
            board.elem.lastElementChild.remove();
        }
        this.h -= n;
    }

    rm_columns(n) {
        let rows = this.elem.children;
        for (let i = 0; i < rows.length; ++i) {
            for (let j = 0; j < n; ++j) {
                rows[i].lastElementChild.remove();
            }
        }
        this.w -= n;
    }

    at(x, y) {
        if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
            throw `tried to get button (${x}, ${y}) on a grid with size = `
                + `(${this.w}, ${this.h})`;
        }
        return this.elem.children[y].children[x];
    }
}
