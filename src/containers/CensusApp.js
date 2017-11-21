import { connect } from 'react-redux'
//import { setVisibilityFilter } from '../actions'
//import Link from '../components/Link'
import React, { Component } from 'react'
import PropTypes from 'prop-types'


import {fetchCensusData,
        clickUSState} from '../actions'

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
  }


  handleOptionChange(optiongroup, val){
    //console.log(optiongroup, val)
    this.props.dispatch(fetchCensusData(optiongroup, val))
  }

  render() {
    const {dataOptions, censusData, selectionLabels, dispatch} = this.props;
    return (
      <div>
        <Header />
        <MessageModal message={selectionLabels.message} />
        <Dropdown options={dataOptions} onChange={(val)=>{this.handleOptionChange("primaryData", val)}} defaultSelection={0} />
        {censusData.hasOwnProperty("primaryData") && 
          <div>
            <MapUSA renderData={censusData.primaryData} uxCallback={(id)=>{dispatch(clickUSState(id))}} highlightStates={[]} />
            <Histogram renderData={censusData.primaryData} uxCallback={()=>{console.log("click event")}} highlightValue={[]} />
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
