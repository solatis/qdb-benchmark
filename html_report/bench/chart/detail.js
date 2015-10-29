if (!bench.chart) bench.chart = {};

bench.chart.lineChart = function() {

    var width = 600;
    var height = 600;
    var leftPadding = 80; 
    var rightPadding = 80; 
    var padding = 30; 
    var data;
    var svg, header;

    var headerHeight = 30;
    var headerWidth = 300;
    var selectedSerie = 0;

    var series = lineSeries;

    function chart(container) {

        header = bench.chart
            .selector(series)
            .on("select", function(inc, absolute) {
                inc = Number(inc);
                if (absolute)
                    selectedSerie = inc;
                else
                    selectedSerie += series.length + inc;
                    selectedSerie += (series.length + inc) % series.length;
                update();
            });
        header(container);

        svg = container.append("svg")
            .classed("line-chart", true)
            .attr({
                "viewBox": "0 0 "+width+" "+height,
                "preserveAspectRatio": "xMinYMin meet"
            });

        svg.append("g").classed("graph", true).attr("transform", "translate("+leftPadding+")");
        svg.append("g").classed("axis", true).classed("x-axis", true).attr("transform", "translate("+leftPadding+","+(height-padding)+")");
        svg.append("g").classed("axis", true).classed("left-axis", true).attr("transform", "translate("+leftPadding+")");

        update();
    }

    chart.update = update;
    function update() {
        var serie = series[selectedSerie % series.length];
        header.text(selectedSerie % series.length, serie.name);

        var lines = serie.lines(data);
        var timeMax = d3.max(lines[0], function(d){return d.time})

        var timeScale = d3.scale.linear()
            .domain([0, timeMax])
            .range([0, width-leftPadding-rightPadding]);

        var valueMax = d3.max(lines, function(points) {
            return d3.max(points, function(d) {
                return d.value;
            });
        });
        var valueMin = d3.min(lines, function(points) {
            return d3.min(points, function(d) {
                return d.value;
            });
        });

        if (valueMin == valueMax) {
            if (valueMin == 0) {
                valueMin = -0.001;
                valueMax = 0.001;
            } else {
                valueMin *= 0.9;
                valueMax *= 1.1;
            }
        }

        var valueScale = d3.scale.linear()
            .domain([valueMin, valueMax])
            .range([height-padding, 0]);

        var lineFunc = d3.svg.line()
            .x(function(d) { return timeScale(d.time); })
            .y(function(d) { return valueScale(d.value); })
            .interpolate("linear");

        var paths = svg.select(".graph")
            .selectAll("path")
            .classed("line", true)
            .data(lines);

        paths
            .transition()
            .attr("d", function(d) { return lineFunc(d); })

        paths
            .enter()
            .append("path")
            .classed("line", true)
            .attr("opacity", 0)
            .attr("d", function(d) { return lineFunc(d); })
            .transition()
            .attr("opacity", 1)

        paths
            .exit()
            .transition()
            .attr("opacity", 0)
            .remove();

        var timeAxis = d3.svg.axis().scale(timeScale).orient("bottom")
          .tickFormat(function(d) { return unit.millisecond(d); }) ;

        svg.selectAll(".x-axis").call(timeAxis);

        var valueAxis = d3.svg.axis().scale(valueScale).orient("left")
            .tickFormat(function(d) { return serie.unit(d); })
        svg.selectAll(".left-axis").call(valueAxis); 
    }

    chart.data = function(value) {
        data = value;
        return chart;
    }

    return chart;
};
