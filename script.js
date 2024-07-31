//once i figure out how to link multiple js files, this can be easily moved to clear up space and make it more readable.
class Token {
    /*
    class to create a movable and storable token objects:
    name: name of the token
    element: html element
    cur_x: current x coordinate
    cur_y: current y coordinate
    width: 
    */
    constructor(name = '(no name given)', element_parent, cur_x=0, cur_y=0, width, unique_id) {
        //uses _var naming scheme to prevent idefinite recursive calls
        this._name = name;

        this._element_parent = element_parent;
        this._element_circle_0 = element_parent.children[0]; //first circle
        this._element_circle_1 = element_parent.children[1]; //second circle

        this._cur_x = cur_x;
        this._cur_y = cur_y;
        if(width) { 
            this._width = width;
            this.element_circle_0.setAttribute("r", Number(this.width / 2) + "px");
            this.element_circle_1.setAttribute("r", Number(this.width / 2) + "px");
        } else {
            //this._width = this.element_circle_0.getAttribute("r");
            console.log();
        }

        this._unique_id = unique_id;
        this.element_parent.id = this.unique_id;
        
        this.set_position(cur_x, cur_y); //called in constructor to update the start position
        this.dragging = null; //currently dragging
        this._selected = false;
        this.previous_border_0 = '';
        this.previous_border_1 = '';
        this._movement_allowed = true;

        //token game stats
        this._health = 10;
        this._mana = 5;
        this._armor = 0;
        this._speed = 0;
    }
    //getter functions
    get element_parent() { return this._element_parent; }
    get element_circle_0() { return this._element_circle_0; }
    get element_circle_1() { return this._element_circle_1; }
    get width() { return this._width; }
    get cur_x() { return this._cur_x; }
    get cur_y() { return this._cur_y; }
    get selected() { return this._selected; }
    get unique_id() { return this._unique_id; }
    get movement_allowed() { return this._movement_allowed; }

    get name() { return this._name; }
    get health() { return this._health; }
    get mana() { return this._mana; }

