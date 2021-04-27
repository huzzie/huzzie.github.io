/////////////////////////////////////
//////////Correlation Plot///////////
/////////////////////////////////////

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom

var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('data/correlation.csv').then(function(data){
    var myGroups = d3.map(data, function(d){ return d.x;}).keys()
    var myVars = d3.map(data, function(d){ return d.y;}).keys()

    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.05);
    
    svg.append('g')
        .style('font-size', 10)
        .attr('transform', "translate(0," + height + ")")
        // need to find tick size
        .call(d3.axisBottom(x).tickSize(0))
            .selectAll('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-40)')
        .select('.domain').remove()

    // Y axis
    var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 10)
        .call(d3.axisLeft(y).tickSize(0))
            .selectAll('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-40)')
        .select(".domain").remove()
    
    // Color
    var myColor = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#B22222", "#fff", "#000080"]);

    var tooltip = d3.select('#my_dataviz')
        .append('div')
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    
    var mouseover = function(d){
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
      }
    
    var mousemove = function(d){
        tooltip
            .html('The exact value of <br> this cell is: ' + d.value)
            .style('left', (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]-30) + "px")
        }
    var mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.4)
        }
    
    svg.selectAll()
        .data(data, function(d) {return d.x+':'+d.y;})
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(d.x) })
          .attr("y", function(d) { return y(d.y) })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) { return myColor(d.value)} )
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

});


/////////////////////////////////////
///////////ROC AUC Curve/////////////
/////////////////////////////////////

var margin8 = {top8: 10, right8: 30, bottom8: 90, left8: 40},
    width8 = 460 - margin8.left8 - margin8.right8,
    height8 = 330 - margin8.top8 - margin8.bottom8;

var svg8 = d3.select('#my_dataviz2')
    .append('svg')
        .attr('width', width8 + margin8.left8 + margin8.right8)
        .attr('height', height8 + margin8.top8 + margin8.bottom8)
    .append('g')
        .attr('transform', 'translate(' + margin8.left8 + ',' + margin8.top8 + ')');

d3.csv('data/roc_data.csv').then(function(data){
    var allGroup = d3.map(data, function(d) { return (d.type)}).keys()
    // make a dropdown 
    d3.select('#selectButton8')
        .selectAll('myOptions')
            .data(allGroup)
        .enter()
            .append('option')
        .text(function(d) { return d; })
        .attr('value', function(d) { return d;})
    // set color
    var myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.fpr; }))
      .range([ 0, width]);

    svg8.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(7));

    var y = d3.scaleLinear()
      .domain( [0,d3.max(data, function(d) { return +d.tpr; })])
      .range([ height, 0 ]);
    svg8.append("g")
      .call(d3.axisLeft(y));

    var line = svg8
        .append('g')
        .append('path')
            .datum(data.filter(function(d){ return d.type ==allGroup[0]}))
            .attr("d", d3.line()
                .x(function(d) { return x(+d.fpr) })
                .y(function(d) { return y(+d.tpr) })
            )
            .attr("stroke", function(d){ return myColor("valueA") })
            .style("stroke-width", 4)
            .style("fill", "none")     

    function update(selectedGroup) {
        var dataFilter = data.filter(function(d){return d.type==selectedGroup})
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return x(d.fpr) })
                .y(function(d) { return y(+d.tpr) })
            )
            .attr("stroke", function(d){ return myColor(selectedGroup) })
        }
    
      d3.select("#selectButton8").on("change", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          update(selectedOption)
      })


});

/////////////////////////////////////
//////////Feature Importance/////////
/////////////////////////////////////

var margin9 = {top9: 100, right9: 100, bottom9: 100, left9: 100},
    width9 = 500- margin9.left9 - margin9.right9,
    height9 = 500 - margin9.left9 - margin9.bottom9

var svg9 = d3.select('#chart_FI3')
    .append('svg')
        .attr('width', width9 + margin9.left9 + margin9.right9)
        .attr('height', height9 + margin9.top9 + margin9.bottom9)
    .append('g')
        .attr('transform', 'translate(' + margin9.left9 + ',' + margin9.top9 + ')');


// read dataset

d3.csv('data/feature_importance.csv').then(function(data){

// X axis
    var x = d3.scaleBand()
    .range([ 0, width9])
    .domain(data.map(function(d) { return d.variable; }))
    .padding(1);
    svg9.append("g")
        .attr("transform", "translate(0," + height9 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-30)")
            .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height9, 0]);
    svg9.append("g")
        .call(d3.axisLeft(y));

    // Lines -KNN
    svg9.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
        .attr("x1", function(d) { return x(d.variable); })
        .attr("x2", function(d) { return x(d.variable); })
        .attr("y1", function(d) { return y(d.KNN); })
        .attr("y2", y(0))
        .attr("stroke", "grey")

    // Circles -KNN
    svg9.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function(d) { return x(d.variable); })
        .attr("cy", function(d) { return y(d.KNN); })
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")

    // Lines -DT
    svg9.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
        .attr("x1", function(d) { return x(d.variable); })
        .attr("x2", function(d) { return x(d.variable); })
        .attr("y1", function(d) { return y(d.DT); })
        .attr("y2", y(0))
        .attr("stroke", "grey")

    // Circles -DT
    svg9.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function(d) { return x(d.variable); })
        .attr("cy", function(d) { return y(d.DT); })
        .attr("r", "4")
        .style("fill", "rgb(213, 136, 136)")
        .attr("stroke", "black")

    // Lines -RF
    svg9.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
            .attr("x1", function(d) { return x(d.variable); })
            .attr("x2", function(d) { return x(d.variable); })
            .attr("y1", function(d) { return y(d.RF); })
            .attr("y2", y(0))
            .attr("stroke", "grey")
    
        // Circles -RF
        svg9.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return x(d.variable); })
            .attr("cy", function(d) { return y(d.RF); })
            .attr("r", "4")
            .style("fill", "rgb(0, 0, 128)")
            .attr("stroke", "black")
})

// create legend
svg9.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
svg9.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", "rgb(213, 136, 136)")
svg9.append("circle").attr("cx",300).attr("cy",90).attr("r", 6).style("fill", "rgb(0, 0, 128)")
svg9.append("text").attr("x", 320).attr("y", 30).text("KNN").style("font-size", "12px").attr("alignment-baseline","middle")
svg9.append("text").attr("x", 320).attr("y", 60).text("Decision Tree").style("font-size", "12px").attr("alignment-baseline","middle")
svg9.append("text").attr("x", 320).attr("y", 90).text("Random Forest").style("font-size", "12px").attr("alignment-baseline","middle")
