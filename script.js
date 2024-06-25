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
    cur_x: current x coordinate
    cur_y: current y coordinate

    */
    constructor(name = '', element, cur_x=0, cur_y=0) {
        this.name = name;
        this.element = element;
        this.cur_x = cur_x;
        this.cur_y = cur_y;
        this.set_position(cur_x, cur_y);
        
        
        this.dragging = null;

        console.log("testing js outputs and functionality :");
        console.log();

    }
    //getters, fix to be in get format
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

        //console.log("cur x : " + this.cur_x + " cur y : " + this.cur_y);

        this.element.setAttribute('cx', this.cur_x);
        this.element.setAttribute('cy', this.cur_y);
        
        //following functions are used for adjusting coordinates
        //clamps value, returns x value clamped between the lo and hi
        function clamp(x, lo, hi) { 
            return x < lo ? lo : x > hi ? hi : x 
        }

        //snaps value, snaps value to closest factor of unit_length if it's lower or higher (closest square)
        function snapToClosest(x, unit_length) {
            var remainder = x % unit_length;
            if(remainder < unit_length/2) {
                return x - (x % unit_length);
            }else {
                return x - (x % unit_length) + unit_length;
            }
        }
    }

    
    //https://www.redblobgames.com/making-of/draggable/examples.html
    //draggability handler
    make_draggable() {
        console.log("adding drag");
        //pass in an instance of the class to fix scope
        var _this = this;

        function eventToSvgCoordinates(event, el=event.currentTarget) {
            const svg = el.ownerSVGElement;
            let p = svg.createSVGPoint();
            p.x = event.clientX;
            p.y = event.clientY;
            p = p.matrixTransform(svg.getScreenCTM().inverse());
            return p;
        }

        function start(event) {
            if (event.button !== 0) return; // left button only
            console.log(event);
            let {x, y} = eventToSvgCoordinates(event);
            _this.dragging = {dx: _this.cur_x - x, dy: _this.cur_y - y};
            _this.element.classList.add('dragging');
            _this.element.setPointerCapture(event.pointerId);
        }

        function end(_event) {
            _this.dragging = null;
            _this.element.classList.remove('dragging');
        }

        function move(event) {
            if (!_this.dragging) return;
            let {x, y} = eventToSvgCoordinates(event);
            _this.set_position(x + _this.dragging.dx, y + _this.dragging.dy);
        }

        this.element.addEventListener('pointerdown', start);
        this.element.addEventListener('pointerup', end);
        this.element.addEventListener('pointercancel', end);
        this.element.addEventListener('pointermove', move);
        this.element.addEventListener('touchstart', (e) => e.preventDefault());
    }

    stop_draggable() {
        console.log("removing draggability from " + this.name);
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
let grid_height = 500;
let grid_width = 500;

const grid = document.getElementById("grid");
grid.setAttribute('width',grid_width);
grid.setAttribute('height',grid_height);

const game_board_svg = document.getElementById("game_board_svg");
game_board_svg.setAttribute('width',grid_width);
game_board_svg.setAttribute('height',grid_height);
game_board_svg.setAttribute('viewBox','0 0 ' + grid_width + ' ' + grid_height);



let new_element = document.getElementsByClassName("token")[0]; //getElementsByClassName returns a list
//let new_element = document.getElementById("token");
console.log(new_element);
let new_token = new Token("woot",new_element, 100, 100);
new_token.make_draggable();


let new_element2 = document.getElementsByClassName("token")[1]; //getElementsByClassName returns a list
//let new_element = document.getElementById("token");
console.log(new_element2);
let new_token2 = new Token("woot",new_element2, 200, 200);
new_token2.make_draggable();






