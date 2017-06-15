/**
 * Constants
 */

var BOX_COLOR = '#b3c7ef';
var BOX_SELECTED_COLOR = '#7e93bc';
var BOX_ERROR_COLOR = '#ad3216';
var BOX_SUCCESS_COLOR = '#0e8e16';

var SHORT_TRANSITION = 100;
var MED_TRANSITION = 500;
var LONG_TRANSITION = 1000;

var WIDGET_HEIGHT = 140;

/**
 * Window
 */

var sorter;
window.onload = function() {
    sorter = new Sorter({
        'identifier': '#sort-game',
        'width': window.innerWidth,
        'height': WIDGET_HEIGHT,
        'num_elts': 8,
        'algorithms': algorithms,
        'initial': 'bubble'
    });
    sorter.draw();
};

window.addEventListener('resize', redraw);
var size_timeout;
function redraw() {
    sorter.redraw(window.innerWidth, WIDGET_HEIGHT); 
    size_timeout = setTimeout(function() {
        sorter.redraw(window.innerWidth, WIDGET_HEIGHT); 
    }, 100);
}

/**
 * Sorter
 */

var Sorter = function(opts) {
    this.identifier = opts.identifier;
    this.width = opts.width;
    this.height = opts.height;
    this.num_elts = opts.num_elts;
    this.algorithms = opts.algorithms;
    this.alg = opts.initial; // initial algorithm
}

Sorter.prototype.create_elts = function() {
    this.elts = [];
    for (var i = 1; i <= this.num_elts; i++) 
        this.elts.push(i);
    while (ordered(this.elts))
        this.elts = shuffle(this.elts);
    this.ordering = this.algorithms[this.alg]['orderer'](this.elts); 
}

// initial drawing setup
Sorter.prototype.draw = function() {
    var _this = this;
    var canvas = d3.select(this.identifier);
    canvas.selectAll('*').remove();
    
    // show headline
    this.title = canvas.append('p')
        .classed('headline', true)
        .html(this.algorithms[this.alg]['headline']);
    this.subhead = canvas.append('p')
        .classed('subhead', true)
        .html('Click on two items to swap them.');

    var svg = canvas.append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .classed('svg', true);
    this.svg = svg;

    this.box_g = svg.append('g');
    this.label_g = svg.append('g');
   
    // configuration bar 
    var settings_container = canvas.append('div')
        .classed('container', true);
    var settings = settings_container.append('div')
        .style('text-align', 'center')
        .classed('row', true);
    var alg_col = settings.append('div')
        .classed('col-xs-4', true);
    var num_col = settings.append('div')
        .classed('col-xs-4', true);
    var stats_col = settings.append('div')
        .classed('col-xs-4', true);
   
    // algorithm chooser
    var alg_chooser = alg_col.append('select');
    for (var alg in this.algorithms) {
        var choice = alg_chooser.append('option')
            .attr('value', alg)
            .html(this.algorithms[alg]['headline']);

        if (alg == this.alg)
            choice.attr('selected', 'selected');
    }
    alg_chooser.on('change', function() {
        alg = alg_chooser.property('value');
        _this.reconfigure({
            'algorithm': alg
        });
    });

    // number of points chooser
    var num_chooser = num_col.append('div')
        .classed('btn-group', true)
        .attr('role', 'group');
    this.num_elts_less = num_chooser.append('button')
        .attr('type', 'button')
        .classed('btn', true)
        .classed('btn-default', true)
        .html('-')
        .on('click', function() {
            _this.change_num_elts(_this.num_elts - 1);
        });
    this.num_elts_field = num_chooser.append('button')
        .attr('type', 'button')
        .attr('disabled', true)
        .classed('btn', true)
        .classed('btn-default', true)
        .html(this.num_elts);
    this.num_elts_more = num_chooser.append('button')
        .attr('type', 'button')
        .classed('btn', true)
        .classed('btn-default', true)
        .html('+')
        .on('click', function() {
            _this.change_num_elts(_this.num_elts + 1);
        });

    this.timer = new Timer({
        'loc': stats_col
    });
    this.timer.draw();
    this.draw_boxes();
}

