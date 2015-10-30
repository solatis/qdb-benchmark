if (!bench.chart) bench.chart = {};

bench.chart.selector = function(data) {
    var dispatch = d3.dispatch("select");
    var div, select;

    var chart = function(container) {
        div = container.append("div").classed("header", true);

        div
            .append("button")
            .classed("left", true)
            .text("<")
            .on("click", function() { dispatch.select(-1, /*absolute=*/false); });
        select = div.append("select")
            .attr("name", "series-list")
            .on("change", function() {
                var selectedValue = d3.event.target.value
                dispatch.select(selectedValue, /*absolute=*/true);
            });
        div
            .append("button")
            .classed("right", true)
            .text(">")
            .on("click", function() { dispatch.select(1, /*absolute=*/false); });

        var options = select.selectAll("option")
            .data(data)
            .enter()
            .append("option");
        var v = 0;
        options.text(function (d) {
            return d.name;
        })
            .attr("value", function (d) { return v++; });
    }

    chart.text = function(value, key) {
        console.log(value, key);
        select.property("value", value);
        return chart;
    }

    return d3.rebind(chart, dispatch, "on");
}
