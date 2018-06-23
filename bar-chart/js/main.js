/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

var margin = { left: 100, top: 20, right: 10, bottom: 100 };

var width = 600 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('#chart-area')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//X label
g.append("text")
    .attr("class", "x axis label")
    .attr("x", width/2)
    .attr("y", height+100)
    .attr("style","font-size: 20px")
    .attr("text-anchor", "middle")
    .text("The World's tallest buildings");

// Y Label
g.append("text")
    .attr("class", "y axis label")
    .attr("x", - (height/2))
    .attr("y", -60)
    .attr("style","font-size: 20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Height (m)");

d3.json('data/buildings.json').then(function (data) {
    data.forEach(d => {
        d.height = +d.height;
    })

    var x = d3.scaleBand()
        .domain(data.map(d => {
            return d.name;
        }))
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => {
            return d.height;
        })])
        .range([height, 0]);

    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
        .attr("x", "-5")
        .attr("y", "10")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
        // .tickValues([100, 300, 500, 600, 800])
        .tickFormat(d => { 
            return d + 'm'; 
        });
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    var rects = g.selectAll('rect')
        .data(data);

    var rect = rects.enter()
        .append('rect')
        .attr("x", (d) => {
            return x(d.name);
        })
        .attr("y", (d=>{return y(d.height);}))
        .attr("width", x.bandwidth)
        .attr("height", (d) => {
            return height - y(d.height);
        })
        .attr("fill", "darkgrey");

}).catch(function (err) {
    console.log(err);
});