// drawing of boxes, happens on each re-render
Sorter.prototype.draw_boxes = function() {
    this.timer.start();
    this.title.html(this.algorithms[this.alg]['headline']);
    this.box_g.selectAll('*').remove();
    this.label_g.selectAll('*').remove();
    this.create_elts();
    this.selected = [];  // currently selected element indices 
    
    var padding_x = 0.1 * this.width;
    var sorting_width = this.width - 2 * padding_x;
    var box_width = sorting_width / this.num_elts;
    var start_y = 0.2 * this.height;
    var box_height = 80;
    this.boxes = [];

    for (var i = 0; i < this.num_elts; i++) {
        box = new Box({
            'index': i,
            'contents': this.elts[i],
            'x': padding_x + i * box_width,
            'y': start_y,
            'svg': this.svg,
            'box_g': this.box_g,
            'label_g': this.label_g,
            'height': box_height,
            'width': box_width,
            'sorter': this
        });
        box.draw();
        this.boxes.push(box);
    }
}

// for changed algorithm or number of points
Sorter.prototype.reconfigure = function(opts) {
    if ('num_elts' in opts)
        this.num_elts = opts.num_elts;
    if ('algorithm' in opts)
        this.alg = opts.algorithm;
    this.draw_boxes();
}

// for window resizing
Sorter.prototype.redraw = function(width, height) {
    this.width = width;
    this.height = height;

    this.svg.transition()
        .attr('width', this.width)
        .attr('height', this.height);

    var padding_x = 0.1 * this.width;
    var sorting_width = this.width - 2 * padding_x;
    var box_width = sorting_width / this.num_elts;
    var start_y = 0.2 * this.height;
    var box_height = 80;

    for (var i = 0; i < this.num_elts; i++) {
        this.boxes[i].redraw({
            'x': padding_x + i * box_width,
            'y': start_y,
            'height': box_height,
            'width': box_width
        });
    }
}

Sorter.prototype.box_clicked = function(index) {

    // don't do anything if no more sort operations
    if (this.ordering.length == 0)
        return;

    this.selected.push(index);
    this.boxes[index].highlight();
    if (this.selected.length == 2) {

        var i = this.selected[0];
        var j = this.selected[1];

        // check if it matches the ordering
        var pair = i < j ? [i, j] : [j, i];
        if (this.ordering[0][0] != pair[0] ||
            this.ordering[0][1] != pair[1]) {
            
            // ordering is wrong, don't swap
            this.boxes[i].error();
            this.boxes[j].error();

        } else {

            // swap the boxes
            var x = this.boxes[i].x;
            var y = this.boxes[i].y;

            this.boxes[i].move(this.boxes[j].x,
                               this.boxes[j].y);
            this.boxes[i].index = j;
            this.boxes[j].move(x, y);
            this.boxes[j].index = i;

            var temp = this.boxes[i];
            this.boxes[i] = this.boxes[j];
            this.boxes[j] = temp;

            // update ordering, remove head
            this.ordering = this.ordering.slice(1, this.ordering.length);

            if (this.ordering.length == 0) {
                var boxes = this.boxes;
                this.timer.stop();
                setTimeout(function() {
                    for (var i = 0; i < boxes.length; i++)
                        boxes[i].success();
                }, LONG_TRANSITION);
            }
        }
        // remove all selected elements
        this.selected = [];
    }
}

Sorter.prototype.change_num_elts = function(n) {
    this.num_elts_field.html(n);
    this.num_elts_less.attr('disabled', n <= 2 ? true : null);
    this.num_elts_more.attr('disabled', n >= 10 ? true : null);
    this.reconfigure({
        'num_elts': n
    });
}

/**
 * Box
 */

var Box = function(opts) {
    this.index = opts.index;
    this.contents = opts.contents;
    this.x = opts.x;
    this.y = opts.y;
    this.svg = opts.svg;
    this.box_g = opts.box_g;
    this.label_g = opts.label_g;
    this.height = opts.height;
    this.width = opts.width;
    this.sorter = opts.sorter;
}

