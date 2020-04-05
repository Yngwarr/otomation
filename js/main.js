const SCALE_SIZE = 9;

async function load_blob(url) {
    const response = await fetch(url);
    if (response.status !== 200) throw Error(response.status);
    const blob = await response.arrayBuffer();
    return blob;
}

async function load_audio(ctx, url) {
    return await ctx.decodeAudioData(await load_blob(url));
}

async function load_scale(ctx, name) {
    let bufs = Array.apply(null, { length: SCALE_SIZE });
    for (let i = 1; i <= SCALE_SIZE; ++i) {
        bufs[i-1] = await load_audio(ctx, `sound/${name}/${i}.wav`);
    }
    const sounds = bufs.map(x => {
        const src = ctx.createBufferSource();
        src.buffer = x;
        src.connect(ctx.destination);
        return src;
    });
    return sounds;
}

const btn_click = pool => e => {
    const btn = e.target;

    if (e.which === 1) {
        if (btn.classList.contains('empty')) {
            btn.classList.remove('empty');

            const cell_n = pool.alloc_n();
            let cell = pool.get(cell_n);

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

let board;
let pool;

async function init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    document.querySelector('#start').addEventListener('click', e => {
        audioContext.resume().then(() => console.log('audio initialized'));
        load_audio(audioContext, 'sound/jingle.wav').then(res => {
            const src = audioContext.createBufferSource();
            src.buffer = res;
            src.connect(audioContext.destination);
            src.start(0);
            e.target.remove();
        });
    });

    const sounds = await load_scale(audioContext, 'c-nine');
    pool = new Pool(Cell, 10);
    board = new Board(9, btn_click(pool));
    document.getElementById('wrapper').appendChild(board.elem);
}
