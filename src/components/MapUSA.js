import React, {Component} from 'react'
import PropTypes from 'prop-types' 
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import styled from 'styled-components'


export default class MapUSA extends Component {
  constructor(props){
    super(props);
    this.updateData = this.updateData.bind(this);
  }

  updateData(data, highlight) {
    const {uxCallback} = this.props;

    let el = ReactDOM.findDOMNode(this),
        containerW = parseInt((window.getComputedStyle(el).width).replace("px", ""), 10),
        containerH = parseInt((window.getComputedStyle(el).height).replace("px", ""), 10),
        projection = d3.geoAlbersUsa().scale(containerW+40).translate([containerW / 2, containerH / 2]),
        path = d3.geoPath().projection(projection);

    var svg = d3.select(ReactDOM.findDOMNode(this)).select("svg")
        .attr("width", containerW)
        .attr("height", containerH);
      
    console.log(svg, containerW, containerH)

    d3.json("us.json", function(json) {
      var d = topojson.feature(json, json.objects.states)
      var t= d.features.map(function(val){
        
        for (var i = 0; i < data.length; i++) {
          if (data[i].id===val.id){
            return Object.assign({}, val, {"name": data[i].state}, data[i])
          }
        }
      return val
      })

      d.features = t

      let max_val = d3.max(d.features, (d)=>{return d['value']})
      let min_val = d3.min(d.features, (d)=>{return d['value']})
      let median_val = d3.median(d.features, (d)=>{return d['value']});
      var color_scale = d3.scaleLinear().domain([min_val, median_val, max_val]).range(['blue', 'white', 'red']);

      svg.selectAll("path").remove()
      svg.selectAll("path")
        .data(t)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", (d)=>{
          if(highlight.length){
            if(highlight.filter(r=>{if(r===d.state) return true; return false;}).length)
            {
              return "mapstates highlight";
            }
            else{
              return "mapstates greyed-out";
            }
          }
          return "mapstates";
        })//make this dynamic and get rid of the fill below?
        .style('fill', function(d) {
          if(!highlight.length){
            return color_scale(d['value']);  
          }
        })
        .on("click", function(e){
          d3.event.stopPropagation();
          console.log(e)
          uxCallback(e.name+": "+e.value+e.numformat);
        });
    });
  }

  componentWillReceiveProps(nextprop) {
      //console.log("getting props")
      if(nextprop.renderData){
        this.updateData(nextprop.renderData, nextprop.highlightStates)
      }
    }


  componentDidMount() {
    if(this.props.renderData){
        this.updateData(this.props.renderData, this.props.highlightStates)
      }
  }


  render() {
    const Map = styled.div`
      width: 400px;
      height: 400px;
    `;

    const SVG = styled.svg`
      width: 400px;
      height: 400px;
    `;

    return (
      <Map>
      </Map>
    )
  }
}

MapUSA.propTypes = {
  renderData: PropTypes.array.isRequired,
  uxCallback: PropTypes.func.isRequired,
  highlightStates: PropTypes.array.isRequired
}