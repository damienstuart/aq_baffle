/*
 * aq_baffle.jscad
*/

function bottom_tray() {
    var outside = CSG.cube({corner1:[0,0,0], corner2:[120,-64,16]});
    var inside = CSG.cube({corner1:[2,-2,2], corner2:[118,-62,16]});
    var tray = union(
        difference(outside, inside),
        CSG.cube({corner1:[0,0,0], corner2:[120,4,2]})
    );

    for (x=5; x<116; x+=4) {
        for (y=-15; y>-62; y-=4) {
            tray = difference(
                tray,
                CSG.cube({corner1:[x,y,0], corner2:[x+2,y-2,2]})
            )
        }
    }

    var cutout1 = CSG.cube({corner1:[41,2,101],corner2:[101,-2,2]});
    return difference(tray, cutout1);
}

function brackets() {
    var base = CAG.fromPoints([ [0,0],[0,32],[-1.5,32],[-2.5,29],[-3,29],
                                [-3,34],[2,34],[8,0],[0,0] ]);
    var brkt1 = linear_extrude({height: 2.5}, base);
    var bracket = brkt1.rotateX(90).rotateZ(-90).translate([36,-2,2]);
    return union(bracket, bracket.translate([73,0,0]));
}

function main() {
    return union(
        bottom_tray(),
        brackets()
    );
}
