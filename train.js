'use strict';

const STORE = {
  trainData: null,
  ronSwansonQuote: null,
  youTubeData: [],
  BARTapi_key: 'MW9S-E7SL-26DU-VV8V',
  youtube_api_key: 'AIzaSyBQV-GhhCOVYxkTVYtSzufauAvpVxNr_4o'
};

//get train search results
const FIND_ETD_BY_STATION = 'http://api.bart.gov/api/etd.aspx';
function findETDFromAPI(station, direction, callback) {
  let query = {
    cmd: 'etd',
    orig: station,
    key: STORE.BARTapi_key,
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
    item.estimate.forEach(item2 => {
      result += renderMultipleTrainTimes(item2);
    });
  } else {
    if (item.estimate[0].minutes === 'Leaving') {
      result += `
      <p>${item.estimate[0].minutes}, Platform ${item.estimate[0].platform}, Color: ${item.estimate[0].color}</p>
      `;
    } else {
      result += `
        <p>${item.estimate[0].minutes} Minutes, Platform ${item.estimate[0].platform}, Color: ${item.estimate[0].color}</p>
      `;
    }
  }
  return result;
}

function renderMultipleTrainTimes(item) {
  let results;
  if (item.minutes === 'Leaving') {
    results = `<p>${item.minutes}, Platform ${item.platform}, Color: ${item.color}</p>`;
    return results;
  } else {
    results = `<p>${item.minutes} Minutes, Platform ${item.platform}, Color: ${item.color}</p>`;
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
  if (trainData.etd) {
    if (trainData.etd.length > 1) {
      trainData.etd.forEach(item => {
        results += renderMultipleDestinations(item);
      });
    } else if (trainData.etd[0].estimate.length > 1) {
      results += `<h3>${trainData.etd[0].destination}</h3>`;
      trainData.etd[0].estimate.map(item => {
        results += renderMultipleTrainTimes(item);
      });
    } else {
      results += `<h3>${trainData.etd[0].destination}</h3>`;
      if (trainData.etd[0].estimate[0].minutes === 'Leaving') {
        results += `
      <p>${trainData.etd[0].estimate[0].minutes}, Platform ${trainData.etd[0].estimate[0].platform}, Color: ${trainData.etd[0].estimate[0].color}</p>
      `;
      } else {
        results += `
      <p>${trainData.etd[0].estimate[0].minutes} Minutes, Platform ${trainData.etd[0].estimate[0].platform}, Color: ${trainData.etd[0].estimate[0].color}</p>
      `;
      }
    }
  } else {
    results += '</p>No train data available for that station and direction.</p>';
  }
  $('.js-train-results').html(results);
}

$('.js-search-form').submit(event => {
  event.preventDefault();
  let station = $('#stationSearch').val();
  let direction = $('#directionSearch').val();
  findETDFromAPI(station, direction, displayEstimatedTimesFromAPI);
  $('.js-homepage').attr('hidden', true);
  $('.js-results-page').removeAttr('hidden');
});
//end get train search results

//get ron swanson quote
const FIND_RON_SWANSON_QUOTE = 'http://ron-swanson-quotes.herokuapp.com/v2/quotes';
function findQuoteFromAPI(callback) {
  $.getJSON(FIND_RON_SWANSON_QUOTE, function(response) {
    STORE.ronSwansonQuote = response;
    displayQuoteFromAPI(STORE);
  });
}

function displayQuoteFromAPI(store) {
  let quoteData = store.ronSwansonQuote;
  let result = `
    <p>${quoteData}</p>
    <img src="https://media1.giphy.com/media/d7qFTitBNU9kk/giphy.gif">
  `;
  $('.js-ron-swanson-quote').html(result);
}

$('.js-display-quote').click(event => {
  event.preventDefault();
  findQuoteFromAPI(displayQuoteFromAPI);
  $('.js-show-youtube-search').removeAttr('hidden');
});
//end get ron swanson quote

//get youtube search results
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
function getDataFromYouTubeAPI(searchTerm, callback) {
  const query = {
    q: searchTerm,
    part: 'snippet',
    key: STORE.youtube_api_key
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, function(response) {
    STORE.youTubeData = response;
    displayVideosFromYouTube(STORE);
  });
}

function renderYouTubeResults(items) {
  let result = ' ';
  $.each(items, function (index, value) {
    if (value.id.videoId) {
      let videoLink = 'https://www.youtube.com/watch?v=' + value.id.videoId;
      let embedLink = 'https://www.youtube.com/embed/' + value.id.videoId;
      if ((value.snippet.title).length > 35) {
        value.snippet.title = (value.snippet.title).substr(0, 35)+'...';
      }
      result += `<div title="youtube-video-${index}"><iframe width="350" height="250" src="${embedLink}"></iframe>` +
              '<br>' +
              `<a href="${videoLink}">${value.snippet.title}</a></div>`;
    }
  });
  $('.js-youtube-results').html(result);
}

function displayVideosFromYouTube(store) {
  let data = store.youTubeData;
  renderYouTubeResults(data.items);
}

$('.js-youtube-search').submit(event => {
  event.preventDefault();
  let typedInput = $('#youTubeSearch').val();
  getDataFromYouTubeAPI(typedInput);
  $('#youTubeSearch').val('');
});
//end get youtube search results

$('.js-show-quote-button').click(event => {
  event.preventDefault();
  $('.js-bored-quotes').removeAttr('hidden');
  $('.js-show-quote-button').attr('hidden', true);
});

$('.js-show-youtube-search').click(event => {
  event.preventDefault();
  $('.js-bored-videos').removeAttr('hidden');
});

$('.js-go-homepage').click(event => {
  $('.js-homepage').removeAttr('hidden');
  $('.js-results-page').attr('hidden', true);
});