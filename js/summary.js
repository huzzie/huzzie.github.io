// var margin = {top: 50, right: 50, bottom: 100, left: 100},
//     width = 150 - margin.left - margin.right,
//     height = 150 - margin.top - margin.bottom

// var svg = d3.select("#my_dataviz3")
//     .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var KNN_Matrix = [
//   [335, 84],
//   [317, 1796]
// ];
// var DecisionTree_Matrix = [
//   [352, 67],
//   [122, 1991]
// ];
// var RandomForest_Matrix = [
//   [372, 47],
//   [66, 2047]
// ];

// var labels = ['0', '1'];

// // rendering the table

// function Matrix(options) {
//     var width = 250,
//         height = 250,
//         data = options.data,
//         container = options.container,
//         labelsData = options.labels,
//         startColor = options.start_color,
//         endColor = options.end_color;

//     var widthLegend = 100;

//     if(!data){
//         throw new Error('Please pass data');
//     }

//     if(!Array.isArray(data) || !data.length || !Array.isArray(data[0])){
//         throw new Error('It should be a 2-D array');
//     }

//         var maxValue = d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); });
//         var minValue = d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); });

//     var numrows = data.length;
//     var numcols = data[0].length;

//     var svg = d3.selectAll(container).append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     var background = svg.append("rect")
//         .style("stroke", "black")
//         .style("stroke-width", "2px")
//         .attr("width", width)
//         .attr("height", height);

//     var x = d3.scaleBand()
//         .domain(d3.range(numcols))
//         .range([0, width]);

//     var y = d3.scaleBand()
//         .domain(d3.range(numrows))
//         .range([0, height]);

//     var colorMap = d3.scaleLinear()
//         .domain([minValue,maxValue])
//         .range([startColor, endColor]);

//     var row = svg.selectAll(".row")
//         .data(data)
//           .enter().append("g")
//         .attr("class", "row")
//         .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

//     var cell = row.selectAll(".cell")
//         .data(function(d) { return d; })
//             .enter().append("g")
//         .attr("class", "cell")
//         .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

//     cell.append('rect')
//         .attr("width", x.bandwidth())
//         .attr("height", y.bandwidth())
//         .style("stroke-width", 0);

//     cell.append("text")
//         .attr("dy", ".32em")
//         .attr("x", x.bandwidth() / 2)
//         .attr("y", y.bandwidth() / 2)
//         .attr("text-anchor", "middle")
//         .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
//         .text(function(d, i) { return d; });

//     row.selectAll(".cell")
//         .data(function(d, i) { return data[i]; })
//         .style("fill", colorMap);

//     var labels = svg.append('g')
//         .attr('class', "labels");

//     var columnLabels = labels.selectAll(".column-label")
//         .data(labelsData)
//         .enter().append("g")
//         .attr("class", "column-label")
//         .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

//     columnLabels.append("line")
//         .style("stroke", "black")
//         .style("stroke-width", "1px")
//         .attr("x1", x.bandwidth() / 2)
//         .attr("x2", x.bandwidth() / 2)
//         .attr("y1", 0)
//         .attr("y2", 5);

//     columnLabels.append("text")
//         .attr("x", 30)
//         .attr("y", y.bandwidth() / 2)
//         .attr("dy", ".22em")
//         .attr("text-anchor", "end")
//         .attr("transform", "rotate(-60)")
//         .text(function(d, i) { return d; });

//     var rowLabels = labels.selectAll(".row-label")
//         .data(labelsData)
//       .enter().append("g")
//         .attr("class", "row-label")
//         .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

//     rowLabels.append("line")
//         .style("stroke", "black")
//         .style("stroke-width", "1px")
//         .attr("x1", 0)
//         .attr("x2", -5)
//         .attr("y1", y.bandwidth() / 2)
//         .attr("y2", y.bandwidth() / 2);

//     rowLabels.append("text")
//         .attr("x", -8)
//         .attr("y", y.bandwidth() / 2)
//         .attr("dy", ".32em")
//         .attr("text-anchor", "end")
//         .text(function(d, i) { return d; });

// };

// var matrix1 = Matrix({
//   container : '#my_dataviz3',
//   data      : KNN_Matrix,
//   labels    : labels,
//   start_color : '#ffffff',
//   end_color : '#e67e22'
// });


// var matrix2 = Matrix({
//   container : '#my_dataviz3',
//   data      : DecisionTree_Matrix,
//   labels    : labels,
//   start_color : '#ffffff',
//   end_color : '#e67e23'
// });

// var matrix3 = Matrix({
//   container : '#my_dataviz3',
//   data      : RandomForest_Matrix,
//   labels    : labels,
//   start_color : '#ffffff',
//   end_color : '#e67e22'
// });

// var df = [matrix1, matrix2, matrix3];
// var layout = {grid: {rows:1, columns:3, pattern: 'independent' }};

/////////////////////////////////////
///////////Scatter Plot/////////////
/////////////////////////////////////

var margin12 = {top12: 10, right12:30, bottom12: 90, left12: 40},
    width12 = 460 - margin12.left12 -margin12.right12,
    height12 = 330 - margin12.top12 - margin12.bottom12;


var svg12 = d3.select('#my_dataviz12')
    .append('svg')
        .attr('width', width12 + margin12.left12 + margin12.right12)
        .attr('height', height12 + margin12.top12 + margin12.bottom12)
    .append('g')
        .attr('transform', 'translate( ' + margin12.left12 + ',' + margin12.top12 + ')');


// X axis
var xScale = d3.scaleLinear()
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


d3.csv('data/BankChurners2.csv').then(function(data){
    var select = d3.select('select-button1').data[null];
    
});




/////////////////////////////////////////////////////////
////////////////// Table ////////////////////
/////////////////////////////////////////////////////////

var margin3 = {top3: 10, right3 : 30, bottom3: 10, left3: 30},
width3 = 120- margin3.left3 - margin3.right3,
height3 = 120 -margin3.top3 - margin3.bottom3;

var svg4 = d3.select('#my_dataviz2')    
    .append('svg')
        .attr("width", width3 )
        .attr("height", height3 )
    .append('g')
    .attr("transform", "translate(" + margin3.left3 + "," + margin3.top3 + ")");

//get data for the table

d3.json('data/matrix_result.json').then(function(data) { 

    //create table
    function tabulate(data, columns){
        var table = d3.select('body').append('table')
                .attr("style", "margin-left: " + 30 +"px")
                .style("border", "2px black solid")
            thread = table.append("thead"),
            tbody = table.append("tbody");

        thread.append('tr')
            .selectAll('th')
            .data(columns)
            .enter()
            .append('th')
                .text(function(column) { return column;})

        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr')

        var cells = rows.selectAll('td')
            .data(function(row){
                return columns.map(function(column) { 
                    return { column: column, value: row[column]};
                });
            }
            )
            .enter()
            .append('td')
                .text(function (d) { return d.value; });
        return table;

    }
    tabulate(data, ['Accuracy', 'Precision','Recall', 'F1'])
})

