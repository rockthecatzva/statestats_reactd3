import { combineReducers } from 'redux'
import {
  RECEIVE_CENSUSDATA,
  VIZ_CLICK,
  CLEAR_SELECTIONS,
  CHANGE_DATALABEL
} from '../actions'


function selectionLabels(state = { "message": "Click on a graphic for more info", "highlightStates": [] }, action) {
  switch (action.type) {
    case RECEIVE_CENSUSDATA:
      return { ...state };
    case VIZ_CLICK:
      return { ...state, ...{ "message": action.message, "highlightStates": action.highlightStates } };
    case CLEAR_SELECTIONS:
      return { ...state, ...{ "message": "Click on a graphic for more info", "highlightStates": [] } };
    case CHANGE_DATALABEL:
      return {...state, [action.group]: action.label}
    default:
      return state;
  }

}


function censusData(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CENSUSDATA:
      return Object.assign({}, state, {
        [action.group]: action.data
      });
    default:
      return state;
  }
}



const key = "47498d7e18b87cc6d3ffcc3b61ad9f9f5d2be790",
  standardAPIObj = {
    "url": "https://api.census.gov/data/2015/acs1/profile?",
    "for": "state:*",
    "key": key,
  }
  ,
  dropDownOptions = [
    { "option": { ...standardAPIObj, "label": "High Scool Only Education", "get": "NAME,DP02_0061E,DP02_0058E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0061E"], 10) / parseInt(v["DP02_0058E"], 10)) * 100), "numformat": "%" } } } },
    { "option": { ...standardAPIObj, "label": "Bachelors Education", "get": "NAME,DP02_0064E,DP02_0058E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0064E"], 10) / parseInt(v["DP02_0058E"], 10)) * 100), "numformat": "%" } } } },
    { "option": { ...standardAPIObj, "label": "Unmarried Births (per 1k)", "get": "NAME,DP02_0038E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": parseInt(v["DP02_0038E"], 10), "numformat": "(per 1k)" } } } },
    { "option": { ...standardAPIObj, "label": "White", "get": "NAME,DP05_0032E,DP05_0028E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0032E"], 10) / parseInt(v["DP05_0028E"], 10)) * 100), "numformat": "%" } } } },
    { "option": { ...standardAPIObj, "label": "Black", "get": "NAME,DP05_0033E,DP05_0028E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0033E"], 10) / parseInt(v["DP05_0028E"], 10)) * 100), "numformat": "%" } } } },
    { "option": { ...standardAPIObj, "label": "Hispanic", "get": "NAME,DP05_0066E,DP05_0065E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0066E"], 10) / parseInt(v["DP05_0065E"], 10)) * 100), "numformat": "%" } } } },
    { "option": { ...standardAPIObj, "label": "No Health Insurace", "get": "NAME,DP03_0099E,DP03_0095E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP03_0099E"], 10) / parseInt(v["DP03_0095E"], 10)) * 100), "numformat": "%" } } } },
    { "option": { ...standardAPIObj, "label": "Median Age", "get": "NAME,DP05_0017E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": parseInt(v["DP05_0017E"], 10), "numformat": " years" } } } },
    { "option": { ...standardAPIObj, "label": "Median HH Income", "get": "NAME,DP03_0062E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.trunc(parseInt(v["DP03_0062E"], 10) / 1000), "numformat": "k" } } } }
  ];

function dataOptions(state = [...dropDownOptions]) {
  return state;
}




const censusReducer = combineReducers({
  selectionLabels,
  dataOptions,
  censusData
})

export default censusReducer;