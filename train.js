'use strict';

const STORE = {
  bookTitle: 'Ender\'s Game',
  trainData: null,
  youTubeData: [],
  api_key: 'MW9S-E7SL-26DU-VV8V',
  currentIndex: null
};

//get train search results
const FIND_ETD_BY_STATION = 'http://api.bart.gov/api/etd.aspx';
function findETDFromAPI(station, direction, callback) {
  let query = {
    cmd: 'etd',
    orig: station,
    key: STORE.api_key,
    dir: direction,
    json: 'y'
  };
  $.getJSON(FIND_ETD_BY_STATION, query, function(response) {
    STORE.trainData = response;
    displayEstimatedTimesFromAPI(STORE);
  });
}

function renderMultipleDestinations(item) {
  let result = `<h3>${item.destination}</h3>`;
  if (item.estimate.length > 1) {
    let multipleResults = item.estimate.map(item2 => {
      return renderMultipleTrainTimes(item2);
    });
    result += multipleResults;
  } else {
    if (item.estimate[0].minutes === 'Leaving') {
      result += `
      <p>${item.estimate[0].minutes}</p>
      `;
    } else {
      result += `
        <p>${item.estimate[0].minutes} Minutes</p>
      `;
    }
  }
  return result;
}

function renderMultipleTrainTimes(item) {
  let results;
  if (item.minutes === 'Leaving') {
    results = `<p>${item.minutes}</p>`;
    return results;
  } else {
    results = `<p>${item.minutes} Minutes</p>`;
    return results;
  }
}

function displayEstimatedTimesFromAPI(store) {
  let trainData = store.trainData.root.station[0];
  //have to do [0] because station is an array even though in our case
  //you will never get results for more than one station
  let results;
  console.log(trainData);
  results = `
    <h1>Results for ${trainData.name}</h1>
  `;
  if (trainData.etd.length > 1) {
    let multipleResults = trainData.etd.map(item => {
      return renderMultipleDestinations(item);
    });
    results += multipleResults;
  } else if (trainData.etd[0].estimate.length > 1) {
    let oneStationMultipleEstimates = trainData.etd[0].estimate.map(item => {
      return renderMultipleTrainTimes(item);
    });
    results += oneStationMultipleEstimates;
  } else {
    if (trainData.etd[0].estimate[0].minutes === 'Leaving') {
      results += `
      <p>${trainData.etd[0].estimate[0].minutes}</p>
      `;
    } else {
      results += `
      <p>${trainData.etd[0].estimate[0].minutes} Minutes</p>
      `;
    }
  }
  $('.js-train-results').html(results);
}

$('.js-search-form').submit(event => {
  event.preventDefault();
  let station = $('#stationSearch').val();
  let direction = $('#directionSearch').val();
  findETDFromAPI(station, direction, displayEstimatedTimesFromAPI);
});
//end get train search results