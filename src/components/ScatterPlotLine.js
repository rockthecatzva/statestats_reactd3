import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import * as d3 from 'd3';
import {
    scaleLinear as d3ScaleLinear
} from 'd3-scale';
import {
    axisBottom as d3AxisBottom,
    axisLeft as d3AxisLeft,
} from 'd3-axis';
import { extent as d3ArrayExtent } from 'd3-array';


export default class ScatterPlotLine extends React.Component {
    constructor(props) {
        super(props)
        this.updateData = this.updateData.bind(this);
        this.state = { "height": 0, "width": 0 };

    }

    componentWillReceiveProps(nextprop) {
        if ((nextprop.primaryData) && (nextprop.secondaryData)) {
            this.updateData(nextprop.primaryData, nextprop.secondaryData)
        }
    }


    componentDidMount() {
        if (this.props.primaryData && this.props.secondaryData) {
            this.updateData(this.props.primaryData, this.props.secondaryData)
        }
    }

    updateData(primary, secondary) {
        var el = ReactDOM.findDOMNode(this),
            containerW = parseInt((window.getComputedStyle(el).width).replace("px", ""), 10),
            containerH = parseInt((window.getComputedStyle(el).height).replace("px", ""), 10);

        this.setState({ "width": containerW, "height": containerH });
    }

    render() {
        const margin = {
            bottom: 35,
            top: 15,
            left: 40,
            right: 20
        },
            buffer = 0.1,
            tickSize = 4,
            radius = 3,
            labelOffset = 30;

        var circles = [];

        if (this.state.height && this.props.secondaryData) {
            var xrange = d3ArrayExtent(this.props.primaryData, r => r.value),
                yrange = d3ArrayExtent(this.props.secondaryData, r => r.value);

            var xScale = d3ScaleLinear()
                .domain([xrange[0] - (xrange[0] * buffer), xrange[1] + (xrange[1] * buffer)])
                .range([margin.left, this.state.width - margin.right]);

            var xAxis = d3AxisBottom()
                .scale(xScale)
                .tickSize(tickSize)
                .tickFormat(d3.format(".2"));

            var yScale = d3ScaleLinear()
                .domain([yrange[0] - (yrange[0] * buffer), yrange[1] + (yrange[1] * buffer)])
                .range([this.state.height - margin.bottom, margin.top]);

            var yAxis = d3AxisLeft()
                .scale(yScale)
                .tickSize(tickSize)
                .tickFormat(d3.format(".2"));

            var axisTitles = [];
            axisTitles.push(<text className="axis-title" key={axisTitles.length} transform={"translate("+((this.state.width - margin.right)/2)+","+(this.state.height - margin.bottom + labelOffset)+")"}>{this.props.primaryLabel}</text>);
            axisTitles.push(<text className="axis-title" key={axisTitles.length} transform={"translate("+(margin.left-labelOffset)+","+((this.state.height - margin.bottom)/2)+")rotate(-90)"}>{this.props.secondaryLabel}</text>);
            var par = this;

            circles = this.props.primaryData.map(function (c, i) {
                var pairVal = par.props.secondaryData.filter(d => d.state === c.state);
                if (pairVal.length) {
                    var x = xScale(c.value),
                        y = yScale(pairVal[0].value),
                        cname = "bubble";
                        if(par.props.highlightStates){
                            cname += (par.props.highlightStates.filter(r=>{if(r===c.state) return true; return false;}).length) ? " highlight": " greyed-bubble";
                        }
                    var uxdat =  {
                        selectedState: c.state,
                        mapMessage: c.state+" "+par.props.primaryLabel+": "+c.value+par.props.primaryData[0].numformat+", "+par.props.secondaryLabel+": "+pairVal[0].value+par.props.secondaryData[0].numformat
                    };
                    var uxevent = (e)=>{
                        e.stopPropagation();
                        par.props.uxCallback("scatter-click",uxdat);
                    }

                    return (<circle key={i} cx={x} cy={y} r={radius} className={cname} onClick={uxevent} ></circle>);
                }
                
                return [];
            });

            /*var onMouse = function (e, d) {
                d3.selectAll(".bubble").attr("class", "bubble");
                d3.select(e.target).attr("class", "bubble highlight")
                var left = e.pageX - document.getElementById('tooltip').clientWidth / 2,
                    top = e.pageY - document.getElementById('tooltip').clientHeight + 100,
                    score = Math.round(d.ups / 1000) + "k";
                par.props.toolTip(d.date, score, d.title, d.url, top, left);
            }*/

        }


        
        return (<div className="fullw fullh" >
            {(this.state.height && this.state.width) &&
                <svg height={this.state.height} width={this.state.width} >
                    <g className="xAxis" transform={"translate(0," + (this.state.height - margin.bottom) + ")"} ref={node => d3.select(node).call(xAxis)} />
                    <g className="yAxis" transform={"translate(" + margin.left + ",0)"} ref={node => d3.select(node).call(yAxis)} />
                    {axisTitles}
                    {circles}
                </svg>
            }

        </div>
        );
    }
}

ScatterPlotLine.propTypes = {
    primaryData: PropTypes.array.isRequired,
    secondaryData: PropTypes.array.isRequired,
    primaryLabel: PropTypes.string.isRequired,
    secondaryLabel: PropTypes.string.isRequired,
    highlightStates: PropTypes.array.isRequired,
    uxCallback: PropTypes.func.isRequired
}
