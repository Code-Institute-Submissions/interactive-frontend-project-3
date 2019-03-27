queue()
    .defer(d3.csv, "data/shannonAirport.csv")
    .await(makeGraphs);

function makeGraphs(error, airportData) {
    var ndx = crossfilter(airportData);

    // -------- FORMATTING DATA ---------

   var parseMonth = d3.time.format("%m").parse;
    var parseYear = d3.time.format("%y").parse;


    airportData.forEach(function(d) {
        d.newmonth = parseInt(d.month);
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
    show_avg_bar_chart_test(ndx);
    show_year_selector2(ndx);

    dc.renderAll();
}


//------- YEAR SELECTOR -------

function show_year_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('year'));

    dc.selectMenu("#year-selector")
        .dimension(dim)
        .group(dim.group());
}

function show_year_selector2(ndx) {

    var dim = ndx.dimension(dc.pluck('year'));

    dc.selectMenu("#year-selector-2")
        .dimension(dim)
        .group(dim.group());
}

//--------- MONTH SELECTOR (NEEDS FORMATTING) -----------

function show_month_selector(ndx) {


  var titlemonth = ndx.dimension(function(d) {


	let m = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
	 	'August', 'September', 'October', 'November', 'December'];
       
       return m[d.newmonth-1];
   });

 
   var group = titlemonth.group();
        
    dc.selectMenu('#month-selector')
        .dimension(titlemonth)
        .group(group);
    
}

//----------- TOTAL RAINFULL BAR CHART -------

function show_total_rainfall(ndx) {


    var year_dim = ndx.dimension(dc.pluck('year'));

    var total_rainfall_year_group = year_dim.group().reduceSum(dc.pluck('rain'));


    dc.barChart("#total-rain-per-year")
        .width(450)
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
        .yAxis().ticks(12);



}

//----------- TOTAL SUNLIGHT BAR CHART -------


function show_total_sunlight(ndx) {


    var year_dim = ndx.dimension(dc.pluck('year'));

    var total_sunlight_year_group = year_dim.group().reduceSum(dc.pluck('sun'));


    dc.barChart("#total-sunlight-per-year")
        .width(450)
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
        .width(700)
        .height(450)
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

//----- AVERAGES BAR CHART MAX TEMP------

function show_avg_bar_chart_test(ndx) {

    var year_dim = ndx.dimension(dc.pluck('year'));

    var month_dim = ndx.dimension(function(d) {
        return d.month;
    });

    var min_date = month_dim.bottom(1)[0].month;
    var max_date = month_dim.top(1)[0].month;

    // Custom Reducer
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

    var avgMaxTempPerYear = year_dim.group().reduce(add_item, remove_item, initialise);
    var avgAirTempMonth = month_dim.group().reduce(add_item, remove_item, initialise);


    dc.barChart("#avg-air-temp")
        .width(700)
        .height(400)
        .margins({ top: 50, right: 50, bottom: 30, left: 50 })
        .dimension(month_dim)
        .group(avgAirTempMonth)
        .valueAccessor(function(d) {
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.time.scale().domain([min_date, d3.time.month.offset(max_date, 1)]))
        .brushOn(false)
        .yAxis().ticks(6);
}