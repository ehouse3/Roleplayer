import {Token} from './Token.js'
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

var minimize_navbar_button = document.getElementsByClassName("minimize_navbar_button")[0]; //button itself
var minimize_navbar_button_width = Number(window.getComputedStyle(minimize_navbar_button).width.split('px')[0]); //button width

var minimize_navbar_seperator = document.getElementsByClassName("minimize_navbar_seperator")[0]; //seperator
var minimize_navbar_seperator_width = Number(window.getComputedStyle(minimize_navbar_seperator).width.split('px')[0]); //seperator width

var amount = navbar_width - minimize_navbar_button_width - minimize_navbar_seperator_width; //amount to minimize such that button still shows
var navbar_minimized = false;
function minimize_navbar() { //called by buttonpress on navbar
    if(!navbar_minimized) { //determines how far it needs to scroll and adjusts margin-left to move it offscreen
        navbar.style.setProperty("margin-left", "-" + amount + "px");
        minimize_navbar_button.innerHTML = "&gt";
        navbar_minimized = true;
    } else { //return margin-left to 0px
        navbar.style.setProperty("margin-left", "0px");
        minimize_navbar_button.innerHTML = "&lt"
        navbar_minimized = false;
    }
}

//minimize token-information
//calculating how far to minimize the tab
var token_information = document.getElementById("token_information");
var token_information_width = Number(window.getComputedStyle(token_information).width.split('px')[0]); //total width

var minimize_token_information_button = document.getElementsByClassName("minimize_token_information_button")[0]; //button itself
var minimize_token_information_width = Number(window.getComputedStyle(minimize_token_information_button).width.split('px')[0]); //button width
var minimize_token_information_border_width = Number(window.getComputedStyle(minimize_token_information_button).borderLeft.split('px')[0]); //border width

var minimize_amount = (token_information_width - minimize_token_information_width) - minimize_token_information_border_width; //amount to minimize such that button still shows
let token_information_minimized = true;
function minimize_token_information() { //called by buttonpress on token information bar
    if(!token_information_minimized) {
        token_information.style.setProperty("margin-left", "-" + minimize_amount + "px");
        minimize_token_information_button.innerHTML = "&gt";
        token_information_minimized = true;
    } else {
        token_information.style.setProperty("margin-left", "0px");
        minimize_token_information_button.innerHTML = "&lt";
        token_information_minimized = false;
    }
}

var cur_displayed_token = '';
var name_element = document.getElementById("name");
var health_element = document.getElementById("health");
var mana_element = document.getElementById("mana");
var size_element = document.getElementById("size");
function update_token_information() {
    if(!cur_displayed_token.name) { //if undefined
        name_element.innerHTML = "token name";
        health_element.innerHTML = "health points";
        mana_element.innerHTML = "mana points";
        size_element.innerHTML = "size";
    } else {
        name_element.innerHTML = cur_displayed_token.name;
        health_element.innerHTML = "hp : " + cur_displayed_token.health;
        mana_element.innerHTML = "mp : " + cur_displayed_token.mana;
        size_element.innerHTML = "size : " + cur_displayed_token.width;
    }
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
    if(panning){
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
var cur_y = 0;
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
                selected_tokens_list.push(tokens_list[token_i]);
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
function delete_token() { //
    console.log("removing token");
    if(cur_displayed_token && selected_tokens_list.length == 0) {
        let index = tokens_list.indexOf(cur_displayed_token);
        tokens_list.splice(index, 1);

        cur_displayed_token.remove_draggable(); //remove listener
        cur_displayed_token.element_parent.remove(); //remove element
        //delete cur_displayed_token; //FIX
        cur_displayed_token = '';
        update_token_information();
    } else {
        for(var token_i = 0; token_i < selected_tokens_list.length; token_i++) {        
            let index = tokens_list.indexOf(selected_tokens_list[token_i]);
            tokens_list.splice(index, 1);

            selected_tokens_list[token_i].remove_draggable(); //remove listener
            selected_tokens_list[token_i].element_parent.remove(); //remove element
            delete selected_tokens_list[token_i]; //garbage collection would reclaim anyway

        }
        selected_tokens_list = [];

    }
}
function toggle_token_movement() {
    console.log("toggling token movement");
    

}



//creating starting tokens
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













console.log("RUNNING SCRIPT");