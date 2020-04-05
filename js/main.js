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

let board;

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
    board = new Board(9);
    document.getElementById('wrapper').appendChild(board.elem);
}
