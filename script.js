/*
THE PLAN IS SIMPLE:
create class of 'tokens' that can be made multiple of
create class? for tokens that will store borders for where the tokens can and can't go
*/
console.log("loading script...")

function home_button() {
    console.log("loading home page...");
}
function board_button() {
    console.log("loading board page...");
}

//https://www.redblobgames.com/making-of/draggable/examples.html
//draggability handler
const el = document.getElementById("token");
let state = {
    eventToCoordinates: eventToSvgCoordinates,
    dragging: null,
    _pos: undefined,
    get pos() {
        return this._pos;
    },
    set pos(p) { 
        this._pos = {
            x: snapToClosest(clamp(p.x, el.getAttribute('r'), 430-el.getAttribute('r')), 12),
            y: snapToClosest(clamp(p.y, el.getAttribute('r'), 230-el.getAttribute('r')), 12)
        };
        el.setAttribute('cx', this._pos.x);
        el.setAttribute('cy', this._pos.y);
    },
}

state.pos = {x: 100, y: 100};
makeDraggable(state, el);

//clamps returns x value clamped between the lo and hi
function clamp(x, lo, hi) { 
    return x < lo ? lo : x > hi ? hi : x 
}

//returns new position to snap to closest square
function snapToClosest(x, unit_length) {
    remainder = x % unit_length;
    if(remainder < unit_length/2) {
        return x - (x % unit_length);
    }else {
        return x - (x % unit_length) + unit_length;
    }
}

function makeDraggable(state, el) {
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
