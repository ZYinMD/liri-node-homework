require("dotenv").config();
const fs = require('fs');
const apiKeys = require('./keys.js');

//for Twitter to work:
const Twitter = require('twitter');
const twitter = new Twitter(apiKeys.twitter);
var twitterCall = function(twitterUserToSearch = 'ZYinMD') {
  twitter.get('statuses/user_timeline', {
    screen_name: twitterUserToSearch
  }, showTweets);

  function showTweets(error, tweets, response) { //this function is the callback of twitterCall
    if (!error) {
      tweets.length == 20 ?
        log(`\nShowing the first 20 tweets from ${twitterUserToSearch}:\n--------------------------------------`) :
        log(`\n${twitterUserToSearch} has ${tweets.length} tweets in total:\n--------------------------------------`)
      for (let i of tweets) {
        log('- ' + i.text);
      }
    } else {
      log(error)
    }
  }
}

//for Spotify to work
const Spotify = require('node-spotify-api');
const spotify = new Spotify(apiKeys.spotify);
spotifyCall = function(query = 'The Sign Ace of Base') {
  if (process.argv[4]) {
    log(`
  Please use this format:
    node liri spotify-this-song "song name"
  Feel free to add other keywords like album, artist, etc. but within the same quote marks as the song name`)
    return
  }
  spotify.search({
    type: 'track',
    query: query
  }, function(err, data) {
    if (err) {
      return log('Error occurred: ' + err);
    }
    for (i of data.tracks.items.slice(0,3)) {
      log(`
    Artist: ${i.artists[0].name}
    Song Name: ${i.name}
    Album: ${i.album.name}
    Link: ${i.external_urls.spotify}`)
    }
  });
}

//for OMDB to work
const request = require('request');
function omdbCall(movie = 'Mr. Nobody') {
  var queryURL = `https://www.omdbapi.com/?apikey=${apiKeys.omdbApiKey}&t=${movie}`;
  request(queryURL, showMovie)
}

function showMovie(error, response, body) {
  if (process.argv[4]) {
    log(`
  Please use this format:
    node liri movie-this "movie name"`)
    return
  }
  if (error || response.statusCode != 200) {
    log('Error: ' + error);
    log('response status code =: ' + response.statusCode);
    return;
  } else {
    body = JSON.parse(body);
    log(body.Error || `
Title: ${body.Title}
Year: ${body.Year}
IMDB Rating: ${body.imdbRating}
Rotten Tomatos Rating: ${body.Ratings[1].Value}
Produced in: ${body.Country}
Language: ${body.Language}
Plot: ${body.Plot}
Actors: ${body.Actors}`);
  }
}

//instructions / help / manual
const instructions = function() {
  log(`
  Instructions:
  ---------------------------

  To search tweets:
    node liri my-tweets [twitterUsernameToSearch]
    (Default username is ZYinMD)

  To search songs in Spotify:
    node liri spotify-this-song ["song name"]
    (Feel free to add other keywords like album, artist, etc. inside the same quote marks.
    Default search term is "The Sign by Ace of Base")

  To search movies:
    node liri movie-this ["movie name"]
    (Default search term is "Mr. Nobody")

  To let Liri do random search:
    node liri do-what-it-says
    `)
}

function log(text) {
  console.log(text);
  fs.appendFileSync('log.txt', text + '\n');
}

function logInput() {
  fs.appendFileSync('log.txt', '\nnode liri ')
  for (i of process.argv.slice(2)) {
    fs.appendFileSync('log.txt', i + ' ')
  }
  fs.appendFileSync('log.txt', '\n ')
}

function randomCall() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var arr = data.split('\n');
    pickOne = arr[Math.floor(Math.random() * (arr.length - 1))].split(', '); //minus 1 because the last line of the file is always an empty one, I set my text editor to do so
    log(`\nnode liri ${pickOne[0]} ${pickOne[1]}`)
    if (pickOne[0] == 'spotify-this-song') {
      spotifyCall(pickOne[1]);
    }
    if (pickOne[0] == 'movie-this') {
      omdbCall(pickOne[1]);
    }
  });
}

//exports:
module.exports = {
  twitterCall: twitterCall,
  instructions: instructions,
  spotifyCall: spotifyCall,
  omdbCall: omdbCall,
  randomCall: randomCall,
  logInput: logInput
}
