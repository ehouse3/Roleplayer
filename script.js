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
    element: html element
    num_width: number of tiles wide
    num_height: number of tiles tall
    cur_x: current x coordinate
    cur_y: current y coordinate

    */
    constructor(name = '', element, cur_x=0, cur_y=0) {
        this.name = name;
        this.element = element;
        this.cur_x = cur_x;
        this.cur_y = cur_y;
        
        this.dragging = null;
        this.eventToCoordinates = this.eventToSvgCoordinates;

        console.log("testing js outputs and functionality :");
        console.log();

    }
    //getters
    get_name() {return this.name;}
    get_element() {return this.element;}
    get_width() {return this.num_width;}
    get_height() {return this.num_height;}
    get_cur_x() {return this.cur_x;}
    get_cur_y() {return this.cur_y;}

    //setters
    set_position(new_x, new_y) {
        //fix grid length and height for this
        this.cur_x = snapToClosest(clamp(new_x, this.element.getAttribute('r'), 500 - this.element.getAttribute('r')), 12);
        this.cur_y = snapToClosest(clamp(new_y, this.element.getAttribute('r'), 500 - this.element.getAttribute('r')), 12);

        this.element.setAttribute('cx', this.cur_x);
        this.element.setAttribute('cy', this.cur_y);
        
        //following functions are used for adjusting coordinates
        //clamps value, returns x value clamped between the lo and hi
        function clamp(x, lo, hi) { 
            return x < lo ? lo : x > hi ? hi : x 
        }

        //snaps value, snaps value to closest factor of unit_length if it's lower or higher (closest square)
        function snapToClosest(x, unit_length) {
            remainder = x % unit_length;
            if(remainder < unit_length/2) {
                return x - (x % unit_length);
            }else {
                return x - (x % unit_length) + unit_length;
            }
        }
    }

    //makeDraggable(state, el);
    
    makeDraggable() {
        function start(event) {
            if (event.button !== 0) return; // left button only
            let {x, y} = this.eventToCoordinates(event);
            this.dragging = {dx: this.cur_x - x, dy: this.cur_y - y};
            this.element.classList.add('dragging');
            this.element.setPointerCapture(event.pointerId);
        }

        function end(_event) {
            this.dragging = null;
            this.element.classList.remove('dragging');
        }

        function move(event) {
            if (!this.dragging) return;
            let {x, y} = this.eventToCoordinates(event);
            this.set_position(x + this.dragging.dx, y + this.dragging.dy);
        }

        this.element.addEventListener('pointerdown', start);
        this.element.addEventListener('pointerup', end);
        this.element.addEventListener('pointercancel', end);
        this.element.addEventListener('pointermove', move)
        this.element.addEventListener('touchstart', (e) => e.preventDefault());
    }

    eventToSvgCoordinates(event, el=event.currentTarget) {
        const svg = el.ownerSVGElement;
        let p = svg.createSVGPoint();
        p.x = event.clientX;
        p.y = event.clientY;
        p = p.matrixTransform(svg.getScreenCTM().inverse());
        return p;
    }

}


console.log("loading script...");





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
const new_element = document.getElementById("token");
const new_token = new Token("woot",new_element, 50, 50);
new_token.makeDraggable();




