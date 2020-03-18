var width = 900;
var height = 800;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", height);


var cola = cola.d3adaptor(d3)
    .linkDistance(8)
    .avoidOverlaps(true)
    .handleDisconnected(false)
    .size([width, height]);

d3.json("courses.json", function (error, graph) {

    graph.nodes.forEach(function (v) {
        v.width = v.name.length * 10;
        if (v.width < 95){
            v.width = 95
        }
        v.height = 95;
    })

    graph.groups.forEach(function (g) { g.padding = 0.01; });
    cola
        .nodes(graph.nodes)
        .links(graph.links)
        .groups(graph.groups)
        .start(100, 0, 50, 50);

    var group = svg.selectAll(".group")
        .data(graph.groups)
      .enter().append("rect")
        .attr("rx", 8).attr("ry", 8)
        .attr("class", "group")
        .style("fill", function (d, i) { return color(i); });

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link");

    var pad = 20;
    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("rect")
        .attr("class", "node")
        .attr("width", function (d) { return d.width - 2 * pad; })
        .attr("height", function (d) { return d.height - 2 * pad; })
        .attr("rx", 5).attr("ry", 5)
        .style("fill", function (d) { return color(graph.groups.length); })
        .call(cola.drag)
        .on('mouseup', function (d) {
            d.fixed = true;
            cola.alpha(1); // fire it off again to satify gridify
        });

    var label = svg.selectAll(".label")
        .data(graph.nodes)
       .enter().append("text")
        .attr("class", "label")
        .text(function (d) { return d.name; })
        .call(cola.drag);

    node.append("title")
        .text(function (d) { return d.name; });

    cola.on("tick", function () {
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("x", function (d) {
            //hold nodes inside groups. Use d3.forceX([x])
            return d.x - d.width / 2 + pad
            })
             .attr("y", function (d) {
                 return d.y - d.height / 2 + pad
             });
/*            .attr("y",function (d, i) {
                return i*10
            })*/

        group.attr("x", function (d, i) { return i * 250 }) //hard-coded
             // .attr("y", function (d) { return d.bounds.y; })
            .attr('y', 50) //hard-coded
            // .attr("width", function (d) { return d.bounds.width(); })
            .attr("width", 250) //hard-coded
            // .attr("height", function (d) { return d.bounds.height(); });
            .attr("height", 800) //hard-coded
        label.attr("x", function (d) { return d.x; })
             .attr("y", function (d) {
                 var h = this.getBBox().height;
                 return d.y + h/4;
             });
    });
});
