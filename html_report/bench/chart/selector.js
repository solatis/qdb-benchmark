if (typeof bench == "undefined") bench = {};
if (!bench.chart) bench.chart = {};

bench.chart.selector = function(data) {
    var dispatch = d3.dispatch("select");
    var div, select;
    var selectedSeries = 0;

    var chart = function(container) {
        div = container.append("div").classed("header", true);

        div
            .append("button")
            .classed("left", true)
            .text("<")
            .on("click", function() {
                selectedSeries = selectedSeries + data.length - 1;
                selectedSeries = selectedSeries % data.length;
                dispatch.select(selectedSeries);
            });
        select = div.append("select")
            .attr("name", "series-list")
            .on("change", function() {
                selectedSeries = d3.event.target.value
                dispatch.select(selectedSeries);
            });
        div
            .append("button")
            .classed("right", true)
            .text(">")
            .on("click", function() {
                selectedSeries = selectedSeries + 1;
                selectedSeries = selectedSeries % data.length;
                dispatch.select(selectedSeries);
            });

        select.selectAll("option")
            .data(data)
            .enter()
            .append("option")
                .text(function (d) {return d;})
                .attr("value", function (d,idx) { return idx; });
    }

    chart.text = function(value, key) {
        console.log(value, key);
        select.property("value", value);
        return chart;
    }

    chart.selected = function(value) {
        if (value === undefined) value = selectedSeries;      
        selectedSeries = value % data.length;
        return selectedSeries;
    }

    return d3.rebind(chart, dispatch, "on");
}
