//once i figure out how to link multiple js files, this can be easily moved to clear up space and make it more readable.
class Token {
    /*
    class to create a movable and storable token objects:
    name: name of the token
    element: html element
    cur_x: current x coordinate
    cur_y: current y coordinate

    */
    constructor(name = '(no name given)', element, cur_x=0, cur_y=0, width) {
        //uses _var naming scheme to prevent idefinite recursive calls
        this._name = name;
        this._element = element;
        this._cur_x = cur_x;
        this._cur_y = cur_y;
        if(width) { 
            this._width = width;
        } else {
            this._width = this.element.getAttribute("r");
        }
        
        this.set_position(cur_x, cur_y); //called in constructor to update the start position
        this.dragging = null; //currently dragging
    }
    //getter functions
    get name() { return this._name; }
    get element() { return this._element; }
    get width() { return this._width; }
    get cur_x() { return this._cur_x; }
    get cur_y() { return this._cur_y; }

    //setter functions
    set cur_x(new_x) { this._cur_x = new_x; }
    set cur_y(new_y) { this._cur_y = new_y; }
    set name(new_name) { this._name = new_name; }
    set_position(new_x, new_y) {
        grid_width = 2000;
        grid_height = 1000;

        //fix grid length and height for this
        this.cur_x = snap_to_grid(clamp(new_x, this.width, grid_width - this.width), 12, this.width);
        this.cur_y = snap_to_grid(clamp(new_y, this.width, grid_height - this.width), 12, this.width);

        //console.log("cur x : " + this.cur_x + " cur y : " + this.cur_y);

        this.element.setAttribute('cx', this.cur_x);
        this.element.setAttribute('cy', this.cur_y);
        
        //the following functions are used for adjusting coordinates in grad:
        //clamps value, returns x value clamped between the lo and hi
        function clamp(x, lo, hi) { 
            return x < lo ? lo : x > hi ? hi : x 
        }
        //snaps value, snaps value to closest factor of unit_length if it's lower or higher (closest square)
        function snap_to_grid(x, unit_length, width) {
            var remainder = x % unit_length;
            if(width % 12 == 0) { //token is even width
                if(remainder < unit_length/2) {
                    return x - remainder;
                }else {
                    return x - remainder + unit_length;
                }
            }else { //token is odd width
                if(remainder + unit_length/2 < unit_length/2) { //unit_length/2 accounts for odd width
                    return x - remainder - unit_length/2;
                }else {
                    return x - remainder + unit_length - unit_length/2;
                } 
            }
        }
    }


    //https://www.redblobgames.com/making-of/draggable/examples.html
    //draggability handler
    make_draggable() {
        console.log("adding dragability to " + this.name);
        //pass in an instance of the class to fix scope
        var _this = this;

        function event_to_svg_coordinates(event, el=event.currentTarget) {//converts event's argument coordinates to svg coordinates
            const svg = el.ownerSVGElement;
            let p = svg.createSVGPoint();
            p.x = event.clientX;
            p.y = event.clientY;
            p = p.matrixTransform(svg.getScreenCTM().inverse());
            return p;
        }

        function start_drag(event) { //starting dragging event handler
            if (event.button !== 0) return; //on left click
            let {x, y} = event_to_svg_coordinates(event);
            _this.dragging = {dx: _this.cur_x - x, dy: _this.cur_y - y};
            _this.element.classList.add('dragging');
            _this.element.setPointerCapture(event.pointerId);
        }

        function end_drag(_event) { //ending drag event handler
            _this.dragging = null;
            _this.element.classList.remove('dragging');
        }

        function move_drag(event) { //dragging on mouse move event handler
            if (!_this.dragging) return;
            let {x, y} = event_to_svg_coordinates(event);
            _this.set_position(x + _this.dragging.dx, y + _this.dragging.dy);
        }

        //binding handlers
        this.element.addEventListener('pointerdown', start_drag);
        this.element.addEventListener('pointerup', end_drag);
        this.element.addEventListener('pointercancel', end_drag);
        this.element.addEventListener('pointermove', move_drag);
        this.element.addEventListener('touchstart', (event) => event.preventDefault());
    }

    remove_draggable() { 
        //not functional, need to adjust scope of event handler functions in order to remove the listeners alltogether
        console.log("removing draggability from " + this.name);
        
    }
}
//END OF TOKEN CLASS/////////////////////////////////////////////////////////////////////////////////////

//load different page buttons
console.log("loading script...");
function home_button() {
    console.log("loading home page...");
}
function board_button() {
    console.log("loading board page...");
}


//game board and variables
let grid_height = 1000;
let grid_width = 2000;

var grid = document.getElementById("game_board");
grid.setAttribute('width',grid_width);
grid.setAttribute('height',grid_height);

