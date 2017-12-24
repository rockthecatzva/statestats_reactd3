import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, {injectGlobal} from 'styled-components'


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
    this.clearSelections = this.clearSelections.bind(this);
  }

  handleInteraction(message, idSet) {
    this.props.dispatch(vizClick(message, idSet));
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
    

    injectGlobal`
    @font-face {
      font-family: 'aileron';
      src: url('/Aileron-Regular.otf');
    }`;

    const ClearFloatHack = styled.div`
      clear: left;
    `;
    
    //Styled-components - causes continuous-remounting of components that have state or use componentDidMount, 
      //so Histogram is fine when nested in a styled component, however dropdown (keeps initiating onChange) and Map (flickers due to total reload) have issues!

    let highlightValues = [];
    if(censusData.hasOwnProperty("primaryData")){
      highlightValues = censusData.primaryData.filter(st=>selectionLabels.highlightStates.indexOf(st.id)>-1).map(st=>st.value);  
      console.log(highlightValues);
    }
    
    

    return (
      <div onClick={() => { this.clearSelections() }} >
        <Header />
        <Dropdown optionSet={dataOptions} onChange={(val) => { this.handleOptionChange("primaryData", val) }} defaultSelection={0} />
        {censusData.hasOwnProperty("primaryData") &&
          <div>
            <MapUSA renderData={censusData.primaryData} uxCallback={(msg, vals) => { this.handleInteraction(msg, vals) }} highlightStates={selectionLabels.highlightStates} />
            <Histogram renderData={censusData.primaryData} uxCallback={(msg, vals) => { this.handleInteraction(msg, vals) }} highlightValues={highlightValues} />
          </div>
        }

        <ClearFloatHack />

        <div>
          <p>Select a secondary variable for the scatter plot below</p>
          <p>{selectionLabels.primaryData} vs. <Dropdown optionSet={dataOptions} onChange={(val) => { this.handleOptionChange("secondaryData", val) }} defaultSelection={dataOptions.length - 1} /></p>
        </div>

        {censusData.hasOwnProperty("secondaryData") &&

          <div>
            <ScatterPlotLine
              primaryData={censusData.primaryData}
              secondaryData={censusData.secondaryData}
              primaryLabel={selectionLabels.primaryData}
              secondaryLabel={selectionLabels.secondaryData}
              highlightStates={selectionLabels.highlightStates}
              uxCallback={(msg, vals) => { this.handleInteraction(msg, vals) }} />
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
