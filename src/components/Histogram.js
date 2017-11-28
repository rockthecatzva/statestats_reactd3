import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import * as d3 from 'd3';
import styled from 'styled-components'


export default class Histogram extends Component {


  updateData(data, highlight) {
    let valSet = data.map((v, i) => { return data[i]["value"] });
    const { uxCallback, renderData } = this.props
    let el = ReactDOM.findDOMNode(this),
      containerW = parseInt((window.getComputedStyle(el).width).replace("px", ""), 10),
      containerH = parseInt((window.getComputedStyle(el).height).replace("px", ""), 10);
    let margin = { top: 20, right: 5, bottom: 5, left: 5 };

    var svg = d3.select(el).select("svg")
      .attr("width", containerW)
      .attr("height", containerH);

    var formatCount = d3.format(",.0f");

    var x = d3.scaleLinear()
      .domain([d3.min(valSet), d3.max(valSet)])
      .range([margin.left, containerW - (margin.left + margin.right)])
      .interpolate(d3.interpolateRound)

    var bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(10))(valSet)

    var y = d3.scaleLinear()
      .domain([0, d3.max(bins, function (d) { return d.length; })])
      .range([(containerH - (margin.top + margin.bottom)), 15]);

    svg.selectAll(".bar").remove()
    var bar = svg.selectAll(".bar")
      .data(bins)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })

    var callUx = function (tag, data) {
      data = Object.assign({}, data, { "numformat": renderData[0]["numformat"] });
      uxCallback(tag, data)
    }



    bar.append("rect")
      .attr("x", 1)
      .attr("width", (d, i) => {
        //this maintains a minimum bar width when a x0 == x1 for a histo bounds
        if (bins[i].x1 === bins[i].x0) bins[i].x1 += 1;

        return x(bins[i].x1) - x(bins[i].x0)
      })
      .attr("height", function (d) { return (containerH - margin.top - margin.bottom) - y(d.length); })
      .attr("class", (d, i) => {
        if (highlight) {
          if (d.filter((v) => { return v === highlight }).length) {
            return "bar-rect highlight";
          }
          else {
            return "bar-rect greyed-out";
          }
        }
        return "bar-rect normal";
      })
      .on("click", (d, i) => { callUx("histogram-click", d) });

    bar.append("text")
      .attr("y", "-0.25em")
      .attr("x", (v, i) => { return Math.ceil((x(bins[i].x1) - x(bins[i].x0)) / 2) })
      .attr("text-anchor", "middle")
      .attr("class", "bar-label")
      .text(function (d) { if (d.length) { return formatCount(d.length) }; });

    svg.selectAll(".axis").remove()
    svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (containerH - margin.top - margin.bottom) + ")")
      .call(d3.axisBottom(x));
  }

  clickHandler(e, vals){
    e.stopPropagation();
    const highNums = Object.entries(vals).filter(r => {
      if (Number.isInteger(parseInt(r[0], 10))) return true;
      return false;
    }).map(n => { return parseInt(n[1], 10); });

    this.props.uxCallback(highNums);
    //console.log(highNums);
  }

  render() {
    console.log("Histogram Rendering")
    const { renderData, uxCallback, highlightValue } = this.props;
    const width =  800,
          height = 400;

    const Histo = styled.div`
          width: ${width+"px"};
          height: ${height+"px"};
        `;

    const SVG = styled.svg`
      width: ${width+"px"};
      height: ${height+"px"};
        `;

    //const margin = { top: 20, right: 5, bottom: 5, left: 5 };

    const valSet = renderData.map((st, i) => { return st["value"] });
    //console.log(valSet, d3.min(valSet), d3.max(valSet))

    const xScale = d3.scaleLinear()
    .domain([d3.min(valSet), d3.max(valSet)])
    .range([0, width])
    .interpolate(d3.interpolateRound)

    const bins = d3.histogram()
    .domain(xScale.domain())
    .thresholds(xScale.ticks(10))(valSet)

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, function (d) { return d.length; })])
    .range([0, height]);

    const bars = bins.map((b,i)=>{
      
      let x = xScale(b.x0),
          h = (yScale(b.length)),
          y = height-h,//yScale(b.length),
          w = (b.x1 === b.x0) ? xScale(1) : xScale(b.x1)-xScale(b.x0);
      //console.log(w, b.x1-b.x0);

      return (<rect key={i} x={x} y={y} width={w} height={h} onClick={(e)=>{this.clickHandler(e, b)}} />)
    })

    return (
      <Histo>
        <SVG>
          {bars}
        </SVG>
      </Histo>
    )
  }
}

Histogram.propTypes = {
  renderData: PropTypes.array.isRequired,
  highlightValue: PropTypes.number.isRequired,
  uxCallback: PropTypes.func.isRequired
}
