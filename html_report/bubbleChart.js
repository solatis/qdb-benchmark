if (!d3.chart) d3.chart = {};

d3.chart.bubbleChart = function() {

    var width = 600;
    var height = 600;
    var padding = 30; 
    var dispatch = d3.dispatch(chart, "select");
    var data;
    var svg, header, graph;
    var selectedSerie = 0;

    function chart(container) {

        header = container.append("div").classed("header", true);
        header.append("button").classed("left", true).on("click", function() {
            selectedSerie+=testSeries.length-1;
            update();
        });
        header.append("span");
        header.append("button").classed("right", true).on("click", function() {
            selectedSerie++;
            update();
        });

        svg = container.append("svg")
            .classed("bubble-chart", true)
            .attr({
                width: width,
                height: height
            });

        graph = svg.append("g").classed("graph", true).attr("transform", "translate("+padding+")");
        svg.append("g").classed("axis", true).classed("bottom-axis", true).attr("transform", "translate("+padding+","+(height-padding)+")");
        svg.append("g").classed("axis", true).classed("left-axis", true).attr("transform", "translate("+padding+",0)")

        update();
    }

    function update() {

        var serie = testSeries[selectedSerie%testSeries.length];
        var points = data.map(function(test){
            return {
                id: test.id,
                threads: test.threads[0].length-1,
                size: test.content_size,
                value: serie.value(test)
            }});

        var sizeValues = d3.set(points.map(function(d){return d.size})).values();
        var threadsValues = d3.set(points.map(function(d){return d.threads})).values();
        var speedExtent = d3.extent(points, function(d) {return d.value});

        var d = d3.min([(width-padding*2) / sizeValues.length, (height-padding*2) / threadsValues.length]) - 2;    

        var sizeScale = d3.scale.ordinal().domain(sizeValues).rangePoints([d/2+padding,width-d/2-padding]);
        var threadsScale = d3.scale.ordinal().domain(threadsValues).rangePoints([d/2+padding,height-d/2-padding]);
        var speedScale = d3.scale.linear().domain(speedExtent).range([10,d]);

        header.selectAll("span").text(serie.name);

        var circles = graph
            .selectAll("circle")
            .classed("bubble", true)
            .data(points);

        circles
            .transition()
            .attr("r", function(d) { return speedScale(d.value)/2;});

        circles
            .enter()
            .append("circle")
            .classed("bubble", true)
            .attr({
                cx: function(d) { return sizeScale(d.size) },
                cy: function(d) { return threadsScale(d.threads) },
                r: function(d) { return speedScale(d.value)/2 }
            })
            .on("click", function(d) {
                graph.selectAll("circle").classed("selected", false);
                d3.select(this).classed("selected", true);
                dispatch.select(d.id);
            });

        circles
            .exit()
            .remove();

        console.log([d3.max(points, function(p){return p.value})])

        var labels = graph
            .selectAll("text")
            .data(points);

        labels
            .enter()
            .append("text")
            .attr({
                "x": function(d) { return sizeScale(d.size) },
                "y": function(d) { return threadsScale(d.threads) },
                "text-anchor": "middle",
                "dominant-baseline": "central",
                "pointer-events": "none"
            });

        labels
            .attr("opacity",0)
            .attr("font-size", function(d) {return speedScale(d.value)/5 + "px"})
            .text(function(d){
                return serie.unit(d.value)
            })
            .transition()
            .attr("opacity",1)

        var sizeAxis = d3.svg.axis().scale(sizeScale).orient("bottom").tickFormat(function(d) { return unit.byte(d); });
        svg.select("g.bottom-axis").call(sizeAxis);

        var threadsAxis = d3.svg.axis().scale(threadsScale).orient("left").tickFormat(function(d) { return d + "t"; });
        svg.select("g.left-axis").call(threadsAxis);
    }

    chart.data = function(value) {
        data = value;
    }
    return d3.rebind(chart, dispatch, "on");
};
