var t_x = 100;
var t_y = 50;
var t_z = 50;

var wall = 2;

var sc_big = 7.6;
var sc_sm  = 4;
var sc_h   = 12.5;

var scb_rad = sc_big/2;
var scs_rad = sc_sm/2;

var scs_z = t_z - (10 + scs_rad);
var scb_z = t_z - ((10+12.5) - scb_rad);

function tray(holes=true) {
    // Main box
    var outside = CSG.cube({corner1:[0, 0, 0], corner2:[t_x, t_y, t_z]});
    var inside = CSG.cube({corner1:[wall,wall,wall],
                           corner2:[t_x-wall, t_y-wall, t_z]});

    return difference(
        outside,
        inside,
        suction_cup_holes(),
        tray_holes()
    );
}

function suction_cup_holes() {
    var x_cen = t_x/2;
    var sc_boff = 3.75/2;
    
    var sc_center = union(
        // Small hole
        CSG.cylinder({
            start: [t_x/2, 0, scs_z],
            end: [t_x/2, wall, scs_z],
            radius: scs_rad, resolution: 32
        }),
        CSG.cylinder({
            start: [t_x/2, 0, scb_z],
            end: [t_x/2, wall, scb_z],
            radius: scb_rad, resolution: 32
        }),
        CSG.cube({
            corner1: [x_cen-sc_boff, 0, scs_z],
            corner2: [x_cen+sc_boff, wall, scb_z]
        })
    );

    return union(
        sc_center,
        sc_center.translate([-30, 0, 0]),
        sc_center.translate([30, 0, 0])
    );
}

function tray_holes() {
    var hole_size = 4;
    var num_cols = 8;
    var num_rows = 5;

    var col_spc = t_x / num_cols;
    var row_spc = t_y / num_rows;

    col_offset = (col_spc/2)-(hole_size/2);
    row_offset = (row_spc/2)-(hole_size/2);

    var hole_arr_bott = [];
    var hole_arr_back = [];
    var hole_arr_side = [];

    // Generate the holes in the bottom of the tray
    for (x=0; x<t_x; x+=col_spc) {
        for(y=0; y<t_y; y+=row_spc ) {
            hole_arr_bott.push(CSG.cube({corner1:[x,y,0], corner2:[x+hole_size, y+hole_size, wall]}));
        }
    }
    bott_holes = union(...hole_arr_bott).translate([col_offset, row_offset, 0]);

    // Holes for the back
    for (x=0; x<t_x; x+=col_spc) {
        for(z=0; z<t_z; z+=row_spc ) {
            hole_arr_back.push(CSG.cube({corner1:[x,t_y-wall,z], corner2:[x+hole_size, t_y, z+hole_size]}));
        }
    }
    back_holes = union(...hole_arr_back).translate([col_offset, 0, row_offset]);

    var side_cols = 5;
    var side_col_spc = t_y / side_cols;
    var side_col_offset = (side_col_spc/2)-(hole_size/2);
    
    // Holes for the left side
    for (y=0; y<t_y; y+=side_col_spc) {
        for(z=0; z<t_z; z+=row_spc ) {
            hole_arr_side.push(CSG.cube({corner1:[0, y, z], corner2:[wall, y+hole_size, z+hole_size]}));
        }
    }
    side_holes = union(...hole_arr_side).translate([0, side_col_offset, row_offset]);
    
    return union(bott_holes, back_holes, side_holes, side_holes.translate([t_x-wall,0,0]));
}

function main() {
    return tray().center('x', 'y');
}