var board_container = document.getElementById("game_board_container");
var board_svg = document.getElementById("game_board_svg");
var body = document.getElementById("body");
board_svg.setAttribute('width',grid_width);
board_svg.setAttribute('height',grid_height);
board_svg.setAttribute('viewBox','0 0 ' + grid_width + ' ' + grid_height);

//zoom functions
var cur_board_width = board_container.offsetWidth;
var cur_board_height = board_container.offsetHeight;
var cur_zoom_value = 100;
function set_zoom(new_zoom_value, cursor_x, cursor_y) {
    board_container.style.zoom = new_zoom_value + "%"; //updates client zoom for board

    //board movement for zoom (scroll wheel and zoom slider)
    if(cursor_x == null && cursor_y == null) { //zoom slider
        board_container.scrollBy((cur_board_width - board_container.offsetWidth)/2 , (cur_board_height - board_container.offsetHeight)/2); //centers screen
    }else if(cursor_x && cursor_y) { //scroll wheel & mouse
        //translates screen by cursor amount proportional to zoom (the more zoomed in, the less it translates)
        board_container.scrollBy((cur_board_width - board_container.offsetWidth)/2 , (cur_board_height - board_container.offsetHeight)/2); //centers screen
        
        var cur_centered_cursor_x = ((cursor_x-(body.offsetWidth/2)) / (cur_zoom_value/100));
        var cur_centered_cursor_y = ((cursor_y-(body.offsetHeight/2)) / (cur_zoom_value/100));
        var new_centered_cursor_x = ((cursor_x-(body.offsetWidth/2)) / (new_zoom_value/100));
        var new_centered_cursor_y = ((cursor_y-(body.offsetHeight/2)) / (new_zoom_value/100));

        board_container.scrollBy(cur_centered_cursor_x - new_centered_cursor_x, cur_centered_cursor_y - new_centered_cursor_y); 
        
    }else {
        console.log("SCROLLING ERROR");
    }
    cur_board_width = board_container.offsetWidth;
    cur_board_height = board_container.offsetHeight;
    cur_zoom_value = new_zoom_value;

}

//zoom slider handler
var zoom_slider = document.getElementById("zoom_slider");
zoom_slider.oninput = function() {
    set_zoom(Number(zoom_slider.value), null, null); //calls zoom slider
}

//sets zoom_slider value to +1/-1 step then calls set_zoom() to match the new value
//might want to rework later to not be dependant on zoom slider
function mouse_zoom(event) {
    step = zoom_slider.getAttribute("step");
    console.log("X " + event.clientX + " Y " + event.clientY);
    if(event.deltaY < 0){
        zoom_slider.value = Number(zoom_slider.value) + Number(step); //manually increases zoom by 1 step
        set_zoom(zoom_slider.value, event.clientX, event.clientY);
        //console.log("zooming in");
    }else{
        zoom_slider.value = Number(zoom_slider.value) - Number(step); //manually decreases zoom by 1 step
        set_zoom(zoom_slider.value, event.clientX, event.clientY);
        //console.log("zooming out");
    }
}
board_container.addEventListener("wheel", (event) => event.preventDefault());
board_container.addEventListener("wheel", mouse_zoom);

//panning
board_container.scrollTo(400, 400); //scrolls on start to have board in frame
var panning = false;    
function start_pan(event) { //starting pan event handler
    if(event.button == 2){
        //console.log("starting pan");
        panning = true;   
        event.preventDefault();
    }
}
function end_pan(event) { //ending pan event handler
    if(event.button == 2){
        //console.log("ending pan");
        panning = false;
    }   
}
function move_pan(event) { //panning on mouse movement event handler
    if(panning) {    
        board_container.scrollBy(-1 * Number(event.movementX) * (100/zoom_slider.value), -1 * Number(event.movementY) * (100/zoom_slider.value))
    }
}

board_svg.addEventListener('pointerdown', start_pan);
board_svg.addEventListener('pointerup', end_pan);
board_svg.addEventListener('pointercancel', end_pan);
board_svg.addEventListener('pointermove', move_pan);
board_svg.addEventListener("contextmenu", (event) => event.preventDefault()); //prevent the right click contextmenu from opening on the gameboard


//creating tokens
let new_element = document.getElementsByClassName("token")[0]; 
let new_token = new Token("big token",new_element, 100, 100, 6);
new_token.make_draggable();


let new_element2 = document.getElementsByClassName("token")[1]; 
let new_token2 = new Token("small token",new_element2, 200, 200, 18);
new_token2.make_draggable();


let new_element3 = document.getElementsByClassName("token")[2]; 
let new_token3 = new Token("really large token",new_element3, 400, 400);
new_token3.make_draggable();
new_token3.remove_draggable();