Box.prototype.draw = function() {
    var box = this.box_g.append('rect')
        .attr('x', this.x)
        .attr('y', this.y)
        .attr('width', this.width)
        .attr('height', this.height)
        .style('fill', BOX_COLOR)
        .classed('box', true);
    this.box = box;

    function box_clicked(b) {
        b.sorter.box_clicked(b.index);
    }
    
    box.on('click', function() {
        box_clicked(this);
    }.bind(this));

    var text = this.label_g.append('text')
        .attr('x', this.x + (this.width / 2))
        .attr('y', this.y + (this.height / 2))
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .classed('box-num', true)
        .text(this.contents);
    this.text = text;
}

Box.prototype.redraw = function(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.height = opts.height;
    this.width = opts.width;
    this.box.transition()
        .attr('x', opts.x)
        .attr('y', opts.y)
        .attr('width', opts.width)
        .attr('height', opts.height);

    this.text.transition()
        .attr('x', opts.x + (opts.width / 2))
        .attr('y', opts.y + (opts.height / 2));
}

Box.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
    this.box.transition()
        .duration(LONG_TRANSITION)
        .attr('x', x)
        .attr('y', y)
        .style('fill', BOX_COLOR);
    this.text.transition()
        .duration(LONG_TRANSITION)
        .attr('x', x + this.width / 2)
        .attr('y', y + this.height / 2);
}

Box.prototype.highlight = function() {
    this.box.style('fill', BOX_SELECTED_COLOR);
}

Box.prototype.error = function() {
    this.box.transition()
        .duration(MED_TRANSITION)
        .style('fill', BOX_ERROR_COLOR)
        .transition()
        .duration(MED_TRANSITION)
        .style('fill', BOX_COLOR);
}

Box.prototype.success = function() {
    this.box.transition()
        .duration(LONG_TRANSITION)
        .style('fill', BOX_SUCCESS_COLOR);
}

/**
 * Timer
 */

timeInterval = null;

var Timer = function(opts) {
    this.time = 0;
    this.loc = opts.loc;
}

Timer.prototype.draw = function() {
    this.label = this.loc.append('p')
        .classed('time-text', true)
        .html(time_format(this.time));
}

Timer.prototype.start = function() {
    var _this = this;
    this.time = 0;
    clearInterval(timeInterval);
    timeInterval = setInterval(function() {
        _this.time += 0.1;
        _this.label.html(time_format(_this.time));
    }, 100);
}

Timer.prototype.stop = function() {
    clearInterval(timeInterval);
}

Timer.prototype.reset = function() {
    this.stop();
    this.start();
}

/**
 * Helper Functions
 */

// https://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// returns true if array is ordered
function ordered(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1])
            return false
    }
    return true
}

function time_format(t) {
    return parseFloat(t).toFixed(1) + ' s';
}

// returns the ordering of swaps required for bubble sort
function bubble_order(arr) {
    arr = arr.slice();
    var ordering = [];
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                ordering.push([j, j+1]);
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return ordering;
}

function selection_order(arr) {
    arr = arr.slice();
    var ordering = [];
    var min_index;
    for (var i = 0; i < arr.length - 1; i++) {
        min_index = i;
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min_index])
                min_index = j;
        }
        var temp = arr[min_index];
        arr[min_index] = arr[i];
        arr[i] = temp;
        
        // no need to swap if they're the same value
        if (min_index != i)
            ordering.push([min_index, i].sort());
    }
    return ordering;
}

function insertion_order(arr) {
    arr = arr.slice();
    var ordering = [];
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            ordering.push([j, j + 1]);
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    return ordering;
}

var algorithms = {
    'bubble': {
        'headline': 'Bubble Sort',
        'orderer': bubble_order
    },
    'selection': {
        'headline': 'Selection Sort',
        'orderer': selection_order
    },
    'insertion': {
        'headline': 'Insertion Sort',
        'orderer': insertion_order
    }
}
