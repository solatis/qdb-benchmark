if (!bench.chart) bench.chart = {};

bench.chart.horizontal = function() {

    var width = 600;
    var height = 600;
    var padding = 30; 
    var dispatch = d3.dispatch("select");
    var data;
    var svg, graph, header;
    var selectedSerie = 0;
    var testSeries = d3.values(bench.series.tests);

    function chart(container) {

        header = bench.chart
            .selector(testSeries)
            .on("select", function(inc, absolute) {
                inc = Number(inc);
                if (absolute)
                    selectedSerie = inc;
                else
                    selectedSerie += (testSeries.length + inc) % testSeries.length;
                update();
            });
        header(container);

        svg = container
            .append("svg")
            .classed("bar-chart", true)
            .classed("horizontal-bar-chart", true)
            .attr({
                width: width,
                height: height
            });

        graph = svg
            .append("g")
            .classed("graph", true)
            .attr("transform", "translate("+padding+")");

        svg
            .append("g")
            .classed("axis", true)
            .classed("left-axis", true)
            .attr("transform", "translate("+padding+",0)");

        update();
    }

    function update() {
        var serie = testSeries[selectedSerie % testSeries.length];
        header.text(selectedSerie % testSeries.length, serie.name);

        var threadsScale = d3.scale.ordinal()
            .domain(bench.getThreadCounts(data))
            .rangeBands([padding,height-padding], 0.5);

        var valueScale = d3.scale.linear()
            .domain(bench.getValueExtent(data, serie))
            .range([padding,width-padding]);

        var bars = graph
            .selectAll("rect")
                .classed("bar", true)
                .data(data);

        bars.enter()
            .append("rect")
                .classed("bar", true)
                .attr({
                    "x": 0,
                    "y": function(d) { return threadsScale(d.thread_count) },
                    "height": threadsScale.rangeBand()
                })
                .on("click", function(d) {
                    graph.selectAll("rect").classed("selected", false);
                    d3.select(this).classed("selected", true);
                    dispatch.select(d.id);
                });

        bars
            .transition()
            .attr("width", function(d) { return valueScale(serie.value(d)) });

        var labels = graph
            .selectAll("text")
            .data(data);

        labels
            .enter()
            .append("text")
            .attr({
                "y": function(d) { return threadsScale(d.thread_count) +threadsScale.rangeBand() / 2  },
                "text-anchor": "end",
                "dominant-baseline": "central",
                "pointer-events": "none"
            });

        labels
            .text(function(d) { return serie.unit(serie.value(d)); })
            .transition()
            .attr("x", function(d) {return valueScale(serie.value(d)) - 10})

        var threadsAxis = d3.svg.axis().scale(threadsScale).orient("left").tickFormat(function(d) { return d + "t"; });
        svg.selectAll(".left-axis").call(threadsAxis);
    }

    chart.data = function(value) {
        data = value;
        return chart;
    }

    return d3.rebind(chart, dispatch, "on");
};
