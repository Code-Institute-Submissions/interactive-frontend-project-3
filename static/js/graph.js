queue()
    .defer(d3.csv, "data/shannonAirport.csv")
    .await(makeGraphs);

function makeGraphs(error, airportData) {
    var ndx = crossfilter(airportData);

    // -------- FORMATTING DATA ---------

    var parseMonth = d3.time.format("%m").parse;
    var parseYear = d3.time.format("%y").parse;


    airportData.forEach(function(d) {
        d.month = parseMonth(d.month);
        d.year = parseInt(d.year);
        d.maxtp = parseInt(d.maxtp);
        d.mintp = parseInt(d.mintp);
        d.meant = parseInt(d.meant);
        d.maxgt = parseInt(d.maxgt);

    });

    //------- Calling Graphs -------

    show_year_selector(ndx);
    show_month_selector(ndx);
    show_total_rainfall(ndx);
    show_total_sunlight(ndx);
    show_gust_scatter_plot(ndx);
    show_avg_temp_piechart(ndx);
    show_avg_bar_chart_test(ndx);
    show_avg_mean_temp_line(ndx);


    dc.renderAll();
}



//------- YEAR SELECTOR -------

function show_year_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group();

    dc.selectMenu("#year-selector")
        .dimension(dim)
        .group(group);
}

//--------- MONTH SELECTOR (NEEDS FORMATTING) -----------

function show_month_selector(ndx) {

    var month = ndx.dimension(function(d) {
        return [d.month];
    });

    var minMonth = month.bottom(1)[0].month;
    var maxMonth = month.top(1)[0].month;

    var group = month.group();

    dc.selectMenu("#month-selector")
        .dimension(month)
        .group(group);
}

//----------- TOTAL RAINFULL BAR CHART -------

function show_total_rainfall(ndx) {


    var year_dim = ndx.dimension(dc.pluck('year'));

    var total_rainfall_year_group = year_dim.group().reduceSum(dc.pluck('rain'));


    dc.barChart("#total-rain-per-year")
        .width(500)
        .height(300)
        .margins({ top: 40, right: 50, bottom: 30, left: 70 })
        .dimension(year_dim)
        .group(total_rainfall_year_group)

        // Below causes the bar chart to cut off the top values ¯\_(ツ)_/¯

        //   .valueAccessor(function(d) {  
        //      return d.value.toFixed(1);
        //        })
        .transitionDuration(500)
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Years")
        .yAxis().ticks(12);
        


}

//----------- TOTAL SUNLIGHT BAR CHART -------


function show_total_sunlight(ndx) {


    var year_dim = ndx.dimension(dc.pluck('year'));

    var total_sunlight_year_group = year_dim.group().reduceSum(dc.pluck('sun'));


    dc.barChart("#total-sunlight-per-year")
        .width(500)
        .height(300)
        .margins({ top: 40, right: 50, bottom: 30, left: 70 })
        .elasticY(true)
        .dimension(year_dim)
        .group(total_sunlight_year_group)
     //   .valueAccessor(function(d) {
     //       return d.value.toFixed(1);
     //   })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Years")
        .yAxis().ticks(12);
}

//------ GUST CATTER PLOT --------

