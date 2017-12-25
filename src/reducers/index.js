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
      return { ...state, "highlightStates":[], "message": "Click on a graphic for more info" };
    case VIZ_CLICK:
      return { ...state, ...{ "message": action.message, "highlightStates": action.highlightStates } };
    case CLEAR_SELECTIONS:
      return { ...state, ...{ "message": "Click on a graphic for more info", "highlightStates": [] } };
    case CHANGE_DATALABEL:
      return {...state, [action.group]: action.option}
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



const censusReducer = combineReducers({
  selectionLabels,
  censusData
})

export default censusReducer;