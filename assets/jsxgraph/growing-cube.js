(function () {
    var board = JXG.JSXGraph.initBoard('jsxgraph-growing-cube', {
        boundingbox: [-8, 8.5, 8, -5],
        axis: false,
        showNavigation: false,
        showCopyright: false,
        pan: { enabled: false },
        zoom: { enabled: false }
    });

    // ── 3D view ───────────────────────────────────────────────────────────────
    // Position [-7,-4], size [9,8] in 2D board units.
    // 3D bounding box: x,y,z each from -0.2 to 5.2.
    var view = board.create('view3d',
        [
            [-7, -4],
            [9, 8],
            [[-0.2, 5.2], [-0.2, 5.2], [-0.2, 5.5]]
        ],
        {
            xPlaneRear: { visible: false },
            yPlaneRear: { visible: false },
            zPlaneRear: { visible: false },
            xPlaneRearYAxis: { strokeColor: '#ccc', strokeWidth: 0.5 },
            xPlaneRearZAxis: { strokeColor: '#ccc', strokeWidth: 0.5 },
            yPlaneRearXAxis: { visible: false },
            yPlaneRearZAxis: { visible: false },
            zPlaneRearXAxis: { visible: false },
            zPlaneRearYAxis: { visible: false },
            xAxis: { strokeColor: '#999', strokeWidth: 1, lastArrow: false },
            yAxis: { strokeColor: '#999', strokeWidth: 1, lastArrow: false },
            zAxis: { strokeColor: '#999', strokeWidth: 1, lastArrow: false },
            az: { slider: false, start: 40 },
            el: { slider: false, start: 22 }
        }
    );

    // ── Sliders (in 2D board space, right of the 3D view) ────────────────────
    var sx = board.create('slider', [[2.2, 7.0], [7.5, 7.0], [0.5, 2.0, 3.5]], {
        name: 'x',
        snapWidth: 0.05,
        label: { fontSize: 14, color: '#2255aa' },
        baseline: { strokeColor: '#aaa' },
        highline: { strokeColor: '#2255aa', strokeWidth: 3 },
        fillColor: '#2255aa',
        strokeColor: '#2255aa'
    });

    var sdx = board.create('slider', [[2.2, 6.2], [7.5, 6.2], [0, 0.6, 1.4]], {
        name: 'Δx',
        snapWidth: 0.05,
        label: { fontSize: 14, color: '#cc6600' },
        baseline: { strokeColor: '#aaa' },
        highline: { strokeColor: '#cc6600', strokeWidth: 3 },
        fillColor: '#cc6600',
        strokeColor: '#cc6600'
    });

    function S()  { return sx.Value(); }
    function D()  { return sdx.Value(); }
    function SD() { return sx.Value() + sdx.Value(); }

    var zero = function () { return 0; };

    // ── Helper: draw all 6 faces of a cuboid [x0,y0,z0]→[x1,y1,z1] ──────────
    function makeBox(x0f, y0f, z0f, x1f, y1f, z1f, color, opacity) {
        var vis = (opacity > 0.3)
            ? function () { return D() > 0.01; }
            : true;

        var props = {
            fillColor: color,
            fillOpacity: opacity,
            strokeColor: color,
            strokeWidth: 1.5,
            visible: vis
        };

        function pt(af, bf, cf) {
            return function () { return [af(), bf(), cf()]; };
        }

        view.create('polygon3d', [pt(x0f,y0f,z0f), pt(x1f,y0f,z0f), pt(x1f,y1f,z0f), pt(x0f,y1f,z0f)], props); // bottom
        view.create('polygon3d', [pt(x0f,y0f,z1f), pt(x1f,y0f,z1f), pt(x1f,y1f,z1f), pt(x0f,y1f,z1f)], props); // top
        view.create('polygon3d', [pt(x0f,y0f,z0f), pt(x1f,y0f,z0f), pt(x1f,y0f,z1f), pt(x0f,y0f,z1f)], props); // front
        view.create('polygon3d', [pt(x0f,y1f,z0f), pt(x1f,y1f,z0f), pt(x1f,y1f,z1f), pt(x0f,y1f,z1f)], props); // back
        view.create('polygon3d', [pt(x0f,y0f,z0f), pt(x0f,y1f,z0f), pt(x0f,y1f,z1f), pt(x0f,y0f,z1f)], props); // left
        view.create('polygon3d', [pt(x1f,y0f,z0f), pt(x1f,y1f,z0f), pt(x1f,y1f,z1f), pt(x1f,y0f,z1f)], props); // right
    }

    // ── Original cube [0,0,0] → [x,x,x] (blue) ───────────────────────────────
    makeBox(zero, zero, zero, S, S, S, '#4472C4', 0.20);

    // ── Three slabs (orange) ─────────────────────────────────────────────────
    // Top slab:   z from x to x+Δx,  x,y in [0,x]
    makeBox(zero, zero, S,  S,   S,   SD, '#ED7D31', 0.55);
    // Right slab: y from x to x+Δx,  x,z in [0,x]
    makeBox(zero, S,   zero, S,  SD,  S,  '#ED7D31', 0.55);
    // Depth slab: x from x to x+Δx,  y,z in [0,x]
    makeBox(S,   zero, zero, SD, S,   S,  '#ED7D31', 0.55);

    // ── Info panel ───────────────────────────────────────────────────────────
    board.create('text', [2.2, 5.3, 'Drag the 3D view to rotate it.'], {
        fontSize: 11, color: '#888', fixed: true
    });

    board.create('text', [2.2, 4.5, function () {
        return '\u0394V = (x+\u0394x)\u00b3 \u2212 x\u00b3 = 3x\u00b2\u0394x + 3x(\u0394x)\u00b2 + (\u0394x)\u00b3';
    }], { fontSize: 13, color: '#333', fixed: true });

    board.create('text', [2.2, 3.7, function () {
        return '\u0394V/\u0394x = 3x\u00b2 + 3x\u0394x + (\u0394x)\u00b2';
    }], { fontSize: 13, color: '#333', fixed: true });

    board.create('text', [2.2, 2.9, function () {
        var s = S();
        return 'As \u0394x \u2192 0:  dV/dx = 3x\u00b2 = ' + (3 * s * s).toFixed(2);
    }], { fontSize: 14, color: '#1a6b1a', fixed: true });
})();
