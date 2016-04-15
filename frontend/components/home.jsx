import React from 'react';
import d3 from 'd3';
import topojson from 'topojson';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: null,
      regionName: 'SoHo',
      regionName2: ''
    };
  }

  drawGraph() {
    let graph = document.getElementById('graph');
    let existing = !!graph;
    //if (graph) graph.remove();

    const barPadding = 1;
    const margin = {
      top: 40, right: 30, bottom: 30, left: 40
    };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    let padding = 60;

    d3.csv('/static/data/Neighborhood_MedianRentalPrice_1Bedroom.csv', data => {
      let regionOneData = null;
      let regionTwoData = null;
      for (let i = 0; i < data.length; ++i) {
        let item = data[i];
        if (item.City !== 'New York') continue;

        if (item.RegionName === this.state.regionName) {
          regionOneData = item;
        }
        if (item.RegionName === this.state.regionName2) {
          regionTwoData = item;
        }
      }

      let parsedData = [];
      let parsedR1Data = [];
      let parsedR2Data = [];

      let parse = (region) => {
        let regionData = [];

        let metaData = {
          City: 'City',
          CountyName: 'CountyName',
          Metro: 'Metro',
          RegionName: 'RegionName',
          SizeRank: 'SizeRank',
          State: 'State'
        };

        for (let key in region) {
          if (!region.hasOwnProperty(key)) continue;
          if (metaData[key]) {
            metaData[key] = region[key];
            continue;
          }
          let split = key.split('-');
          let year = split[0];
          let month = split[1];
          if (parseInt(year) < 2011) continue;

          let obj = {
            date: new Date(parseInt(year), parseInt(month)),
            order: parseInt(year + month),
            year: parseInt(year),
            month: parseInt(month),
            value: region[key].length > 0 ? parseInt(region[key]) : 0
          };
          parsedData.push(obj);
          regionData.push(obj);
        }
        regionData.sort((a, b) => a.order <= b.order ? -1 : 1);
        return regionData;
      }
      parsedR1Data = parse(regionOneData);
      parsedR2Data = parse(regionTwoData);

      let minY = d3.min(parsedData, d => {
        return parseInt(d.value);
      });
      let maxY = d3.max(parsedData, d => {
        return parseInt(d.value);
      });
      let minX = d3.min(parsedData, d => {
        return d.date;
      });
      let maxX = d3.max(parsedData, d => {
        return d.date;
      });

      let yScale = d3.scale.linear()
        .domain([0, maxY])
        .range([height, 0]);

      let xScale = d3.time.scale()
        .domain([minX, maxX])
        .range([0, width]);

      let yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

      let formatAsMonth = d3.time.format('%m');
      const monthAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(d3.time.months)
        .tickSize(16, 0)
        .tickPadding(barPadding)
        .tickFormat(formatAsMonth);

      let formatAsYear = d3.time.format('%Y');
      const yearAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(d3.time.years)
        .tickSize(16, 0)
        .tickPadding(barPadding)
        .tickFormat(formatAsYear);

      let svg;
      if (!existing) {
        svg = d3.select('#data').append('svg')
          .attr('id', 'graph')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // svg.append('g')
        //   .attr('class', 'month-axis')
        //   .attr('transform', 'translate(0,' + (height + 1) + ')')
        //   .call(monthAxis);

        svg.append('g')
          .attr('class', 'year-axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(yearAxis);

        svg.append('g')
          .attr('class', 'y-axis')
          .attr('transform', 'translate(' + 0 + ', 0)')
          .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(0)')
          .attr('y', 6)
          .attr('dy', '-1rem')
          .attr('dx', '5rem')
          .style('text-anchor', 'end')
          .text('Monthly Price ($)');
      } else {
        svg = d3.select('#graph')
          .attr('id', 'graph')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .select('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.select('g.year-axis')
          .attr('class', 'year-axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(yearAxis);

        svg.select('g.y-axis')
          .attr('class', 'y-axis')
          .attr('transform', 'translate(' + 0 + ', 0)')
          .call(yAxis)
      }

      let dataOptions1 = svg.selectAll('.data-option-1');
      if (dataOptions1[0].length === 0) {
        dataOptions1
          .data(parsedR1Data)
          .enter()
          .append('rect')
          .attr('fill', 'rgba(70, 164, 217, 0.5)')
          .attr('class', 'data-option-1 bar primary')
          .attr('x', (d, i) => {
            return i * (width / parsedR1Data.length);
          })
          .attr('y', d => {
            let amount = d.value;
            return yScale(amount);
          })
          .attr('width', width / parsedR1Data.length - barPadding)
          .attr('height', d => {
            let amount = d.value;
            return height - yScale(amount);
          });
      } else {
        dataOptions1
          .data(parsedR1Data)
          .transition()
          .attr('fill', 'rgba(70, 164, 217, 0.5)')
          .attr('class', 'data-option-1 bar primary')
          .attr('x', (d, i) => {
            return i * (width / parsedR1Data.length);
          })
          .attr('y', d => {
            let amount = d.value;
            return yScale(amount);
          })
          .attr('width', width / parsedR1Data.length - barPadding)
          .attr('height', d => {
            let amount = d.value;
            return height - yScale(amount);
          });
      }

      let dataOptions2 = svg.selectAll('.data-option-2');
      if (dataOptions2[0].length === 0) {
        dataOptions2
        .data(parsedR2Data)
        .enter()
        .append('rect')
        .attr('fill', 'rgba(217, 70, 70, 0.5)')
        .attr('class', 'data-option-2 bar primary')
        .attr('x', (d, i) => {
          return i * (width / parsedR2Data.length);
        })
        .attr('y', d => {
          let amount = d.value;
          return yScale(amount);
        })
        .attr('width', width / parsedR2Data.length - barPadding)
        .attr('height', d => {
          let amount = d.value;
          return height - yScale(amount);
        });
      } else {
        svg.selectAll('.data-option-2')
          .data(parsedR2Data)
          .transition()
          .attr('fill', 'rgba(217, 70, 70, 0.5)')
          .attr('class', 'data-option-2 bar primary')
          .attr('x', (d, i) => {
            return i * (width / parsedR2Data.length);
          })
          .attr('y', d => {
            let amount = d.value;
            return yScale(amount);
          })
          .attr('width', width / parsedR2Data.length - barPadding)
          .attr('height', d => {
            let amount = d.value;
            return height - yScale(amount);
          });
      }
      // debugger;

    });


    /*
    const width = 9600;
    const height = 6000;

    const projection = d3.geo.transverseMercator()
      .rotate([74 + 30 / 60, -38 - 50 / 60]);

    const path = d3.geo.path()
      .projection(projection);

    const svg = d3.select('#data').append('svg')
      .attr('width', width)
      .attr('height', height);

    d3.json('/data/ny-tracts.json', (error, ny) => {
      if (error) throw error;

      const tracts = topojson.feature(ny, ny.objects['ny-tracts']);

      projection
        .scale(1)
        .translate([0, 0]);

      const b = path.bounds(tracts),
            s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

      projection
        .scale(s)
        .translate(t);

      svg.selectAll('path')
        .data(tracts.features.filter(d => (d.id / 10000 | 0) % 100 !== 99))
        .enter().append('path')
          .attr('class', 'tract')
          .attr('d', path)
        .append('title')
          .text(d => d.id);

      svg.append('path')
        .datum(topojson.mesh(ny, ny.objects['ny-tracts'], (a, b) => a !== b))
        .attr('class', 'tract-border')
        .attr('d', path);
    });
    */
  }

  getOptions() {
    d3.csv('/static/data/Neighborhood_MedianRentalPrice_1Bedroom.csv', data => {
      let options = [];
      let dupeHash = {};
      for (let i = 0; i < data.length; ++i) {
        let item = data[i];
        if (item.City !== 'New York') continue;
        if (dupeHash[item.RegionName]) continue;
        dupeHash[item.RegionName] = true;
        options.push(item.RegionName);
      }

      this.setState({
        options: options
      });
    });
  }

  componentDidMount() {
    if (this.state.options === null) {
      this.getOptions();
    } else {
      this.drawGraph();
    }
  }

  componentDidUpdate() {
    this.drawGraph();
  }

  _handleOption1Change(e) {
    this.setState({
      regionName: e.target.value
    });
  }
  _handleOption2Change(e) {
    this.setState({
      regionName2: e.target.value
    });
  }

  render() {
    if (!this.state.options) return <div></div>

    let options1 = this.state.options.sort().map(option => {
      return <option key={'o1-' + option} value={option}>{option}</option>
    });
    let options2 = this.state.options.sort().map(option => {
      return <option key={'o2-' + option} value={option}>{option}</option>
    });

    return (
      <div className="content">
        <h1>Monthly Median Rent</h1>
        <p>1 Bedroom</p>
        <div className="compare-options group">
          <div className="option">
            <select value={this.state.regionName} onChange={this._handleOption1Change.bind(this)}>
              <option value=''></option>
              {options1}
            </select>
          </div>
          <div className="option">
            <select value={this.state.regionName2} onChange={this._handleOption2Change.bind(this)}>
              <option value=''></option>
              {options2}
            </select>
          </div>
        </div>
        <div id="data"></div>
      </div>
    );
  }
}

export default Home;
