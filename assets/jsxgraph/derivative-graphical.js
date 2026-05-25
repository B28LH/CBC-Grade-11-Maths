var board = JXG.JSXGraph.initBoard('derivative-graphical', {
    boundingbox: [-3, 6, 3, -1],
    axis: true,
    showCopyright: false,
    showNavigation: false,
    defaultAxes: {
        x: {ticks: {insertTicks: false, ticksDistance: 1},
            name: 'x', withLabel: true,
            label: {position: 'rt', offset: [0, 15]}},
        y: {ticks: {insertTicks: false, ticksDistance: 1},
            name: 'y', withLabel: true,
            label: {position: 'rt', offset: [15, 0]}}
    }
});

var f = function(x) { return x * x; };

board.create('functiongraph', [f, -3, 3], {
    strokeColor: '#0055bb', strokeWidth: 2.5, name: ''
});

board.create('text', [1.4, 5.6, 'f(x) = x\u00B2'], {
    color: '#0055bb', fontSize: 14, fixed: true
});

var hiddenCurve = board.create('functiongraph', [f, -3, 3], {visible: false});

var P = board.create('glider', [1, 1, hiddenCurve], {
    name: '', fillColor: '#cc0000', strokeColor: '#cc0000', size: 6
});

board.create('tangent', [P], {
    strokeColor: '#cc0000', strokeWidth: 2, dash: 1
});

board.create('text', [-2.8, -0.8, function() {
    var slope = 2 * P.X();
    return 'x\u2080 \u2248 ' + P.X().toFixed(1) +
           ',\u2002 slope = ' + slope.toFixed(2);
}], {fontSize: 14, fixed: true, color: '#cc0000'});