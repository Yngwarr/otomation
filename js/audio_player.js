const SCALE_SIZE = 9;

class AudioPlayer {
    constructor() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.instruments = {};
    }

    async load_audio(ctx, url) {
        return await ctx.decodeAudioData(await load_blob(url));
    }

    async load_instr(name) {
        let bufs = Array.apply(null, { length: SCALE_SIZE });
        for (let i = 1; i <= SCALE_SIZE; ++i) {
            bufs[i-1] = await this.load_audio(this.ctx, `sound/${name}/${i}.wav`);
        }
        const sounds = bufs.map(x => {
            const src = this.ctx.createBufferSource();
            src.buffer = x;
            src.connect(this.ctx.destination);
            src.addEventListener('ended', e => {
                e.target.stop();
            })
            return src;
        });
        this.instruments[name] = sounds;
    }

    play(instr, idx) {
        if (!this.instruments[instr]) {
            throw `no such instrument '${instr}'`;
        }
        if (idx < 0 || idx > this.instruments[instr]) {
            throw `index ${idx} is out of bounds (instr = ${instr}, `
                + `len = ${this.instruments[instr].length})`;
        }
        this.instruments[instr][idx].start(0);
    }
}
