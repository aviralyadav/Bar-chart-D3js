/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left: 80, right: 20, top: 10, bottom: 30 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var svg = d3.select('#chart-area').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var xAxisGroup = g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

var yAxisGroup = g.append('g')
    .attr('class', 'y axis');

var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(.3)
    .paddingOuter(.3);

var y = d3.scaleLinear()
    .range([height, 0]);

// X Label
g.append('text')
    .attr('class', 'x axis label')
    .attr('x', width / 2)
    .attr('y', height + 30)
    .attr('style', 'font-size: 15px')
    .attr('text-anchor', 'middle')
    .text('Month');
// Y Label
var yAxisLebel = g.append('text')
    .attr('class', 'y axis label')
    .attr('x', -(height / 2))
    .attr('y', - 50)
    .attr('style', 'font-size: 15px')
    .attr('transform', 'rotate(-90)');
    //.text(yLabel);

d3.json('data/revenues.json')
    .then(data => {
        data.forEach(d => {
            d.revenue = +d.revenue;
            d.profit = +d.profit;
        });

        d3.interval(function () {
            flag = !flag;
            update(data);
        }, 1000);
        update(data);
    })
    .catch(err => {
        console.log(err);
    })

function update(data) {
    var value = flag ? 'revenue' : 'profit';
    var xAxisCall, yAxisCall;
    x.domain(data.map(d => { return d.month; }));
    y.domain([0, d3.max(data, d => { return d[value]; })]);

    xAxisCall = d3.axisBottom(x);
    xAxisGroup.call(xAxisCall);


    yAxisCall = d3.axisLeft(y)
        .tickFormat(d => {
            return '$' + d;
        });
    yAxisGroup.call(yAxisCall);

    // JOIN new data with old elements 
    var rects = g.selectAll('rect').data(data);

    // Exit old data if not exist in new array
    rects.exit().remove();

    // UPDATE old elements present in new data
    rects
        .attr('x', d => { return x(d.month); })
        .attr('y', d => { return y(d[value]); })
        .attr('height', d => { return height - y(d[value]); })
        .attr('width', x.bandwidth);

    // ENTER new elements present in new data
    rects.enter().append('rect')
        .attr('x', d => { return x(d.month); })
        .attr('y', d => { return y(d[value]); })
        .attr('width', x.bandwidth)
        .attr('height', d => { return height - y(d[value]); })
        .attr('fill', 'grey');
   var yLabel = flag ? 'Revenue' : 'Profit';
   yAxisLebel.text(yLabel);
}