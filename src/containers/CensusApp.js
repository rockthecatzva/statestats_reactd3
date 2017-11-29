import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'


import {fetchCensusData,
        vizClick,
        clearSelections} from '../actions'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Dropdown from '../components/Dropdown'
import MapUSA from '../components/MapUSA'
import Histogram from '../components/Histogram'
import MessageModal from '../components/MessageModal'

class CensusApp extends Component {
  constructor(props) {
    super(props);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.clearSelections = this.clearSelections.bind(this);
  }

  handleMapClick(id){
    const {dispatch, censusData } = this.props;
    //make the message - find state name, number format and value
    const stateData = censusData.primaryData.filter(st=>{if(st.id===id) return true;})[0],
          message = stateData.state+": "+stateData.value+stateData.numformat;
    //dispatch with message & higlightState
    dispatch(vizClick(message, [id], [stateData.value]));
  }

  handleHistoClick(vals){
    const {dispatch, censusData} = this.props;
    
    const max = Math.max(...vals),
          min = Math.min(...vals),
          numformat = censusData.primaryData[0].numformat,
          message = (max===min) ? "States with "+min+numformat : "States with "+min+"-"+max+numformat,
          statesInRange = censusData.primaryData.filter(st=>{
            return vals.includes(st.value);
          }).map(st=>{return st.id});
          console.log(statesInRange, message);

    dispatch(vizClick(message, statesInRange, vals));
  }

  clearSelections(){
    this.props.dispatch(clearSelections());
  }


  handleOptionChange(optiongroup, val){
    this.props.dispatch(fetchCensusData(optiongroup, val))
  }

  render() {
    const {dataOptions, censusData, selectionLabels, dispatch, highlightStates} = this.props;
    return (
      <div onClick={()=>{this.clearSelections()}}>
        <Header />
        <MessageModal message={selectionLabels.message} />
        <Dropdown options={dataOptions} onChange={(val)=>{this.handleOptionChange("primaryData", val)}} defaultSelection={0} />
        {censusData.hasOwnProperty("primaryData") && 
          <div>
            <MapUSA renderData={censusData.primaryData} uxCallback={(id)=>{this.handleMapClick(id)}} highlightStates={selectionLabels.highlightStates} />
            <Histogram renderData={censusData.primaryData} uxCallback={(vals)=>{this.handleHistoClick(vals)}} highlightValues={selectionLabels.highlightValues} />
          </div>

          }

        <Dropdown options={dataOptions} onChange={(val)=>{this.handleOptionChange("secondaryData", val)}} defaultSelection={dataOptions.length-1} />
        <Footer />
      </div>
    );

  }


}


const mapStateToProps = (state, ownProps) => {
  return {
    dataOptions: state.dataOptions,
    censusData: state.censusData,
    selectionLabels: state.selectionLabels
  }
}


export default CensusApp = connect(
  mapStateToProps
)(CensusApp)
