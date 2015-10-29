if (!bench.chart) bench.chart = {};

bench.chart.bubble = function() {

    var width = 600;
    var height = 600;
    var padding = 30; 
    var dispatch = d3.dispatch("select");
    var data;
    var svg, header, graph;
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

        svg = container.append("svg")
            .classed("bubble-chart", true)
            .attr({
                width: width,
                height: height
            });

        graph = svg.append("g").classed("graph", true).attr("transform", "translate("+padding+")");

        svg.append("g")
            .classed("axis", true)
            .classed("bottom-axis", true)
            .attr("transform", "translate("+padding+","+(height-padding)+")");

        svg.append("g")
            .classed("axis", true)
            .classed("left-axis", true)
            .attr("transform", "translate("+padding+",0)")

        update();
    }

    function update() {
        var serie = testSeries[selectedSerie%testSeries.length];

        var sizeValues = bench.getContentSizes(data);
        var threadsValues = bench.getThreadCounts(data);

        var d = d3.min([(width-padding*2) / sizeValues.length, (height-padding*2) / threadsValues.length]) - 2;    

        var sizeScale = d3.scale.ordinal().domain(sizeValues).rangePoints([d/2+padding,width-d/2-padding]);
        var threadsScale = d3.scale.ordinal().domain(threadsValues).rangePoints([d/2+padding,height-d/2-padding]);

        var valueScale = d3.scale.linear()
            .domain(bench.getValueExtent(data, serie))
            .range([10,d]);

        header.text(selectedSerie % testSeries.length, serie.name);

        var circles = graph
            .selectAll("circle")
            .classed("bubble", true)
            .data(data);

        var get_radius = function(test) {
            return valueScale(serie.value(test))/2 || d/4;
        }

        var get_text = function(test) {
            var value = serie.value(test);
            return value != undefined ? serie.unit(value) : "N/A";
        }

        circles
            .classed("error", function(d) {return !!d.error})
            .transition()
            .attr("r", get_radius)            

        circles
            .enter()
            .append("circle")
            .classed("bubble", true)
            .attr({
                "cx": function(d) { return sizeScale(d.content_size) },
                "cy": function(d) { return threadsScale(d.thread_count) },
                "r": get_radius
            })
            .classed("error", function(d) {return !!d.error})
            .on("click", function(d) {
                graph.selectAll("circle").classed("selected", false);
                d3.select(this).classed("selected", true);
                dispatch.select(d.id);
            });

        circles
            .exit()
            .remove();

        var labels = graph
            .selectAll("text")
            .data(data);

        labels
            .enter()
            .append("text")
            .attr({
                "x": function(d) { return sizeScale(d.content_size) },
                "y": function(d) { return threadsScale(d.thread_count) },
                "text-anchor": "middle",
                "dominant-baseline": "central",
                "pointer-events": "none"
            });

        labels
            .attr("opacity",0)
            .attr("font-size", function(d) {return valueScale(serie.value(d))/5 + "px"})
            .text(get_text)
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
