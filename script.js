/*
THE PLAN IS SIMPLE:
create class of 'tokens' that can be made multiple of
create class? for tokens that will store borders for where the tokens can and can't go
*/
//I am not sure how to link multiple js files together and make the html work, for now it will stay here
class Token {
    /*
    class to create a movable and storable token objects:
    name: name of the token
    num_width: number of tiles wide
    num_height: number of tiles tall

    */
    constructor(name, num_width, num_height, cur_x, cur_y) {
        this.name = name;
        this.num_height = num_height;
        this.num_width = num_width;
        this.cur_x = cur_x;
        this.cur_y = cur_y;
    }

    get_name() {return this.name;}
    get_width() {return this.num_width;}
    get_height() {return this.num_height;}
    get_cur_x() {return this.cur_x;}
    get_cur_y() {return this.cur_y;}

    set_cur_x(new_x) {this.cur_x = new_x;}
    set_cur_y(new_y) {this.cur_y = new_y;}
    
}


console.log("loading script...");

const woot = new Token("woot",0,0,0,0);
console.log(woot.get_cur_y());



function home_button() {
    console.log("loading home page...");
}
function board_button() {
    console.log("loading board page...");
}

//game board
let grid_height =500;
let grid_width = 500;

const grid = document.getElementById("grid");
grid.setAttribute('width',grid_width);
grid.setAttribute('height',grid_height);

const game_board_svg = document.getElementById("game_board_svg");
game_board_svg.setAttribute('width',grid_width);
game_board_svg.setAttribute('height',grid_height);
game_board_svg.setAttribute('viewBox','0 0 ' + grid_width + ' ' + grid_height);


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
            x: snapToClosest(clamp(p.x, el.getAttribute('r'), grid_width-el.getAttribute('r')), 12),
            y: snapToClosest(clamp(p.y, el.getAttribute('r'), grid_height-el.getAttribute('r')), 12)
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


