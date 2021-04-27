/*
*    main.js
*    Star Break Coffee
*/

var margin = {left: 80, right: 20, top: 50, bottom: 100}; //added

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select('#chart-area')
.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

/* EDUCATION LEVEL*/

/*
var counts = {}
d3.json('data/BankChurners.json').then(function(my_data){
    my_data.forEach(function(d){
        d.Months_Inactive_12_mon = +d.Months_Inactive_12_mon;
    });
    my_data.forEach(function(d){
        if (!counts[d.Education_Level]){
            counts[d.Education_Level] = 0;
        }
        counts[d.Education_Level]++;
    });
});

var data = d3.entries(counts);
console.log(data)
*/

/*Education Level Table*/
var category_count = d3.json('data/BankChurners.json').then(function(my_data){
    var count_data = d3.nest()
        .key(function(d) { return d.Education_Level; })
        .rollup(function(d){ return d.length })
        .entries(my_data);
        console.table(count_data)
});

/*Education Level Table*/
var category_count2 = d3.json('data/BankChurners.json').then(function(my_data){
    var count_data2 = d3.nest()
        .key(function(d) { return d.Marital_Status; })
        .rollup(function(d){ return d.length })
        .entries(my_data);
        console.table(count_data2)
});



/* AGE Histogram*/
d3.csv('data/BankChurners.csv').then(function(data){
    data.forEach(function(d){
        d.Customer_Age = +d.Customer_Age;
    })
    var sumstat= d3.nest()
    .key(function(d) { return d.Attrition_Flag; })
    .rollup(function(d) {
        q1 = d3.quantile(d.map(function(g) { return g.Customer_Age; }).sort(d3.ascending), .25)
        median = d3.quantile(d.map(function(g) { return g.Customer_Age; }).sort(d3.ascending), .5)
        q3 = d3.quantile(d.map(function(g) { return g.Customer_Age; }).sort(d3.ascending), .75)
        iQR = q3 - q1
        min = q1 -1.5*iQR
        max = q3 +1.5*iQR
        return({q1: q1, median: median, q3:q3, iQR: iQR, min: min, max:max})
    })
    .entries(data);

    var x= d3.scaleBand()
        .range([0, width])
        .domain(['Existing Customer', 'Attrited Customer'])
        .paddingInner(1)
        .paddingOuter(0.5);
    
    svg.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([20,75])
        .range([height, 0]);
    
    svg.append('g').call(d3.axisLeft(y));

    svg 
        .selectAll('vertLines')
        .data(sumstat)
        .enter()
        .append('line')
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40)

    var boxWidth = 100
    
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
            .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
            .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
            .attr("y1", function(d){return(y(d.value.median))})
            .attr("y2", function(d){return(y(d.value.median))})
            .attr("stroke", "black")
            .style("width", 80)
}) //svg



/* Donut Chart for Education Level */
var width = 500
    height = 500
    margin = 100;

var radius = Math.min(width, height ) / 2 - margin;
var svg2 = d3.select('#chart-area2')
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var data1 = {'High School': 2013, 'Graduate': 3128, 'Uneducated': 1487,
            'Unknown': 1519, 'College': 1013, 'Post-Graduate': 516, 'Doctorate': 451};

var data2 = {"Married": 4687, 'Single': 3943, 'Unknown': 749, "Divorced": 748};

var color = d3.scaleOrdinal()
    .domain(data1)
    .range(d3.schemeDark2);

function updatedata(){
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var data_ready = pie(d3.entries(data1));

var arc = d3.arc()
    .innerRadius(radius * 0.5) 
    .outerRadius(radius * 0.8);

var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

svg2 
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

svg2
    .selectAll('allPolylines')
    .data(data_ready)
    .enter()
    .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function(d) {
        var posA = arc.centroid(d) // line insertion in the slice
        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      });
svg2
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text( function(d) { console.log(d.data.key) ; return d.data.key } )
        .attr('transform', function(d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        });
    /*
function update(data){
    var pie = d3.pie()
        .value(function(d) {return d.value; })
        .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} )
    var data_ready = pie(d3.entries(data))
    var u = svg2.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .merge(u)
        .transition()
        .duration(1000)
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)
        u
        .exit()
        .remove()
};//function(update(data))

update(data1)

*/