function show_gust_scatter_plot(ndx) {

    var month_dim = ndx.dimension(function(d) {
        return d.month;
    });


    var yearColors = d3.scale.linear()
        .domain([2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018])
        .range(["pink", "green", "blue", "yellow", "purple", "gray", "red", "orange", "violet", "brown", "black", "blue"]);

    var min_date = month_dim.bottom(1)[0].month;
    var max_date = month_dim.top(1)[0].month;

    var highest_gust_dim = ndx.dimension(function(d) {
        return [d.month, d.maxgt, d.year];
    });

    var highest_gust_group = highest_gust_dim.group();

    var gust_chart = dc.scatterPlot("#maxgt-scatter-plot");

    gust_chart
        .width(768)
        .height(500)
        .margins({ top: 40, right: 50, bottom: 30, left: 50 })
        .x(d3.time.scale().domain([min_date, max_date]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("Gust (knots)")
        .title(function(d) {
            return d.key[2];
        })
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(yearColors)
        .dimension(highest_gust_dim)
        .group(highest_gust_group);


}

//------ AVERAGE MAX & MIN TEMP PIE CHART NOT WORKING--------


function show_avg_temp_piechart(ndx) {

    var maxtemp_dim = ndx.dimension(dc.pluck('maxtp'));
    var mintemp_dim = ndx.dimension(dc.pluck('mintp'));

    var max_temp_dim = ndx.dimension(function(d) {
        return d.maxtp;
    });

    var min_temp_dim = ndx.dimension(function(d) {
        return d.mintp;
    });



    //  var new_maxtemp_dim = ndx.dimension(function(d) {
    //        return [d.maxgt, d.year];
    //  });

    //   var new_maxtemp_group = new_maxtemp_dim.group().reduceSum(dc.pluck('maxgt'))

    var maxtemp_group = maxtemp_dim.group();

    var mintemp_group = mintemp_dim.group();


    dc.pieChart('#avg-temp-piechart')
        .height(400)
        .radius(100)
        .transitionDuration(1500)
        .dimension(maxtemp_dim)
        .group(maxtemp_group);



    dc.pieChart('#per-store-chart')
        .height(400)
        .radius(100)
        .transitionDuration(1500)
        .dimension(mintemp_dim)
        .group(mintemp_group);

}


//----- AVERAGES BAR CHART MAX TEMP------

function show_avg_bar_chart_test(ndx) {
    var year_dim = ndx.dimension(dc.pluck('year'));


    // Custom Reducer
    function add_item(p, v) {
        p.count++;
        p.total += v.maxtp;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
            p.average = 0;
        }
        else {
            p.total -= v.maxtp;
            p.average = p.total / p.count;
        }
        return p;
    }

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }

    var avgMaxTempPerYear = year_dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#avg-max-temp-test")
        .width(500)
        .height(300)
        .margins({ top: 50, right: 50, bottom: 30, left: 50 })
        .dimension(year_dim)
        .group(avgMaxTempPerYear)
        .valueAccessor(function(d) {
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Years")
        .yAxis().ticks(4);
}


//----- AVG MEAN AIR TEMP LINE GRAPH------


function show_avg_mean_temp_line(ndx) {

    var year_dim = ndx.dimension(dc.pluck('year'));


    var month_dim = ndx.dimension(dc.pluck('month'));
    
    var air_temp_dim = ndx.dimension(dc.pluck('meant'));


    var total_avg_air_temp_group = month_dim.group().reduceSum(dc.pluck('meant'));

    var minDate = month_dim.bottom(1)[0].month;
    var maxDate = month_dim.top(1)[0].month;
    
    
    //----------CUSTOM REDUCER TEST ONE------------

    function add_item(p, v) {
        p.count++;
        p.total += v.meant;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
            p.average = 0;
        }
        else {
            p.total -= v.meant;
            p.average = p.total / p.count;
        }
        return p;
    }

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }
    
    //---TESTING ADDING REDUER INSIDE ANOTHER FUNCTION---------------

     var new_avg_air_temp_group = month_dim.group().reduce(add_item, remove_item, initialise);
        
    function avgAirTemp(dimension, meant) {
        return month_dim.group().reduce(
            
        function add_item(p, v) {
        p.count++;
        p.total += v.meant;
        p.average = p.total / p.count;
        return p;
    },

    function remove_item(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
            p.average = 0;
        }
        else {
            p.total -= v.meant;
            p.average = p.total / p.count;
        }
        return p;
    },

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }

        //END OF TEST
        
        );
}


var new_new_avg_air_temp = avgAirTemp("meant");
        //END OF TEST
        
        
//----GRAPH 

    dc.lineChart("#avg_air_temp_line")
        .width(750)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(month_dim)
        .group(new_new_avg_air_temp, "meant")
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
      //  .xUnits(dc.units.ordinal)
        .xAxisLabel("Month")
        .brushOn(false)
        .yAxis().ticks(4);
        
    
}