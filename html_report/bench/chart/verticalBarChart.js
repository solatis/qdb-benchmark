if (!bench.chart) bench.chart = {};

bench.chart.verticalBarChart = function() {
    var width = 600;
    var height = 600;
    var padding = 30;
    var dispatch = d3.dispatch("select");
    var data;
    var svg, graph, selector;

    function chart(container) {
        selector = bench.chart
            .selector(d3.values(data[0].scalars).map(function(d){return d.name;}))
            .on("select", function(idx) { update(); });
        selector(container);
        selector.selected(d3.keys(data[0].scalars).indexOf("test.iterations"));

        svg = container
            .append("svg")
            .classed("bar-chart", true)
            .classed("vertical-bar-chart", true)
            .attr({
                "width": width,
                "height": height
            });

        graph = svg
            .append("g")
            .classed("graph", true)
            .attr("transform", "translate("+padding+")");

        svg.append("g")
            .classed("axis", true)
            .classed("bottom-axis", true)
            .attr("transform", "translate("+padding+","+(height-padding)+")");

        update();
    }

    function update() {
        var key = d3.keys(data[0].scalars)[selector.selected()];
        var unit = bench.units[data[0].scalars[key].unit]
        selector.text(selector.selected(), data[0].scalars[key].name);

        var getValue = function (test) {
            return test.scalars[key].value;
        }

        var xScale = d3.scale.ordinal()
            .domain(bench.computations.getContentSizes(data))
            .rangeBands([padding,width-padding], 0.5);

        var valueScale = d3.scale.linear()
            .domain(d3.extent(data, getValue))
            .range([padding,width-padding]);

        var bars = graph
            .selectAll("rect")
                .classed("bar", true)
                .data(data);

        bars.enter()
            .append("rect")
                .classed("bar", true)
                .attr("x", function(d) { return xScale(d.content_size) })
                .attr("width", xScale.rangeBand())
                .on("click", function(d) {
                    graph.selectAll("rect").classed("selected", false);
                    d3.select(this).classed("selected", true);
                    dispatch.select(d.id);
                });

        bars
            .transition()
            .attr("y", function(d) { return height-padding-valueScale(getValue(d)); })
            .attr("height", function(d) { return valueScale(getValue(d)); });

        var labels = graph
            .selectAll("text")
            .data(data);

        function labelTranform(d) {
            var x = xScale(d.content_size) + xScale.rangeBand() / 2;
            var y = height-padding-valueScale(getValue(d))+15;
            return "translate("+x+","+y+")rotate(-90)";
        }

        labels
            .enter()
            .append("text")
            .attr({
                "transform": labelTranform,
                "width": xScale.rangeBand(),
                "text-anchor": "end",
                "dominant-baseline": "central",
                "pointer-events": "none"
            });

        labels
            .text(function(d) { return unit(getValue(d)); })
            .transition()
            .attr("transform", labelTranform)

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(function(content_size) {
                return bench.units.bytes(content_size);
            });

        svg.selectAll("g.bottom-axis").call(xAxis);
    }

    chart.data = function(value) {
        data = value;
        return chart;
    }

    return d3.rebind(chart, dispatch, "on");
};
