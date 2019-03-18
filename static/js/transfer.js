queue()
    .defer(d3.csv, "data/shanairdataNew.csv")
    .await(makeGraphs);

function makeGraphs(error, airportData) {
    var ndx = crossfilter(airportData);

    var parseDate = d3.time.format("%m").parse;

    airportData.forEach(function(d) {
        d.month = parseDate(d.month);
        d.maxtp = parseInt(d.maxtp);
        d.mintp = parseInt(d.mintp);
        d.meant = parseInt(d.meant);
        d.maxgt = parseInt(d.maxgt);



    });



    show_year_selector(ndx);
    show_total_rainfall(ndx);
    show_total_sunlight(ndx);
    show_average_temp_per_month(ndx);
    show_avg_max_temp(ndx);
    show_avg_max_temp_per_month(ndx);


    dc.renderAll();
}

/* ----------Year selector------------ */

function show_year_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('year'));
    var group = dim.group();

    dc.selectMenu("#year-selector")
        .dimension(dim)
        .group(group);
}


/*------------------- Total Rainfall Per in millimeters--------------------- */

function show_total_rainfall(ndx) {
    var year_dim = ndx.dimension(dc.pluck('year'));

    var rainfall_dim = year_dim.group().reduceSum(dc.pluck('rain'));


    dc.barChart("#total-rain-per-year")
        .width(400)
        .height(200)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(year_dim)
        .group(rainfall_dim)
        //   .valueAccessor(function(d){
        //   return d.value.average.toFixed(2);
        //  })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Years")
        .yAxis().ticks(6);
}



// -------------- Total sunlight in hours per year -----------------

function show_total_sunlight(ndx) {
    var year_dim = ndx.dimension(dc.pluck('year'));

    var rainfall_dim = year_dim.group().reduceSum(dc.pluck('sun'));


    dc.barChart("#total-sunlight-per-year")
        .width(400)
        .height(200)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(year_dim)
        .group(rainfall_dim)
        //   .valueAccessor(function(d){
        //   return d.value.average.toFixed(2);
        //  })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Years")
        .yAxis().ticks(6);
}


/* --------Line Graph AVG AIR TEMP -------------------------
Need to add custom reducer to get averages of AVERAGE AIR TEMP */



function show_average_temp_per_month(ndx) {

// MONTHS WORKING 

    var month_dim = ndx.dimension(dc.pluck('month'));

    var minMonth = month_dim.bottom(1)[0].month;

    var maxMonth = month_dim.top(1)[0].month;
    
    var year_dim =  ndx.dimension(dc.pluck('year'));

   var total_avg_temp_per_month = year_dim.group().reduceSum(dc.pluck('meant'));

// DO NOT MOVE 

    // Custom Reducer FOR AVG AIR TEMP

 var average_air_temp = year_dim.group().reduce(

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
        );
        
        
    
    
 //   var pleaseWork = average_air_temp('meant');

    //   var avgMaxTempPerMonth = month_dim.group().reduce(add_item, remove_item, initialise);
    //   var avgMaxTempPerMonth = month_dim.group().reduceSum(avg_air_temp());
 //   var dim = ndx.dimension(dc.pluck("meant"));
   // var avg_air_temp = rankByGender(dim, "meant");



    dc.lineChart("#avg-temp-per-month")
        .height(300)
        .width(600)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(year_dim)
        .group(total_avg_temp_per_month)
      //  .group(average_air_temp, "meant")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
    //    .x(d3.time.scale().domain([minMonth, maxMonth]))
        .xAxisLabel("Year")
        .yAxis().ticks(4);

}


/* ---------- Average Max Temp ----------- */


function show_avg_max_temp(ndx) {
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

    dc.barChart("#avg-max-temp-per-year")
        .width(600)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
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


//---------- Avg temp per month------------------
// --------- NOT WORKING

function show_avg_max_temp_per_month(ndx) {

    var month_dim = ndx.dimension(dc.pluck('month'));

    var minMonth = month_dim.bottom(1)[0].month;

    var maxMonth = month_dim.top(1)[0].month;

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



    var avgMaxTempPerMonth = month_dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#avg-max-temp-per-month")
        .width(600)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(month_dim)
        .group(avgMaxTempPerMonth)
        .valueAccessor(function(d) {
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.time.scale().domain([minMonth, maxMonth]))
        .xAxisLabel("Month")
        .yAxis().ticks(4);
};