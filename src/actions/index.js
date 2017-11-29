import fetch from 'isomorphic-fetch'

export const REQUEST_CENSUSDATA = 'REQUEST_CENSUSDATA'
export const RECEIVE_CENSUSDATA = 'RECEIVE_CENSUSDATA'
export const VIZ_CLICK = 'VIZ_CLICK'
export const CLEAR_SELECTIONS = 'CLEAR_SELECTIONS'

export const vizClick = (message, highlightStates, highlightValues) => {
  return {
    type: VIZ_CLICK,
    message,
    highlightStates,
    highlightValues
  }
}

export const clearSelections = ()=>{
  return {
    type: CLEAR_SELECTIONS
  }
}


/*
export const clickHistogramBar = valRange => {
  return {
    type: 'HISTOGRAM_CLICK',
    valRange
  }
}

export const clickScatterPlotPoint = stateId => {
  return {
    type: 'SCATTER_CLICK',
    stateId
  }
}
*/

//COPIED FROM REDUX-REDDIT-API EXAMPLE

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}

export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}

function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

function fetchPosts(subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
  }
}



function receiveData(group, data) {
  console.log(data)
  return {
    type: RECEIVE_CENSUSDATA,
    group,
    data,
    //posts: json.data.children.map(child => child.data)
  }
}







function loadingError() {
  return {
    type: 'LOADING_ERROR'
  }
}


export function fetchCensusData(datagroup, apisettings) {
  return (dispatch) => {
    return fetch(buildURL(apisettings))
      .then(response => response.json())
      .then(json => {
        const data =  csvtojson(json).map(d=>apisettings.processor(d));
        return dispatch(receiveData(datagroup, data))})
  }
}


/*
export function itemsFetchData(url) {
    return (dispatch) => {
        dispatch(itemsIsLoading(true));

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                dispatch(itemsIsLoading(false));

                return response;
            })
            .then((response) => response.json())
            .then((items) => dispatch(itemsFetchDataSuccess(items)))
            .catch(() => dispatch(itemsHasErrored(true)));
    };
}
*/






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



function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    }
  }
}






