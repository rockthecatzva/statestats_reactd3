
//import todos from './todos'
//import visibilityFilter from './visibilityFilter'
//import stateselect from './stateselect';

import { combineReducers } from 'redux'
import {
  //SELECT_SUBREDDIT,
  //INVALIDATE_SUBREDDIT,
  //REQUEST_POSTS,
  //RECEIVE_POSTS,
  RECEIVE_CENSUSDATA,
  VIZ_CLICK,
  CLEAR_SELECTIONS
} from '../actions'

/*
function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

function posts(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      })
    default:
      return state
  }
}
*/


function selectionLabels(state={"message": "Click on a graphic for more info", "highlightStates": [], "highlightValues": []}, action){
  switch(action.type){
    case RECEIVE_CENSUSDATA:
      return {...state};
    case VIZ_CLICK:
      return {...state, ...{"message": action.message, "highlightStates": action.highlightStates, "highlightValues": action.highlightValues}};
    case CLEAR_SELECTIONS:
      return {...state, ...{"message": "Click on a graphic for more info", "highlightStates": [], "highlightValues": []}}
    default:
      return state;
  }

}


function censusData(state={}, action){
  switch(action.type){
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
    { "label": "High Scool Only Education", "value": { ...standardAPIObj, "get": "NAME,DP02_0061E,DP02_0058E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0061E"], 10) / parseInt(v["DP02_0058E"], 10)) * 100), "numformat": "%" } } } },
    { "label": "Bachelors Education", "value": { ...standardAPIObj, "get": "NAME,DP02_0064E,DP02_0058E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0064E"], 10) / parseInt(v["DP02_0058E"], 10)) * 100), "numformat": "%" } } } },
    { "label": "Unmarried Births (per 1k)", "value": { ...standardAPIObj, "get": "NAME,DP02_0038E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": parseInt(v["DP02_0038E"], 10), "numformat": "(per 1k)" } } } },
    { "label": "White", "value": { ...standardAPIObj, "get": "NAME,DP05_0032E,DP05_0028E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0032E"], 10) / parseInt(v["DP05_0028E"], 10)) * 100), "numformat": "%" } } } },
    { "label": "Black", "value": { ...standardAPIObj, "get": "NAME,DP05_0033E,DP05_0028E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0033E"], 10) / parseInt(v["DP05_0028E"], 10)) * 100), "numformat": "%" } } } },
    { "label": "Hispanic", "value": { "get": "NAME,DP05_0066E,DP05_0065E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0066E"], 10) / parseInt(v["DP05_0065E"], 10)) * 100), "numformat": "%" } } } },
    { "label": "No Health Insurace", "value": { ...standardAPIObj, "get": "NAME,DP03_0099E,DP03_0095E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.round((parseInt(v["DP03_0099E"], 10) / parseInt(v["DP03_0095E"], 10)) * 100), "numformat": "%" } } } },
    { "label": "Median Age", "value": { ...standardAPIObj, "get": "NAME,DP05_0017E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": parseInt(v["DP05_0017E"], 10), "numformat": " years" } } } },
    { "label": "Median HH Income", "value": { ...standardAPIObj, "get": "NAME,DP03_0062E", "processor": (v, i) => { return { "id": parseInt(v["state"], 10), "state": v["NAME"], "value": Math.trunc(parseInt(v["DP03_0062E"], 10) / 1000), "numformat": "k" } } } }
  ];

function dataOptions(state = [...dropDownOptions]) {
  return state;
}




const censusReducer = combineReducers({
  //postsBySubreddit,
  //selectedSubreddit,
  selectionLabels,
  dataOptions,
  censusData
})

export default censusReducer;