    //setter functions
    set cur_x(new_x) { this._cur_x = new_x; }
    set cur_y(new_y) { this._cur_y = new_y; }
    set name(new_name) { this._name = new_name; }
    set health(new_health) { this._health = new_health; }
    set mana(new_mana) { this._mana = new_mana; }
    set selected(new_selected) { //replace all with filter w/ hue rotate and a sepperate css class
        if(new_selected == true && this.selected == false) {
            this.previous_border_0 = this.element_circle_0.style.getPropertyValue("stroke");
            this.previous_border_1 = this.element_circle_1.style.getPropertyValue("stroke");
            
            this.element_circle_0.style.setProperty("stroke", "rgb(50, 50, 177)");
            this.element_circle_1.style.setProperty("stroke", "rgb(35, 35, 150)");
        } else {
            this.element_circle_0.style.setProperty("stroke", this.previous_border_0);
            this.element_circle_1.style.setProperty("stroke", this.previous_border_1);
            this.previous_border_0 = '';
            this.previous_border_1 = '';
        }
        this._selected = new_selected;
    }
    prevent_movement() { this._movement_allowed = false; }
    allow_movement() { this._movement_allowed = true; }
    set_position(new_x, new_y) {
        grid_width = 2000;
        grid_height = 1000;

        //fix grid length and height for this
        this.cur_x = snap_to_grid(clamp(new_x, (this.width / 2), grid_width - (this.width / 2)), 12, (this.width / 2));
        this.cur_y = snap_to_grid(clamp(new_y, (this.width / 2), grid_height - (this.width / 2)), 12, (this.width / 2));

        //console.log("cur x : " + this.cur_x + " cur y : " + this.cur_y);

        this.element_parent.setAttribute("transform", "translate(" + this.cur_x + "," + this.cur_y + ")");
        
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
    event_to_svg_coordinates = (event, el=event.currentTarget) => {//converts event's argument coordinates to svg coordinates
        const svg = this.element_parent.parentElement;
        let p = svg.createSVGPoint();
        p.x = event.clientX;
        p.y = event.clientY;
        p = p.matrixTransform(svg.getScreenCTM().inverse());
        return p;
    }

    start_drag = (event) => { //starting dragging event handler
        if (event.button !== 0) return; //on left click
        //check unique id matches that of element on cursor (needed because handler bound to gameboard), and will drag anyway if its selected
        if (event.target.parentElement.id != this.unique_id && this.selected == false) return; 
        if (!this.movement_allowed) return;
        let {x, y} = this.event_to_svg_coordinates(event);
        this.dragging = {dx: this.cur_x - x, dy: this.cur_y - y};
        this.element_parent.classList.add('dragging');
        this.element_parent.setPointerCapture(event.pointerId);
    }

    move_drag = (event) => { //dragging on mouse move event handler
        if (!this.dragging) return;
        if (!this.movement_allowed) return;
        let {x, y} = this.event_to_svg_coordinates(event);
        this.set_position(x + this.dragging.dx, y + this.dragging.dy);
    }

    end_drag = (_event) => { //ending drag event handler
        this.dragging = null;
        this.element_parent.classList.remove('dragging');
    }

    make_draggable() {
        console.log("adding dragability to " + this.name);

        //binding handlers
        this.element_parent.parentElement.addEventListener('pointerdown', this.start_drag);
        this.element_parent.parentElement.addEventListener('pointerup', this.end_drag);
        this.element_parent.parentElement.addEventListener('pointercancel', this.end_drag);
        this.element_parent.parentElement.addEventListener('pointermove', this.move_drag);
        this.element_parent.parentElement.addEventListener('touchstart', (event) => event.preventDefault());
    }

    remove_draggable() { 
        //not functional, need to adjust scope of event handler functions in order to remove the listeners alltogether
        console.log("removing draggability from " + this.name);
        
    }

    //setting border colors
    set_border(inner_color, outer_color) {
        console.log("setting border");
        //var woot = window.getComputedStyle(this._element_circle_0).stroke; 
        //setting width
        var stroke_width = 3;
        this.element_circle_0.style.setProperty("stroke-width", stroke_width + "px");
        this.element_circle_1.style.setProperty("stroke-width", Number(stroke_width / 3) + "px");
        //setting color
        this.element_circle_0.style.setProperty("stroke", "rgb(" + outer_color[0] + "," + outer_color[1] + "," + outer_color[2] + ")");
        this.element_circle_1.style.setProperty("stroke", "rgb(" + inner_color[0] + "," + inner_color[1] + "," + inner_color[2] + ")");

    }
}
//END OF TOKEN CLASS/////////////////////////////////////////////////////////////////////////////////////

//navbar
//console.log("loading script...");
function home_button() {
    console.log("loading home page...");
}
function board_button() {
    console.log("loading board page...");
}

//minimize navbar
//calculating how for to minimize the bar
var navbar = document.getElementById("navbar");
var navbar_width = Number(window.getComputedStyle(navbar).width.split('px')[0]); //total width

var minimize_navbar = document.getElementsByClassName("minimize_navbar")[0]; //button itself
var minimize_navbar_width = Number(window.getComputedStyle(minimize_navbar).width.split('px')[0]); //button width

var minimize_navbar_seperator = document.getElementsByClassName("minimize_navbar_seperator")[0]; //seperator
var minimize_navbar_seperator_width = Number(window.getComputedStyle(minimize_navbar_seperator).width.split('px')[0]); //seperator width

var amount = navbar_width - minimize_navbar_width - minimize_navbar_seperator_width; //amount to minimize such that button still shows
var minimize_navbar_inner = document.getElementsByClassName("minimize_navbar_li_a")[0]; //text element
var navbar_minimized = false;
function minimize_navbar_button() { //called by buttonpress on navbar
    if(!navbar_minimized) { //determines how far it needs to scroll and adjusts margin-left to move it offscreen
        navbar.style.setProperty("margin-left", "-" + amount + "px");
        minimize_navbar_inner.innerHTML = "&gt";
        navbar_minimized = true;
    } else { //return margin-left to 0px
        navbar.style.setProperty("margin-left", "0px");
        minimize_navbar_inner.innerHTML = "&lt"
        navbar_minimized = false;
    }
}

//minimize token-information
//calculating how far to minimize the tab
var token_information = document.getElementById("token_information");
var token_information_width = Number(window.getComputedStyle(token_information).width.split('px')[0]); //total width

var minimize_token_information_li = document.getElementsByClassName("minimize_token_information_li")[0]; //button itself
var minimize_token_information_li_width = Number(window.getComputedStyle(minimize_token_information_li).width.split('px')[0]); //button width
var minimize_token_information_border_width = Number(window.getComputedStyle(minimize_token_information_li).borderLeft.split('px')[0]); //border width

var minimize_token_information_inner = document.getElementsByClassName("minimize_token_information_li_a")[0]; //text element

var minimize_amount = (token_information_width - minimize_token_information_li_width) - minimize_token_information_border_width; //amount to minimize such that button still shows
let token_information_minimized = true;
function minimize_token_information() { //called by buttonpress on token information bar
    if(!token_information_minimized) {
        token_information.style.setProperty("margin-left", "-" + minimize_amount + "px");
        minimize_token_information_inner.innerHTML = "&gt";
        token_information_minimized = true;
    } else {
        token_information.style.setProperty("margin-left", "0px");
        minimize_token_information_inner.innerHTML = "&lt";
        token_information_minimized = false;
    }
}
var cur_displayed_token = '';
var name_element = document.getElementById("name");
var health_element = document.getElementById("health");
var mana_element = document.getElementById("mana");
var border_element = document.getElementById("border");
function update_token_information() {
    console.log(cur_displayed_token);
    name_element.innerHTML = cur_displayed_token.name;
    health_element.innerHTML = "hp : " + cur_displayed_token.health;
    mana_element.innerHTML = "mp : " + cur_displayed_token.mana;
    border_element.innerHTML = "size : " + cur_displayed_token.width;
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

var tokens_list = []; //list of moveable/selectable tokens
var selected_tokens_list = []; //list of currently selected tokens

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
    event.preventDefault();
    //console.log("X " + event.clientX + " Y " + event.clientY);
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
board_container.addEventListener("wheel", mouse_zoom);

//panning
board_container.scrollTo(500, 500); //scrolls on start to have board in frame
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
board_container.addEventListener('pointerdown', start_pan);
board_container.addEventListener('pointerup', end_pan);
board_container.addEventListener('pointercancel', end_pan);
board_container.addEventListener('pointermove', move_pan);
board_container.addEventListener("contextmenu", (event) => event.preventDefault()); //prevent the right click contextmenu from opening on the gameboard

//box-selection
var box_selecting = false;
var start_x = 0;
var start_y = 0;
var cur_x = 0;
var  cur_y = 0;
var selector_element = document.getElementById("selector");
function start_select(event) { //selection start handler
    if(event.button !== 0) return; //mouse 0 only
    if(event.target.parentElement.classList.contains("token")) { //will not box select on a token piece, instead will 'select it' and let movement handler deal with it
        let target_id = event.target.parentElement.id;
        let token_i = 0;
        //might want to improve later with a master list of elements to go along with tokens
        while(token_i < tokens_list.length) { //itterates through tokens until it finds the one that the cursor is over
            if(target_id == tokens_list[token_i].unique_id && tokens_list[token_i].selected == false) {
                tokens_list[token_i].selected = true;
                selected_tokens_list.push(tokens_list[token_i])
                cur_displayed_token = tokens_list[token_i];
                token_i = tokens_list.length; //exit loop
            }
            token_i++;
        }
        
        update_token_information();
        return; 
    }

    //unselects previous tokens & clears selected list
    for(let selected_tokens_list_i = 0; selected_tokens_list_i < selected_tokens_list.length; selected_tokens_list_i++) { //remove all selected
        selected_tokens_list[selected_tokens_list_i].selected = false;
    }
    selected_tokens_list = [];
    
    //prevent and remove dragging for all tokens
    for(let token_i = 0; token_i < tokens_list.length; token_i++) { 
        tokens_list[token_i].prevent_movement();
        tokens_list[token_i].element_parent.classList.remove('dragging'); //forcefully remove dragging because handler still fires...
    }

    box_selecting = true;
    //sets immediate cursor position, adding current screen board location, then adjusting for zoom. (800 is for margin)
    start_x = (event.clientX * 100/cur_zoom_value) + board_container.scrollLeft - 800;
    start_y = (event.clientY * 100/cur_zoom_value) + board_container.scrollTop - 800;
    selector_element.setAttribute("x", start_x); 
    selector_element.setAttribute("y", start_y);
}
function move_select(event) { //selection move handler
    if(!box_selecting) return;
    //selection-box movement starts at cursor
    cur_x = (event.clientX * 100/cur_zoom_value) + board_container.scrollLeft - 800;
    cur_y = (event.clientY * 100/cur_zoom_value) + board_container.scrollTop - 800;
    
    //setting front end element size
    //box element's width created towards the right. If cursor moves left, adjusts the selection box's starting position (x), rather than width
    if(cur_x > start_x) { 
        selector_element.setAttribute("width", cur_x - start_x + "px");
        selector_element.setAttribute("x", start_x + "px");
    } else {
        selector_element.setAttribute("width", start_x - cur_x + "px");  
        selector_element.setAttribute("x", cur_x + "px");
    }
    //box element's height created towards the top. If cursor moves down, adjusts the selection box's starting position (y), rather than height
    if(cur_y > start_y) {
        selector_element.setAttribute("height", cur_y - start_y + "px");
        selector_element.setAttribute("y", start_y);
    } else {
        selector_element.setAttribute("height", start_y - cur_y + "px");  
        selector_element.setAttribute("y", cur_y + "px");
    }


}
function end_select(event) { //selection end handler
    //create function to find all elements in selector_element, and set 'selected' instance var for each token to true.
    if(!box_selecting) {
        //unselects previous tokens & clears selected list
        for(let selected_tokens_list_i = 0; selected_tokens_list_i < selected_tokens_list.length; selected_tokens_list_i++) { //remove all selected
            selected_tokens_list[selected_tokens_list_i].selected = false;
    }
    selected_tokens_list = [];
        return;
    }
    //itterates through all tokens, and if their position is inside the selection_box, add Token to selected_tokens_list
    for(let token_i = 0; token_i < tokens_list.length; token_i++) {
        if(cur_x != 0 && cur_y != 0){ //cursor moved at least once
            //each statement corresponds to the selection-box mouse moving towards a quadrant.
            //fix to include if selected on not center of token
            if((tokens_list[token_i].cur_x < cur_x && tokens_list[token_i].cur_x > start_x) && (tokens_list[token_i].cur_y < cur_y && tokens_list[token_i].cur_y > start_y)) { //bottom-right
                selected_tokens_list.push(tokens_list[token_i]);
            } else if((tokens_list[token_i].cur_x > cur_x && tokens_list[token_i].cur_x < start_x) && (tokens_list[token_i].cur_y < cur_y && tokens_list[token_i].cur_y > start_y)) { //bottom-left
                selected_tokens_list.push(tokens_list[token_i]);
            } else if((tokens_list[token_i].cur_x < cur_x && tokens_list[token_i].cur_x > start_x) && (tokens_list[token_i].cur_y > cur_y && tokens_list[token_i].cur_y < start_y)) { //top-right
                selected_tokens_list.push(tokens_list[token_i]);
            } else if((tokens_list[token_i].cur_x > cur_x && tokens_list[token_i].cur_x < start_x) && (tokens_list[token_i].cur_y > cur_y && tokens_list[token_i].cur_y < start_y)) { //top-left
                selected_tokens_list.push(tokens_list[token_i]);
            }
        }
        tokens_list[token_i].allow_movement();
    }
    
    //itterates through selected tokens list and sets all selected to true
    for(let selected_tokens_list_i = 0; selected_tokens_list_i < selected_tokens_list.length; selected_tokens_list_i++) {
        selected_tokens_list[selected_tokens_list_i].selected = true;
    }
    //console.log("current selected: " + selected_tokens_list);

    //reseting all variables for next box-selection
    box_selecting = false;
    cur_x = 0;
    cur_y = 0;
    selector_element.setAttribute("width", "");
    selector_element.setAttribute("height", "");
    selector_element.setAttribute("x", "");
    selector_element.setAttribute("y", "");
}

//binding handlers
board_container.addEventListener('pointerdown', start_select);
board_container.addEventListener('pointerup', end_select);
board_container.addEventListener('pointercancel', end_select);
board_container.addEventListener('pointermove', move_select);

var token_prefab = document.getElementById("token_prefab");
console.log(token_prefab);
var unique_id = 0; //assigns a different unique id to each created token
function create_new_token() { //clones and appends prefab. Then creates token with appropiate creation functions
    let new_element = token_prefab.cloneNode(true);
    board_svg.appendChild(new_element);
    let new_token = new Token("new token", new_element, 400, 400, 24, unique_id);
    tokens_list.push(new_token);

    new_token.make_draggable();
    new_token.set_border([60, 60, 60],[78, 78, 78]);
    unique_id++;
}

//creating tokens


let new_element2 = document.getElementsByClassName("token")[1];
let new_token2 = new Token("starting token S", new_element2, 125, 100, 12, "a");
new_token2.health = 25;
new_token2.make_draggable();
new_token2.set_border([160, 60, 60],[178, 78, 78]);
tokens_list.push(new_token2);

let new_element3 = document.getElementsByClassName("token")[2];
let new_token3 = new Token("starting token M", new_element3, 150, 100, 24, "b");
new_token3.health = 50;
new_token3.make_draggable();
new_token3.set_border([60, 110, 60],[78, 120, 78]);
tokens_list.push(new_token3);

let new_element4 = document.getElementsByClassName("token")[3];
let new_token4 = new Token("starting token L", new_element4, 200, 88, 36, "c");
new_token4.health = 75;
new_token4.make_draggable();
new_token4.set_border([60, 60, 160],[78, 78, 178]);
tokens_list.push(new_token4);

let new_element5 = document.getElementsByClassName("token")[4];
let new_token5 = new Token("starting token XL", new_element5, 250, 88, 48, "d");
new_token5.health = 100;
new_token5.make_draggable();
new_token5.set_border([60, 60, 60],[78, 78, 78]);
tokens_list.push(new_token5);











console.log("");