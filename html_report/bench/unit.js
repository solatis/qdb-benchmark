var unit = (function(){

    function formatValue(value, div, unit) {
        value = parseFloat(value);
        var mulipliers = ["", "k", "M", "G", "T", "P"];
        var m = 0;
        while ((value>=div || value<=-div) && m<mulipliers.length-1) {
            value/=div;
            m++;
        }
        var suffix = " " + mulipliers[m] + unit;
        if (value < 10) return value.toFixed(1) + suffix;
        else return value.toFixed(0) + suffix;
    }

    return {
        none: function(x) {
            return formatValue(x, 1000, "")
        },

        byte: function(x) {
            return formatValue(x, 1024, "B")
        },

        byte_per_second: function(x) {
            return formatValue(x, 1024, "B/s");
        },

        kilobyte_per_second: function(x) {
            return formatValue(x*1000, 1024, "B/s");
        },

        hertz: function(x) {
            return formatValue(x, 1000, "Hz");
        },

        kilohertz: function(x) {
            return formatValue(x*1000, 1000, "Hz");
        },

        millisecond: function(x) {
            return formatValue(x/1000.0, 1000, "s")
        }
    }
})();