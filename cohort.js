function Cohort(config) {

  var margin = config.margin;

  var width = config.width - config.margin.left - config.margin.right;
  var height = config.height - config.margin.top - config.margin.bottom;

  var barHeight = 12;

  var parseDate = d3.time.format("%Y").parse;

  var x = d3.time.scale()
    .domain([parseDate('1900'), parseDate('2100')])
    .range([0, width]);

  var y = d3.scale.ordinal()
    .domain(apc.map(function(d) { return d.name; }))
    .rangeBands([0, height]);

  var obesityPercent = 15;

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format('%Y'))
    .ticks(d3.time.years, 10)
    .tickPadding(6);


  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var legendLineHeight = 10;

  var selection = config.selection;

  var svg = selection.append('svg')
    .attr('width', config.width)
    .attr('height', config.height + 40)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bandLength = (y.rangeExtent()[1] - y.rangeExtent()[0]) / y.domain().length;


  svg.append("g")
    .attr("class", "x axis")
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
      .attr('transform', 'rotate(70)')
      .attr('dx', '2.5em')
      .attr('dy', '-.2em');


  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  function my() {

    var bars = svg.selectAll('.bar').data(apc);

    bars.enter().append('rect');
    bars
      .attr('class', function(d) {
        return 'bar ' + 'g' + d.generation;
      })
      .attr('x', function(d) { return x(parseDate('' + d.generation)); })
      .attr('y', function(d) { return y(d.name) + bandLength / 2 - barHeight /2 ; })
      .attr('width', function(d) {
        return x(parseDate('' + (d.generation + d.expectancy))) - x(parseDate('' + d.generation));
      })
      .attr('height', barHeight)
      .style('fill', function(d, i) {
        return colorbrewer['Set1']['8'][i];
      })

    var obesityBars = svg.selectAll('.opesity-bar').data(apc.filter(function(d) {
      return d[obesityPercent];
    }));

    obesityBars.enter().append('rect');

    obesityBars
      .attr('class', function(d) { return 'obesity-bar ' + 'g' + d.generation; })
      .attr('x', function(d) { return x(parseDate('' + (d.generation + d[obesityPercent]))); })
      .attr('y', function(d) { return y(d[obesityPercent]) + bandLength / 2 - barHeight /2 ; })
      .attr('width', function(d) {
        return x(parseDate('' + (d.generation + d.expectancy))) - x(parseDate('' + (d.generation + d[obesityPercent])));
      })
      .attr('height', barHeight);

    var birthpoints = svg.selectAll('.birthpoint').data(apc);

    birthpoints.enter().append('circle');
    birthpoints
      .attr('class', '.birthpoint.hide')
      .attr('cx', function(d) { return x(parseDate('' + d.generation)); })
      .attr('cy', function(d) { return y(d.name) + bandLength / 2; })
      .attr('r', 14)
      .style('fill', function(d, i) {
        return colorbrewer['Set1']['8'][i];
      });



    var cover = svg.selectAll('.cover').data([0, 1]);

    cover.enter().append('rect')
      .attr('class', function(d) { return d === 0 ? 'white-cover' : 'black-cover' })
      .attr('x', function(d) { return d })
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height);

    cover
      .transition()
      .ease('linear')
      .duration(10000)
      .attr('width', 0)
      .attr('x', width);

    var legendG = svg.append('g')
      .attr('class', 'legend-g')
      .attr('transform', 'translate(0, -14)');

    legendG.append('text')
      .attr('class', 'obese-text')
      .attr('x', x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) + 2)
      .attr('dy', '-1.4em')
      .attr('text-anchor', 'start')
      .text(obesityPercent + '% of population is obese');

    legendG.append('text')
      .attr('class', 'healthy-text')
      .attr('x', x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) + 2)
      .attr('dy', '-1.4em')
      .attr('dx', '-.6em')
      .attr('text-anchor', 'end')
      .style('fill', colorbrewer['Set1']['8'][0])
      .text((100 - obesityPercent) + '% of population is healthy');

    var legendLines = legendG.selectAll('.legend-lines').data([
        {
          x1: x(parseDate('' + apc[0].generation)),
          x2: x(parseDate('' + apc[0].generation)),
          y1: 0,
          y2: legendLineHeight,
          type: 'healthy'
        },
        {
          x1: x(parseDate('' + apc[0].generation)),
          x2: x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) - 2,
          y1: 0,
          y2: 0,
          type: 'healthy'
        },
        {
          x1: x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) - 2,
          x2: x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) - 2,
          y1: 0,
          y2: legendLineHeight,
          type: 'healthy'
        },
        {
          x1: x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) + 2,
          x2: x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) + 2,
          y1: 0,
          y2: legendLineHeight,
          type: 'obese'
        },
        {
          x1: x(parseDate('' + (apc[0].generation + apc[0][obesityPercent]))) + 2,
          x2: x(parseDate('' + (apc[0].generation + apc[0]['expectancy']))),
          y1: 0,
          y2: 0,
          type: 'obese'
        },
        {
          x1: x(parseDate('' + (apc[0].generation + apc[0]['expectancy']))),
          x2: x(parseDate('' + (apc[0].generation + apc[0]['expectancy']))),
          y1: 0,
          y2: 10,
          type: 'obese'
        }
    ]);

    legendLines.enter().append('line');
    legendLines
      .attr('x1', function(d) { return d.x1; })
      .attr('x2', function(d) { return d.x2; })
      .attr('y1', function(d) { return d.y1; })
      .attr('y2', function(d) { return d.y2; })
      .style('stroke', function(d) {

        if (d.type === 'healthy') {
          return colorbrewer['Set1']['8'][0];
        } else {
          return 'white';
        }

      })



  }

  return my;





}
