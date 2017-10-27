/*
 * aq_baffle_tray.jscad
*/
function bottom_tray(holes=true, back_holes=true, side_holes=true) {
    var hole_size = 4;
    // The tray box
    var outside = CSG.cube({corner1:[0,0,0], corner2:[120,-64,20]});
    var inside = CSG.cube({corner1:[2,-2,2], corner2:[118,-62,20]});
    var tray = union(
        difference(outside, inside),
        CSG.cube({corner1:[0,0,0], corner2:[120,4,2]})
    );

    // Generate the holes in the bottom of the tray (if holes==true)
    if (holes) {
        for (x=6; x<115; x+=5) {
            for (y=-16; y>-59; y-=5) {
                // Leaving space for the bracket clip holes
                if((x==31 || x==106) && (y==-16)) {
                    continue;
                }
                tray = difference( tray,
                    CSG.cube({corner1:[x,y,0], corner2:[x+hole_size,y-hole_size,2]})
                );
                if (side_holes && x==6 && (y%2===0)) {
                    tray = difference( tray, //union(
                        CSG.cube({corner1:[0,y,9],
                                  corner2:[120,y-hole_size,9+hole_size]}));//,
                    //    CSG.cube({corner1:[0,y,9+(hole_size+1)],
                    //              corner2:[120,y-hole_size,9+(hole_size*2)+1]})
                    //));
                }
            }
            // Holes for the back of the tray
            if (back_holes && (x%3===0)) {
                tray = difference( tray, //union(
                    CSG.cube({corner1:[x,-62,9],
                              corner2:[x+hole_size,-64,9+hole_size]}));//,
                //    CSG.cube({corner1:[x,-62,9+hole_size+1],
                //              corner2:[x+hole_size,-64,9+(hole_size*2)+1]})
                //));
            }
        }
    }

    // The cutout for the back of the tray
    var cutout1 = CSG.cube({corner1:[0,0,16],corner2:[120,-2.5,20]});
    var cutout2 = CSG.cube({corner1:[41,2,101],corner2:[101,-2,2]});

    // The rails for the tray brackets
    var rail_base = CAG.fromPoints([ [0,0],[0,2],[2,2],[0,0] ]);
    var r1 = linear_extrude({height: 14}, rail_base);
    var r2 = r1.rotateY(180).translate([-2.75,0,14]);
    var left_rail = union(r1,r2).translate([34.4,-4,2]);

    // the clip holes for the tray brackets
    var brk_cut1 = CSG.cube({corner1:[31.65,-2,0],corner2:[34.4,-5.5,2]});
    var brk_cut2 = brk_cut1.translate([75,0,0]);
    var brk_cut3 = brk_cut1.translate([0,-11.5,0]);
    var brk_cut4 = brk_cut2.translate([0,-11.5,0]);

    // Put it all together and return...
    return union(
        difference(
            tray,
            union(cutout1, cutout2, brk_cut1,
                  brk_cut2, brk_cut3, brk_cut4)
        ),
        left_rail,
        left_rail.translate([75,0,0])
    );
}

function main() {
    // Passing false to bottom_tray() prevents the generation of the
    // in the bottom of the tray (for faster rendering while testing).
    return bottom_tray().translate([-60,32,0]);
}
