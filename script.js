'use strict';

var table;
var language;

function popTable(e) {
    table.state = e.currentTarget.state;
    table.getElementsByTagName('th')[0].textContent = table.state.name;
    table.style.display = 'table';
    table.style.left = e.clientX + 'px';
    table.style.top = e.clientY + 'px';
    e.stopPropagation();
}

function handleSelect(e) {
    var select = +e.currentTarget.getAttribute('data-level');
    table.state.level = select;
    table.state.graph.attr({fill : color[select]});
    document.getElementById('level').textContent = calculate();
    table.style.display = 'none';
}

var color = ['#d3d3d3','#3598db', '#30cc70', '#f3c218', '#d58337', '#e84c3d'];

function calculate() {
    var sum = 0;
    for (var state in usMap) {
        sum += usMap[state].level;
    }
    return sum;
}

window.onload = function () {
    table = document.getElementById('table');
    var map = new Raphael('map',1000, 900);
    var attr = {
            "fill": "#d3d3d3",
            "stroke": "#fff",
            "stroke-opacity": "1",
            "stroke-linejoin": "round",
            "stroke-miterlimit": "4",
            "stroke-width": "0.75",
            "stroke-dasharray": "none"
        };


    for (var key in usMap) {
        var state = usMap[key]
        var path = state.path;
        var graph = map.path(path);
        graph.attr(attr);
        state.graph = graph;
        state.level = 0;
        var x = graph.getBBox().x + graph.getBBox().width / 2 + state.offset.x;
        var y = graph.getBBox().y + graph.getBBox().height / 2 + state.offset.y;
        var text = map.text(x, y, key);
        [graph, text].forEach(
            function (e) {
                e.attr({cursor : 'pointer'});
                e[0].onclick = popTable;
                e[0].state = state;
            }
        );
    }

    Array.from(document.getElementsByClassName('select')).forEach(
        function (select) {
            select.style.backgroundColor = color[select.getAttribute('data-level')];
            select.onclick = handleSelect;
        }
    );

    document.getElementsByTagName('html')[0].onclick = function () {
        table.style.display = 'none';
    };
};

