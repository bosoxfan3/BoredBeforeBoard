'use strict';

const STORE = {
  station: null,
  directionAbbr: null,
  trainData: null,
  ronSwansonQuote: null,
  chuckNorrisJoke: null,
  youTubeData: [],
  BARTapi_key: 'MW9S-E7SL-26DU-VV8V',
  youtube_api_key: 'AIzaSyBQV-GhhCOVYxkTVYtSzufauAvpVxNr_4o'
};

//get train search results
const FIND_ETD_BY_STATION = 'https://api.bart.gov/api/etd.aspx';
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
  let result = `<h2>${item.destination}</h2>`;
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
  // console.log(trainData);
  if (STORE.directionAbbr === 'N') {
    results = `
    <h1>${trainData.name} - Northbound</h1>
    `;
  } else if (STORE.directionAbbr === 'S') {
    results = `
    <h1>${trainData.name} - Southbound</h1>
    `;
  }
  if (trainData.etd) {
    if (trainData.etd.length > 1) {
      trainData.etd.forEach(item => {
        results += renderMultipleDestinations(item);
      });
    } else if (trainData.etd[0].estimate.length > 1) {
      results += `<h2>${trainData.etd[0].destination}</h2>`;
      trainData.etd[0].estimate.map(item => {
        results += renderMultipleTrainTimes(item);
      });
    } else {
      results += `<h2>${trainData.etd[0].destination}</h2>`;
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
  STORE.station = $('#stationSearch').val();
  STORE.directionAbbr = $('#directionSearch').val();
  findETDFromAPI(STORE.station, STORE.directionAbbr, displayEstimatedTimesFromAPI);
  $('.js-homepage').attr('hidden', true);
  $('.js-results-page').removeAttr('hidden');
});

$('.js-train-refresh').click(() => {
  findETDFromAPI(STORE.station, STORE.directionAbbr, displayEstimatedTimesFromAPI);
});
//end get train search results

//get ron swanson quote
const FIND_RON_SWANSON_QUOTE = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
function findQuoteFromAPI(callback) {
  $.getJSON(FIND_RON_SWANSON_QUOTE, function(response) {
    STORE.ronSwansonQuote = response;
    displayQuoteFromAPI(STORE);
  });
}

function displayQuoteFromAPI(store) {
  let quoteData = store.ronSwansonQuote;
  let result = `
    <p>"${quoteData}"</p>
    <img src="https://media1.giphy.com/media/d7qFTitBNU9kk/giphy.gif">
  `;
  $('.js-ron-swanson-quote').html(result);
}

$('.js-display-quote').click(() => {
  findQuoteFromAPI(displayQuoteFromAPI);
});
//end get ron swanson quote

//get chuck norris joke
const FIND_CHUCK_NORRIS_JOKE = 'https://api.icndb.com/jokes/random';
function findJokeFromAPI(callback) {
  $.getJSON(FIND_CHUCK_NORRIS_JOKE, function(response) {
    STORE.chuckNorrisJoke = response;
    displayJokeFromAPI(STORE);
  });
}

function displayJokeFromAPI(store) {
  let jokeData = store.chuckNorrisJoke;
  let result = `
    <p>${jokeData.value.joke}</p>
    <img src="https://media1.tenor.com/images/eda65eadf312e50e52406da4f51a2906/tenor.gif?itemid=3565110">
  `;
  $('.js-chuck-norris-joke').html(result);
}

$('.js-display-joke').click(() => {
  findJokeFromAPI(displayJokeFromAPI);
});
//end get chuck norris joke

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
  let fourItems = items.slice(0, 4);
  //general youtube search returns 5 videos, I only wanted 4
  $.each(fourItems, function (index, value) {
    if (value.id.videoId) {
      let embedLink = 'https://www.youtube.com/embed/' + value.id.videoId;
      result += `<div title="youtube"><iframe width="200" height="150" src="${embedLink}"></iframe></div>`;
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

//event handlers for showing the various apis and also going back to search page
$('.js-bored-choice').submit(event => {
  event.preventDefault();
  let choice = $('#boredChoice').val();
  if (choice === 'ron') {
    $('.js-bored-jokes').attr('hidden', true);
    $('.js-display-joke').attr('hidden', true);
    $('.js-bored-videos').attr('hidden', true);
    $('.js-bored-quotes').removeAttr('hidden');
    $('.js-display-quote').removeAttr('hidden');
  }
  if (choice === 'chuck') {
    $('.js-bored-videos').attr('hidden', true);
    $('.js-bored-quotes').attr('hidden', true);
    $('.js-display-quote').attr('hidden', true);
    $('.js-bored-jokes').removeAttr('hidden');
    $('.js-display-joke').removeAttr('hidden');
  }
  if (choice === 'youtube') {
    $('.js-bored-quotes').attr('hidden', true);
    $('.js-display-quote').attr('hidden', true);
    $('.js-bored-jokes').attr('hidden', true);
    $('.js-display-joke').attr('hidden', true);
    $('.js-bored-videos').removeAttr('hidden');
  }
});

$('.js-go-homepage').click(() => {
  $('.js-homepage').removeAttr('hidden');
  $('.js-results-page').attr('hidden', true);
  $('.js-bored-quotes').attr('hidden', true);
  $('.js-display-quote').attr('hidden', true);
  $('.js-bored-jokes').attr('hidden', true);
  $('.js-display-joke').attr('hidden', true);
  $('.js-bored-videos').attr('hidden', true);
});
//end of event handlers for showing apis and going back to search page