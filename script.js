console.log("loading script...")

function home_button() {
    console.log("loading home page...");
}
function board_button() {
    console.log("loading board page...");
}

//https://www.redblobgames.com/making-of/draggable/examples.html
//draggability handler

const el = document.querySelector("svg circle");
let state = {
    eventToCoordinates: eventToSvgCoordinates,
    dragging: null,
    _pos: undefined,
    get pos() {
        return this._pos;
    },
    set pos(p) { 
        this._pos = {
            x: clamp(p.x, 0, +430), //*
            y: clamp(p.y, 0, +230) //*
        };
        el.setAttribute('cx', this._pos.x);
        el.setAttribute('cy', this._pos.y);
    },
}
state.pos = {x: 20, y: 20};
makeDraggable(state, el);

function clamp(x, lo, hi) { 
    return x < lo ? lo : x > hi ? hi : x 
}

function makeDraggable(state, el) {
    // from https://www.redblobgames.com/making-of/draggable/
    function start(event) {
        if (event.button !== 0) return; // left button only
        let {x, y} = state.eventToCoordinates(event);
        state.dragging = {dx: state.pos.x - x, dy: state.pos.y - y};
        el.classList.add('dragging');
        el.setPointerCapture(event.pointerId);
    }

    function end(_event) {
        state.dragging = null;
        el.classList.remove('dragging');
    }

    function move(event) {
        if (!state.dragging) return;
        let {x, y} = state.eventToCoordinates(event);
        state.pos = {x: x + state.dragging.dx, y: y + state.dragging.dy};
    }

    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('pointermove', move)
    el.addEventListener('touchstart', (e) => e.preventDefault());
}

function eventToSvgCoordinates(event, el=event.currentTarget) {
    const svg = el.ownerSVGElement;
    let p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    p = p.matrixTransform(svg.getScreenCTM().inverse());
    return p;
}
