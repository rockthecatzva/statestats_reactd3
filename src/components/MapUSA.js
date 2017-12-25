import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import styled from 'styled-components'

export default class MapUSA extends Component {
  constructor(props) {
    super(props);
    this.state = { "statePaths": [] };
  }

  componentDidMount() {
    console.log("Map Mounted");
    fetch("/us.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }

        response.json().then(json => {
          this.setState({
            statePaths: topojson.feature(json, json.objects.states)
          })
        })
      })
  }

  clickHandler(e, stateInfo) {
    console.log(stateInfo);
    e.stopPropagation();
    const message = stateInfo.state + ": " + stateInfo.value + stateInfo.numformat;

    this.props.uxCallback(message, [stateInfo.id]);

  }

  render() {
    console.log("Map Rendering")
    const { renderData, highlightStates } = this.props;
    const width = 800,
      height = 500;

    const Map = styled.div`
    font-family: CustomFont;
      color: red;
      width: ${width + "px"};
      height: ${height + "px"};
      float: left;`;

    const SVG = styled.svg`
      width: ${width + "px"};
      height: ${height + "px"};`;

    const Title = styled.span`
      width: 100%;
      font-size: 1.1em;
      text-align: center;
      float: left;`;

    const highlightColor = "#d299fd",
      highlightGreyout = "#c5c5c5";

    let renderStates = []

    if (this.state.statePaths.features) {
      let projection = d3.geoAlbersUsa().scale(800).translate([400, 200]),
        path = d3.geoPath().projection(projection),
        max_val = d3.max(renderData, (d) => { return d['value'] }),
        min_val = d3.min(renderData, (d) => { return d['value'] }),
        median_val = d3.median(renderData, (d) => { return d['value'] }),
        colorScale = d3.scaleLinear().domain([min_val, median_val, max_val]).range(['blue', 'white', 'red']);



      renderStates = this.state.statePaths.features.map((d, i) => {
        let colorVal = "#fff";
        const stateInfo = renderData.filter(st => { if (st.id === d.id) return true; return false;});

        if (highlightStates.length > 0) {
          colorVal = highlightStates.filter(st => { if (st === d.id) { return true } return false }).length > 0 ? highlightColor : highlightGreyout;
        }
        else {
          if (stateInfo.length){
            colorVal = colorScale(stateInfo[0].value);
          }
          
        }
        return (<path d={path(d)} key={i} stroke={"#fff"} fill={colorVal} onClick={(e) => { this.clickHandler(e, stateInfo[0]) }} />);
      })
    }

    return (
      <Map>
        <Title>U.S. State Map</Title>
        <SVG>
          {renderStates}
        </SVG>
      </Map>
    )
  }
}

MapUSA.propTypes = {
  renderData: PropTypes.array.isRequired,
  uxCallback: PropTypes.func.isRequired,
  highlightStates: PropTypes.array.isRequired
}