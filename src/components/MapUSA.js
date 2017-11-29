import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import styled from 'styled-components'
import { debug } from 'util';
//import { geoMercator, geoPath } from "d3-geo"
//import { feature } from "topojson-client"


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

  clickHandler(e, id){
    e.stopPropagation();
    this.props.uxCallback(id);
    console.log(e);
  }

  render() {
    console.log("Map Rendering")
    const { renderData, uxCallback, highlightStates } = this.props;
    const width = 800,
          height = 400;

    const Map = styled.div`
      width: ${width+"px"};
      height: ${height+"px"};
      float: left;
    `;

    const SVG = styled.svg`
      width: ${width+"px"};
      height: ${height+"px"};
    `;

    const highlightColor = "#00ff00",
          highlightGreyout = "#000000";

    let renderStates = []

    if (this.state.statePaths.features) {
      let projection = d3.geoAlbersUsa().scale(800).translate([400, 200]),
          path = d3.geoPath().projection(projection),
          max_val = d3.max(renderData, (d) => { return d['value'] }),
          min_val = d3.min(renderData, (d) => { return d['value'] }),
          median_val = d3.median(renderData, (d) => { return d['value'] }),
          colorScale = d3.scaleLinear().domain([min_val, median_val, max_val]).range(['blue', 'white', 'red']);

      

      renderStates = this.state.statePaths.features.map((d, i) => {
        let colorVal="#fff";

        if(highlightStates.length>0){
          //console.log("here is hihglightstates", highlightStates)
          colorVal = highlightStates.filter(st=>{if(st===d.id) {return true} return false}).length>0 ? highlightColor:highlightGreyout ;
        }
        else{
          colorVal = renderData.filter(st=>{if(st.id===d.id) return true;});
          if(colorVal.length){
            colorVal = colorScale(colorVal[0].value);
          }
        }
        return (<path d={path(d)} key={i} stroke={"#000"} fill={colorVal} onClick={(e)=>{this.clickHandler(e, d.id)}} />);
      })
    }

    return (
      <Map>
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