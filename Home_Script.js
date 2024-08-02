//navbar
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

//remove normal scrolling
//on scroll down, sets the next element to be in the frame, then on scroll again, puts it into the middle of the frame.
var filler = document.getElementById('section_2_filler');
//filler.style.height = '0px';
var scroll_list = [0, 460, 800]; //list of each locations
var scroll_list_i = 0; //itterable
var scroll_delay_passed = true;
function scroll_handler(event) {
    if(event.deltaY > 0 && scroll_list_i != scroll_list.length-1 && scroll_delay_passed == true) {
        scroll_delay_passed = false;
        scroll_list_i += 1;
        console.log("down : " + scroll_list[scroll_list_i]);
        window.scrollTo(0, Number(scroll_list[scroll_list_i]));
        setTimeout(() => scroll_delay_passed = true, 250);
    }else if(event.deltaY < 0 && scroll_list_i != 0 && scroll_delay_passed == true){
        scroll_delay_passed = false
        scroll_list_i -= 1;
        console.log("up : " + scroll_list[scroll_list_i]);
        window.scrollTo(0, Number(scroll_list[scroll_list_i]));
        setTimeout(() => scroll_delay_passed = true, 500);
    }
}
window.addEventListener('wheel', scroll_handler);
//window.scrollTo(0, 450);
window.addEventListener("wheel", e => e.preventDefault(), { passive:false })



