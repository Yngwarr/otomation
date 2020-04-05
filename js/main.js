const btn_click = pool => e => {
    const btn = e.target;

    if (e.which === 1) {
        if (btn.classList.contains('empty')) {
            btn.classList.remove('empty');

            const cell_n = pool.alloc_n();
            let cell = pool.get(cell_n);
            cell.position.x = parseInt(btn.dataset.x, 10);
            cell.position.y = parseInt(btn.dataset.y, 10);

            btn.dataset.cell = `${cell_n}`;
            draw_cell(btn, cell)
        } else {
            const cell_n = parseInt(btn.dataset.cell, 10);
            let cell = pool.get(cell_n);
            cell.rotate();
            draw_cell(btn, cell);
        }
    } else if (e.which === 3) {
        if (!btn.classList.contains('empty')) {
            const cell_n = parseInt(btn.dataset.cell, 10);
            pool.free_n(cell_n);
            btn.classList.add('empty');
        }
    }
}

function draw_cell(btn, cell) {
    let txt;
    switch (cell.direction) {
        case DIR_UP: txt = '△'; break;
        case DIR_DOWN: txt = '▽'; break;
        case DIR_LEFT: txt = '◁'; break;
        case DIR_RIGHT: txt = '▷'; break;
        // TODO what about intersections?
    }
    btn.innerText = txt;
}

function find_overlaps(pool) {
    let ops = {};
    pool.for_each((cell, i) => {
        const key = [cell.position.x, cell.position.y].toString();
        if (ops[key]) {
            ops[key].push(i);
        } else {
            ops[key] = [i];
        }
    });
    let res = [];
    for (let i in ops) {
        if (ops[i].length === 1) continue;
        res.push(ops[i]);
    }
    return res;
}

function step(pool, board, player) {
    // resolve overlapping
    const ops = find_overlaps(pool);
    ops.forEach(op => {
        op.forEach(x => pool.get(x).rotate());
    });
    // change positions & make sounds
    pool.for_each(cell => {
        let {x, y} = cell.step();
        // TODO play some animation
        if (x < 0 || x >= board.w) {
            // TODO sound player
            //cell.play_sound(player, y+1);
            cell.turn_around()
            const {x: _x, y: _y} = cell.step();
            x = _x; y = _y;
        } else if (y < 0 || y >= board.h) {
            //cell.play_sound(player, x+1);
            cell.turn_around()
            const {x: _x, y: _y} = cell.step();
            x = _x; y = _y;
        }
        const {x: _x, y: _y} = cell.position;
        let _btn = board.at(_x, _y);
        _btn.classList.add('empty');
        _btn.dataset.cell = undefined;
        cell.move(x, y);
    });
    // redraw grid
    pool.for_each(cell => {
        const {x, y} = cell.position;
        let btn = board.at(x, y);

        if (btn.classList.contains('empty')) {
            btn.classList.remove('empty');
            draw_cell(btn, cell);
        } else {
            // TODO draw a circle
        }
    });
}

let board;
let pool;
let aplayer;

let timerid;

function start_timer() {
    timerid = setInterval(step, 400, pool, board, aplayer);
}

function stop_timer() {
    clearInterval(timerid);
}

async function init() {
    aplayer = new AudioPlayer();
    document.querySelector('#start').addEventListener('click', e => {
        aplayer.ctx.resume().then(() => console.log('audio initialized'));
        aplayer.load_audio(aplayer.ctx, 'sound/jingle.wav').then(res => {
            const src = aplayer.ctx.createBufferSource();
            src.buffer = res;
            src.connect(aplayer.ctx.destination);
            src.start(0);
            e.target.remove();
        });
        start_timer();
    });

    const sounds = await aplayer.load_instr('c-nine');
    pool = new Pool(Cell, 10);
    board = new Board(9, btn_click(pool));
    document.getElementById('wrapper').appendChild(board.elem);
}
