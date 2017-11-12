import Dropdown from './components/Dropdown.js';
import MapUSA from './components/MapUSA.js';
import Histogram from './components/Histogram.js';
import ScatterPlotLine from './components/ScatterPlotLine.js';

import React, { Component } from 'react';
import styled from 'styled-components';

import './orig-style.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.onUxEvent = this.onUxEvent.bind(this);
    this.onClearSettings = this.onClearSettings.bind(this);
    this.state = { "selectedStatistic": null, "highlightValue": 0, "mapMessage": "TEXT HERE", "apiData": null, "highlightStates": [] };
  }



  onUxEvent(tag, uxdat) {
    //PROCESS A UX EVENT - from a child component
    //console.log("Processing an event", tag, this);
    switch (tag) {
      case "StatSelected":
        //the selected statistic has changed 
        this.setState({ "highlightValue": null, "primaryLabel": uxdat["label"], "mapMessage": "Click a state or histogram bar", "numFormat": uxdat["numformat"], "selectedStatistic": uxdat.apiObj }, () => { this.makeAPICall("apiData", this.state.selectedStatistic) });
        break;
      case "secondary-stat-selected":
        this.setState({ "secondaryLabel": uxdat.label, "secondaryStatistic": uxdat.apiObj }, () => { this.makeAPICall("secondaryData", this.state.secondaryStatistic) });
        break;
      case "map-click":
        //tell the histogram to highlight some bars
        this.setState({ "highlightValue": uxdat.value, "mapMessage": (uxdat.name + ": " + uxdat.value + uxdat.numformat), "highlightStates": [uxdat.name], "numFormat": uxdat.numformat })
        break;
      case "scatter-click":
        this.setState({ "highlightValue": null, "mapMessage": uxdat.mapMessage, "highlightStates": [uxdat.selectedState], "numFormat": null })
        break;
      case "histogram-click":
        //tell the map to highlight certain states
        let highNums = Object.entries(uxdat).filter(r => {
          if ((Number.isInteger(parseInt(r[0], 10)))) return true;
          return false;
        }).map(r => { return parseInt(r[1], 10); });

        let highlight = this.state.apiData.filter(r => {
          return highNums.includes(r.value);
        }).map(r => { return r.state; });

        this.setState({ "highlightValue": uxdat[0], "mapMessage": "State(s) with " + uxdat["x0"] + "-" + uxdat["x1"] + uxdat["numformat"] + ":", "highlightStates": highlight, "numFormat": uxdat["numformat"] });
        break;
    }
  }

  onClearSettings() {
    this.setState({ "highlightValue": null, "mapMessage": "Click a state or histogram bar", "highlightStates": [] });
  }


  makeAPICall(tag, urlsettings) {
    console.log("making api call", tag);
    function buildURL(settings) {
      let url = settings["url"];

      for (var set in settings) {
        if (settings[set] == null) return null;
        if (Array.isArray(settings[set])) {
          for (var subset in settings[set]) {
            url += "&" + set + "%5B%5D=" + settings[set][subset];
          }
        }
        else {
          if (set !== "url" && set !== "processor") {
            url += "&" + set + "=" + settings[set];
          }
        }
      }
      console.log(url);
      return url;
    }

    function csvtojson(csv) {
      var ob = {}
      var finalset = []
      var cols = []
      //get objet structure from first row
      for (var p in csv[0]) {
        cols.push(csv[0][p])
      }

      csv.splice(0, 1)

      for (var r in csv) {
        for (var c = 0; c < cols.length; c++) {
          ob[cols[c]] = csv[r][c]
        }
        finalset.push(ob)
        ob = {}
      }

      return finalset
    }

    var url = buildURL(urlsettings);
    var data;
    (async () => {
      try {
        var response = await fetch(url, {
          method: "get",
        });

        data = await response.json();
        this.setState({ [tag]: csvtojson(data).map((v, i) => { return urlsettings.processor(v, i) }) });
      } catch (e) {
        console.log("the initial auth request was rejected", e)
      }
    })();


  }





  render() {
    const MapContainer = styled.div`
      width: 70%;
      height: 400px;
      float: left;
      @media (max-width: 800px) {
        width: 100%;
        margin: 0 auto;
      }`,

        HistContainer = styled.div`
        width: 30%;
        height: 350px;
        float: left;
        
        @media (max-width: 800px) {
          width: 60%;
          margin: 0 auto;
        }`,

        ScatterContainer = styled.div`
          width: 80%;
          height: 400px;
          margin: 0 auto;
        `
          
      ;


    const key = "47498d7e18b87cc6d3ffcc3b61ad9f9f5d2be790",
      standardAPIObj = {
        "url": "https://api.census.gov/data/2015/acs1/profile?",
        "for": "state:*",
        "key": key,
      }
      ,
      radOptions = [
        { "label": "High Scool Only Education", "apiObj": { ...standardAPIObj, "get": "NAME,DP02_0061E,DP02_0058E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0061E"], 10) / parseInt(v["DP02_0058E"], 10)) * 100), "numformat": "%" } } } },
        { "label": "Bachlors Education", "apiObj": { ...standardAPIObj, "get": "NAME,DP02_0064E,DP02_0058E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0064E"], 10) / parseInt(v["DP02_0058E"], 10)) * 100), "numformat": "%" } } } },
        { "label": "Unmarried Births (per 1k)", "apiObj": { ...standardAPIObj, "get": "NAME,DP02_0038E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": parseInt(v["DP02_0038E"], 10), "numformat": "(per 1k)" } } } },
        { "label": "White", "apiObj": { ...standardAPIObj, "get": "NAME,DP05_0032E,DP05_0028E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0032E"], 10) / parseInt(v["DP05_0028E"], 10)) * 100), "numformat": "%" } } } },
        { "label": "Black", "apiObj": { ...standardAPIObj, "get": "NAME,DP05_0033E,DP05_0028E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0033E"], 10) / parseInt(v["DP05_0028E"], 10)) * 100), "numformat": "%" } } } },
        { "label": "Hispanic", "apiObj": { "get": "NAME,DP05_0066E,DP05_0065E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0066E"], 10) / parseInt(v["DP05_0065E"], 10)) * 100), "numformat": "%" } } } },
        { "label": "No Health Insurace", "apiObj": { ...standardAPIObj, "get": "NAME,DP03_0099E,DP03_0095E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP03_0099E"], 10) / parseInt(v["DP03_0095E"], 10)) * 100), "numformat": "%" } } } },
        { "label": "Median Age", "apiObj": { ...standardAPIObj, "get": "NAME,DP05_0017E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": parseInt(v["DP05_0017E"], 10), "numformat": " years" } } } },
        { "label": "Median HH Income", "apiObj": { ...standardAPIObj, "get": "NAME,DP03_0062E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.trunc(parseInt(v["DP03_0062E"], 10) / 1000), "numformat": "k" } } } },
        //{ "label": "% Highly Religious", "apiObj": { "url": "http://rockthecatzva.com/dataviz-statestats/religosity.json", "processor": (v, i) => { return { "id": parseInt(v["id"], 10), "state": v["state"], "value": parseInt(v["val"], 10), "numformat": "%" } } } },
        //{ "label": "% Trump", "apiObj": { "url": "http://rockthecatzva.com/dataviz-statestats/trump.json", "processor": (v, i) => { return { "id": parseInt(v["id"]), "state": v["state"], "value": parseInt(v["val"]), "numformat": "%" } } } },
      ];

    return (<div className="main" onClick={this.onClearSettings} >
      <h1>American Community Survey Data from the Census Bureau (census.gov)</h1>
      <p>This is a react & d3.js visualization using the API data from census.gov.</p>
      <div className="input-section">
        <p className="instructs">Select a demographic from the dropdown list:</p>
        <Dropdown uxTag="StatSelected" uxCallback={this.onUxEvent} renderData={radOptions} />
        <p className="map-message">{this.state.mapMessage}</p>
      </div>


      {this.state.apiData &&
        <div>
          <MapContainer>
            <MapUSA renderData={this.state.apiData} uxCallback={this.onUxEvent} highlightStates={this.state.highlightStates} />
          </MapContainer>

          
          <HistContainer>
            <div className="histo-title"><p>Distribution of Values</p></div>
            <Histogram renderData={this.state.apiData} uxCallback={this.onUxEvent} highlightValue={this.state.highlightValue} />
          </HistContainer>

          <div className="scatter-title" >
            <p>Scatter Plot of</p>
            <p>{this.state.primaryLabel} vs.
                <Dropdown uxTag="secondary-stat-selected" uxCallback={this.onUxEvent} renderData={radOptions.slice().reverse()} />
            </p>
          </div>

          {this.state.secondaryData &&
            <ScatterContainer>
              <ScatterPlotLine primaryData={this.state.apiData} primaryLabel={this.state.primaryLabel} secondaryData={this.state.secondaryData} secondaryLabel={this.state.secondaryLabel} highlightStates={this.state.highlightStates} uxCallback={this.onUxEvent} />
            </ScatterContainer>
          }

        </div>
      }

      {!this.state.apiData &&
        <div>Data is loading</div>
      }


      <div><p className="column">Source: American Community Survrey (ACS) 2015. Religousity data is by Pew Research <a href="http://www.pewresearch.org/fact-tank/2016/02/29/how-religious-is-your-state/?state=alabama">link</a></p></div>

    </div>);
  }
}

export default App;
