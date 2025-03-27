export class Token {
    /*
    class to create a movable and storable token objects:
    name: name of the token
    element: html element
    cur_x: current x coordinate
    cur_y: current y coordinate
    width: width of token (multiple of 12)
    unique_id: id assigned to distinguish tokens (element attribute)
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
        }

        this._unique_id = unique_id;
        this.element_parent.id = this.unique_id;
        
        this.set_position(cur_x, cur_y); //called in constructor to update the start position
        this.dragging = null; //currently dragging
        this._selected = false;
        this.previous_border_0 = '';
        this.previous_border_1 = '';
        this._movement_allowed = true; //intermittent movement check for dragging

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
        let grid_width = 2000;
        let grid_height = 1000;

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
        this.element_parent.parentElement.removeEventListener('pointerdown', this.start_drag);
        this.element_parent.parentElement.removeEventListener('pointerup', this.end_drag);
        this.element_parent.parentElement.removeEventListener('pointercancel', this.end_drag);
        this.element_parent.parentElement.removeEventListener('pointermove', this.move_drag);
        this.element_parent.parentElement.removeEventListener('touchstart', (event) => event.preventDefault());
        
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