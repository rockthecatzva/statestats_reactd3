import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  fetchCensusData,
  vizClick,
  clearSelections,
  changeDropDown
} from '../actions'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Dropdown from '../components/Dropdown'
import MapUSA from '../components/MapUSA'
import Histogram from '../components/Histogram'
import ScatterPlotLine from '../components/ScatterPlotLine'
import MessageModal from '../components/MessageModal'

class CensusApp extends Component {
  constructor(props) {
    super(props);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.clearSelections = this.clearSelections.bind(this);
  }


  //NEED TO STANDARDIZE THE Click-EVent handlers ie, (stateSet, message)!!!!

  handleScatterClick(idSet, message) {
    const { dispatch, censusData } = this.props;
    //make the message - find state name, number format and value
    //const stateData = censusData.primaryData.filter(st => { if (st.id === id) return true; })[0],
      //message = stateData.state + ": " + stateData.value + stateData.numformat;
      //message = "SCATTER CLICK TEMP";
    //dispatch with message & higlightState
    dispatch(vizClick(message, idSet, [0]));
  }


  handleMapClick(id) {
    const { dispatch, censusData } = this.props;
    //make the message - find state name, number format and value
    const stateData = censusData.primaryData.filter(st => { if (st.id === id) return true; })[0],
      message = stateData.state + ": " + stateData.value + stateData.numformat;
    //dispatch with message & higlightState
    dispatch(vizClick(message, [id], [stateData.value]));
  }

  handleHistoClick(vals) {
    const { dispatch, censusData } = this.props;

    const max = Math.max(...vals),
      min = Math.min(...vals),
      numformat = censusData.primaryData[0].numformat,
      message = (max === min) ? "States with " + min + numformat : "States with " + min + "-" + max + numformat,
      statesInRange = censusData.primaryData.filter(st => {
        return vals.includes(st.value);
      }).map(st => { return st.id });
    console.log(statesInRange, message);

    dispatch(vizClick(message, statesInRange, vals));
  }

  clearSelections() {
    this.props.dispatch(clearSelections());
  }


  handleOptionChange(optiongroup, val) {
    console.log(optiongroup, val)
    this.props.dispatch(fetchCensusData(optiongroup, val))
    this.props.dispatch(changeDropDown(optiongroup, val.label))
  }

  render() {
    const { dataOptions, censusData, selectionLabels, dispatch, highlightStates } = this.props;

    //a styled-div with dropdown inside caused
    const ClearFloatHack = styled.div`
      clear: left;
    `;

    return (
      <div onClick={() => { this.clearSelections() }}>
        <Header />
        <Dropdown optionSet={dataOptions} onChange={(val) => { this.handleOptionChange("primaryData", val) }} defaultSelection={0} />
        {censusData.hasOwnProperty("primaryData") &&
          <div>
            <MapUSA renderData={censusData.primaryData} uxCallback={(id) => { this.handleMapClick(id) }} highlightStates={selectionLabels.highlightStates} />
            <Histogram renderData={censusData.primaryData} uxCallback={(vals) => { this.handleHistoClick(vals) }} highlightValues={selectionLabels.highlightValues} />
          </div>
        }

        <ClearFloatHack />

        <div>
          {selectionLabels.primaryData} vs.
          <Dropdown optionSet={dataOptions} onChange={(val) => { this.handleOptionChange("secondaryData", val) }} defaultSelection={dataOptions.length - 1} />
        </div>

        {censusData.hasOwnProperty("secondaryData") &&

          <div>
            <ScatterPlotLine
              primaryData={censusData.primaryData}
              secondaryData={censusData.secondaryData}
              primaryLabel={selectionLabels.primaryData}
              secondaryLabel={selectionLabels.secondaryData}
              highlightStates={selectionLabels.highlightStates}
              uxCallback={(ids, msg) => { this.handleScatterClick(ids, msg) }} />
          </div>
        }

        <MessageModal message={selectionLabels.message} />
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
