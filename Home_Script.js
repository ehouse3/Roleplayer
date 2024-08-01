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
var minimize_navbar_inner = document.getElementsByClassName("minimize_navbar_li_a")[0];
var navbar_minimized = true;
//called by buttonpress
function move_navbar_button() {
    if(!navbar_minimized) { //determines how far it needs to scroll and adjusts margin-left to move it offscreen
        var navbar_width = Number(window.getComputedStyle(navbar).width.slice(0, -2));
        var minimize_navbar_width = Number(window.getComputedStyle(minimize_navbar).width.slice(0, -2));
        var minimize_navbar_seperator_width = Number(window.getComputedStyle(minimize_navbar_seperator).width.slice(0, -2));
        var amount = navbar_width - minimize_navbar_width - minimize_navbar_seperator_width;

        navbar.style.setProperty("margin-left", "-" + amount + "px");
        minimize_navbar_inner.innerHTML = "&gt";
        navbar_minimized = true;
    } else { //return margin-left to 0px
        navbar.style.setProperty("margin-left", "0px");
        minimize_navbar_inner.innerHTML = "&lt"
        navbar_minimized = false;
    }
}

//remove normal scrolling
//on scroll down, sets the next element to be in the frame, then on scroll again, puts it into the middle of the frame.
var filler = document.getElementById('section_2_filler');
//filler.style.height = '0px';
var scroll_list = [0, 460]; //list of each locations
var scroll_list_i = 0; //itterable
var scroll_delay_passed = true;
function scroll_handler(event) {
    if(event.deltaY > 0 && scroll_list_i != scroll_list.length-1 && scroll_delay_passed == true) {
        scroll_delay_passed = false;
        scroll_list_i += 1;
        console.log("down : " + scroll_list[scroll_list_i]);
        window.scrollTo(0, Number(scroll_list[scroll_list_i]));
        setTimeout(() => scroll_delay_passed = true, 125);
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



