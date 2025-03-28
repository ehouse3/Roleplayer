//remove normal scrolling
//on scroll down, sets the next element to be in the frame, then on scroll again, puts it into the middle of the frame.
var filler = document.getElementById('section_2_filler');
//filler.style.height = '0px';
var scroll_list = [0, 460, 800]; //list of each locations
var scroll_list_i = 0; //itterable
var scroll_delay_passed = true;
var delay = 600; //ms
function scroll_handler(event) {
    if(event.deltaY > 0 && scroll_list_i != scroll_list.length-1 && scroll_delay_passed == true) {
        scroll_delay_passed = false;
        scroll_list_i += 1;
        //console.log("down : " + scroll_list[scroll_list_i]);
        window.scrollTo(0, Number(scroll_list[scroll_list_i]));
        setTimeout(() => scroll_delay_passed = true, delay);
    }else if(event.deltaY < 0 && scroll_list_i != 0 && scroll_delay_passed == true){
        scroll_delay_passed = false
        scroll_list_i -= 1;
        //console.log("up : " + scroll_list[scroll_list_i]);
        window.scrollTo(0, Number(scroll_list[scroll_list_i]));
        setTimeout(() => scroll_delay_passed = true, delay);
    }
}
window.addEventListener('wheel', scroll_handler);
window.addEventListener("wheel", e => e.preventDefault(), { passive:false })



