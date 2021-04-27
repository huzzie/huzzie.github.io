//churn customer
var data1 = [
    {group: "Existing Customer", value: 8500},
    {group: 'Churned Customer', value: 1627}
];

//gender

var data2 = [
    {group: "Male", value: 5358},
    {group: 'Female', value: 4769}
];

// dependent count
var data3 = [
    {group: '0', value: 904},
    {group: '1', value: 1838},
    {group: '2', value: 2655},
    {group: '3', value: 2732},
    {group: '4', value: 1574},
    {group: '5', value: 424}
];

// education level
var data4 = [
    {group: 'High School', value: 2013},
    {group: 'Graduate', value: 3128},
    {group: 'Uneducated', value: 1487},
    {group: 'Unknown', value: 1519},
    {group: 'College', value: 1013},
    {group: 'Post-Graduate', value: 516},
    {group: 'Doctorate', value: 451}
];

// marital status
var data5 = [
    {group: 'Married', value: 4687},
    {group: 'Single', value: 3943},
    {group: 'Unknown', value: 749},
    {group: 'Divorced', value: 748}
];

// card category
var data6 = [
    {group: 'Blue', value: 9436},
    {group: 'Gold', value: 116},
    {group: 'Silver', value: 555},
    {group: 'Platinum', value : 20}
];


var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 500 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

var svg4 = d3.select('#chart-area5')
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data1.map(function(d) { return d.group; }))
    .padding(0.2);
var xAxis = svg4.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

// Y axis

var y = d3.scaleLinear()
    .range([ height, 0]);
var yAxis = svg4.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));

// Update function
function update(data){
    // X axis
    x.domain(data.map(function(d) { return d.group; }))
    xAxis.call(d3.axisBottom(x))
    // Y axis 
    y.domain([0, d3.max(data, function(d) { return d.value }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create u variable
    var u = svg4.selectAll('rect')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('y', function(d) { return y(d.group) + y.rangeBand() / 2 + 4; })
        .attr('x', function(d) {return x(d.value) + 3 })
        .text(function(d) { return d.value})

    u 
        .enter()
        .append('rect')
        .merge(u)
        .transition()
        .duration(1000)
            .attr("x", function(d) { return x(d.group); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x.bandwidth() )
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", "#69b3a2")

    u
        .exit()
        .remove()
};

update(data1)


////////////////////////////////////////
///////////// KDE Plot////////////////
////////////////////////////////////////

var margin2 = {top2: 10, right2:100, bottom2: 30, left2: 30},
    width2 = 460 - margin2.left2 - margin2.right2,
    height2 = 400 - margin2.top2 - margin2.bottom2;


var svg2 = d3.select('#chart-area6')
    .append('svg')
        .attr('width', width2 + margin2.left2 + margin2.right2)
        .attr('height', height2 + margin2.top2 + margin2.bottom2)
    .append('g')
        .attr('transform', 'translate(' + margin2.left2 + ',' + margin2.top2 + ')');

d3.csv('data/BankChurners2.csv').then(function(data){

    var allGroups2 = ['Customer_Age', 'Months_on_book', 
                'Total_Revolving_Bal',  "Total_Amt_Chng_Q4_Q1", "Total_Trans_Ct",
                "Total_Ct_Chng_Q4_Q1","Avg_Utilization_Ratio"]


    d3.select('#selectButton2')
        .selectAll('myOptions')
        .data(allGroups2)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr('value', function(d) { return d;})

    // coloar scale for each group
    var myColor = d3.scaleOrdinal()
        .domain(allGroups2)
        .range(d3.schemeSet2);

    // Add X axis 
    var x = d3.scaleLinear()
        .range([ 0, width2 ])
        .domain([-10, 90])
    svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .range([height2, 0])
        .domain([0, 0.09]);
    svg2.append("g")
        .call(d3.axisLeft(y));

    var myColor = d3.scaleOrdinal()
        .domain(allGroups2)
        .range(d3.schemeSet2);

    // Initial line with group age
    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(60))
    var density1 =  kde( data
        .filter( function(d){return d.Attrition_Flag === "Existing Customer"} )
        .map(function(d){  return +d.Customer_Age; }) )
    var density2 =  kde( data
        .filter( function(d){return d.Attrition_Flag === "Attrited Customer"} )
        .map(function(d){  return +d.Customer_Age; }) )


    // For the changing plot!!!
    var curve1 = svg2
        .append('g')
        .append('path')
            .attr('class', 'mypath')
            .datum(density1)
            .attr("fill", "#69b3a2")
            .attr("opacity", ".8")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("d",  d3.line()
              .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
            );

    var curve2 = svg2
        .append('g')
        .append('path')
            .attr('class', 'mypath')
            .datum(density2)
            .attr("fill", "#404080")
            .attr("opacity", ".8")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
            );

    
        
        // Update the chart
        function updateChart(selectedGroup){
            //var dataFilter = data.map(function(d){return {time: d.index, value:d[selectedGroup]} })
            kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(30))

            var density1 = kde(data
                .filter ( function(d) { return d.Attrition_Flag === 'Existing Customer'})
                .map(function(d) { value: return d[selectedGroup] ; }))
            var density2 = kde(data
                .filter ( function(d) { return d.Attrition_Flag === 'Attrited Customer'})
                .map(function(d) { value: return d[selectedGroup] ; }))

            curve1
                .datum(density1)
                .transition()
                .duration(1000)
                .attr("d",  d3.line()
                .curve(d3.curveBasis)
                  .x(function(d) { return x(d[0]); })
                  .y(function(d) { return y(d[1]); })
              );

            curve2
              .datum(density2)
              .transition()
              .duration(1000)
              .attr("d",  d3.line()
              .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
            );
        }

        d3.select('#selectButton2').on('change', function(d){
            selectedGroup = this.value
            updateChart(selectedGroup)

        })

        // d3.select('#mySlider').on('change', function(d){
        //     selectedGroup = this.value
        //     updateChart(selectedGroup)

        // })

});


// create legend
svg2.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
svg2.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", "#404080")
svg2.append("text").attr("x", 320).attr("y", 30).text("Existing Customer").style("font-size", "12px").attr("alignment-baseline","middle")
svg2.append("text").attr("x", 320).attr("y", 60).text("Attrited Customer").style("font-size", "12px").attr("alignment-baseline","middle")



function kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }
  function kernelEpanechnikov(k) {
    return function(v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }