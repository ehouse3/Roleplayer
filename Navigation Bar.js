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
window.minimize_navbar = minimize_navbar;

function home_button() {
    console.log("loading home page...");
}
window.home_button = home_button;
function board_button() {
    console.log("loading board page...");
}
window.board_button = board_button;

/* from script.js. Can get rid of
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
window.minimize_navbar = minimize_navbar;
*/