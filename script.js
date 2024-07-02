//once i figure out how to link multiple js files, this can be easily moved to clear up space and make it more readable.
class Token {
    /*
    class to create a movable and storable token objects:
    name: name of the token
    element: html element
    cur_x: current x coordinate
    cur_y: current y coordinate

    */
    constructor(name = '(no name given)', element, cur_x=0, cur_y=0) {
        this.name = name;
        this.element = element;
        this.cur_x = cur_x;
        this.cur_y = cur_y;
        
        this.set_position(cur_x, cur_y); //called in constructor to update the position
        this.dragging = null;
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
        this.cur_x = snapToClosest(clamp(new_x, this.element.getAttribute('r'), 2000 - this.element.getAttribute('r')), 12);
        this.cur_y = snapToClosest(clamp(new_y, this.element.getAttribute('r'), 1000 - this.element.getAttribute('r')), 12);

        //console.log("cur x : " + this.cur_x + " cur y : " + this.cur_y);

        this.element.setAttribute('cx', this.cur_x);
        this.element.setAttribute('cy', this.cur_y);
        
        //the following functions are used for adjusting coordinates
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
        console.log("adding dragability to " + this.name);
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

        function start_drag(event) {
            if (event.button !== 0) return; // left button only
            let {x, y} = eventToSvgCoordinates(event);
            _this.dragging = {dx: _this.cur_x - x, dy: _this.cur_y - y};
            _this.element.classList.add('dragging');
            _this.element.setPointerCapture(event.pointerId);
        }

        function end_drag(_event) {
            _this.dragging = null;
            _this.element.classList.remove('dragging');
        }

        function move_drag(event) {
            if (!_this.dragging) return;
            let {x, y} = eventToSvgCoordinates(event);
            _this.set_position(x + _this.dragging.dx, y + _this.dragging.dy);
        }

        this.element.addEventListener('pointerdown', start_drag);
        this.element.addEventListener('pointerup', end_drag);
        this.element.addEventListener('pointercancel', end_drag);
        this.element.addEventListener('pointermove', move_drag);
        this.element.addEventListener('touchstart', (event) => event.preventDefault());
    }

    stop_draggable() {
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


//game board
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

//console.log("window width: " + body.offsetWidth);
//console.log("width " + board_container.offsetWidth);
var cur_board_width = board_container.offsetWidth;
var cur_board_height = board_container.offsetHeight;
var cur_zoom_value = 100;
function set_zoom(new_zoom_value, cursor_x, cursor_y) {
    //console.log("window width: " + body.offsetWidth);
    //console.log(cursor_x);
    //console.log(cursor_y);
    
    board_container.style.zoom = new_zoom_value + "%";

    
    if(cursor_x == null && cursor_y == null) { //called from not scroll wheel
        board_container.scrollBy((cur_board_width - board_container.offsetWidth)/2 , (cur_board_height - board_container.offsetHeight)/2);
    }else if(cursor_x && cursor_y) { //called from scroll wheel
        console.log("cursor pos: " + cursor_x * (cur_zoom_value/100));
        console.log("cursor pos: " + cursor_x * (new_zoom_value/100));
        board_container.scrollBy((cur_board_width - board_container.offsetWidth)/2 , (cur_board_height - board_container.offsetHeight)/2);//centers
        
        var cur_centered_cursor_x = ((cursor_x-(body.offsetWidth/2)) / (cur_zoom_value/100));
        var cur_centered_cursor_y = ((cursor_y-(body.offsetHeight/2)) / (cur_zoom_value/100));
        var new_centered_cursor_x = ((cursor_x-(body.offsetWidth/2)) / (new_zoom_value/100))
        var new_centered_cursor_y = ((cursor_y-(body.offsetHeight/2)) / (new_zoom_value/100))
        board_container.scrollBy(cur_centered_cursor_x - new_centered_cursor_x, cur_centered_cursor_y - new_centered_cursor_y); 
        
        
        
        //console.log("centered monitor cursor:" + cursor_x-(body.offsetWidth/2)); //make it proportional to the board_container.offsetWidth somehow
        
        //console.log(cursor_x);
    }else {
        console.log("SCROLLING ERROR");
    }
    cur_board_width = board_container.offsetWidth;
    cur_board_height = board_container.offsetHeight;
    cur_zoom_value = new_zoom_value;

    //console.log("width " + board_container.offsetWidth);
    //console.log("zoom level percent: " + new_zoom_value);
    console.log("\n");
}

//detects input from zoom slider then calls set_zoom()
var zoom_slider = document.getElementById("zoom_slider");
zoom_slider.oninput = function() {
    set_zoom(Number(zoom_slider.value), null, null);
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
function start_pan(event) {
    if(event.button == 2){
        //console.log("starting pan");
        panning = true;   
        event.preventDefault();
    }
}
function end_pan(event) {
    if(event.button == 2){
        //console.log("ending pan");
        panning = false;
    }   
}
function move_pan(event) {
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
let new_element = document.getElementsByClassName("token")[0]; //getElementsByClassName returns a list
//let new_element = document.getElementById("token");
let new_token = new Token("big token",new_element, 100, 100);
new_token.make_draggable();


let new_element2 = document.getElementsByClassName("token")[1]; //getElementsByClassName returns a list
//let new_element = document.getElementById("token");
let new_token2 = new Token("small token",new_element2, 200, 200);
new_token2.make_draggable();


let new_element3 = document.getElementsByClassName("token")[2]; //getElementsByClassName returns a list
//let new_element = document.getElementById("token");
let new_token3 = new Token("really large token",new_element3, 400, 400);
new_token3.make_draggable();







