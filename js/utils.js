function slice_to_char(str, from, to) {
    const indices = to.map(s => str.indexOf(s)).filter(i => i > -1);
    return str.slice(from, Math.min(...indices))
}

// e.g.: mk_elem('svg#grid', SVG_NS, {attr: { width: 8, height: 8 }})
function mk_elem(sel, ns = null, params = { attr: {}, data: {}, style: {} }) {
    const tag = sel[0] === '#' || sel[0] === '.'
        ? 'div'
        : slice_to_char(sel, 0, ['#', '.']);
    const id = sel.includes('#')
        ? slice_to_char(sel, sel.indexOf('#') + 1, ['.'])
        : null;
    const class_list = sel.includes('.')
        ? sel.slice(sel.indexOf('.') + 1).split('.')
        : null;

    const {attr, data, style} = params;
    let el = ns
        ? document.createElementNS(ns, tag)
        : document.createElement(tag);
    if (id) el.setAttribute('id', id);
    if (class_list) el.classList.add(...class_list);
    for (let a in attr) el.setAttribute(a, attr[a]);
    for (let d in data) el.dataset[d] = data[d];
    for (let s in style) el.style[s] = style[s];

    return el;
}
