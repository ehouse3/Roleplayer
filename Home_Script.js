//navbar
function home_button() {
    console.log("loading home page...");
}
function board_button() {
    console.log("loading board page...");
}

//minimize navbar
var navbar = document.getElementById("navbar");
var minimize_navbar = document.getElementsByClassName("minimize_navbar")[0];
var minimize_navbar_seperator = document.getElementsByClassName("minimize_navbar_seperator")[0];
var minimize_navbar_inner = document.getElementsByClassName("navbar_li_a")[2];
var minimized = false;
//called by buttonpress
function move_navbar_button() {
    if(!minimized) { //determines how far it needs to scroll and adjusts margin-left to move it offscreen
        var navbar_width = Number(window.getComputedStyle(navbar).width.slice(0, -2));
        var minimize_navbar_width = Number(window.getComputedStyle(minimize_navbar).width.slice(0, -2));
        var minimize_navbar_seperator_width = Number(window.getComputedStyle(minimize_navbar_seperator).width.slice(0, -2));
        var amount = navbar_width - minimize_navbar_width - minimize_navbar_seperator_width;

        navbar.style.setProperty("margin-left", "-" + amount + "px");
        minimize_navbar_inner.innerHTML = "&gt"
        minimized = true;
    } else { //return margin-left to 0px
        navbar.style.setProperty("margin-left", "0px");
        minimize_navbar_inner.innerHTML = "&lt"
        minimized = false;
    }
}

