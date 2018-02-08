require("dotenv").config();
const fs = require('fs');
const apiKeys = require('./keys.js');

function log(text) { //call log() instead of console.log() to log to both console and file
  console.log(text);
  fs.appendFileSync('log.txt', text + '\n');
}

function logInput() { //this function is called every time liri.js runs to log the input command into log.txt
  fs.appendFileSync('log.txt', '\nnode liri ')
  for (i of process.argv.slice(2)) {
    fs.appendFileSync('log.txt', i + ' ')
  }
  fs.appendFileSync('log.txt', '\n ')
}

//instructions / help / manual
const instructions = function() { //this is called when user input was not a recognizable pattern
  log(`
  Instructions:
  ---------------------------

  To search tweets:
    node liri my-tweets [twitterUsernameToSearch]
    (Default username is ZYinMD)

  To search songs in Spotify:
    node liri spotify-this-song ["song name"]
    (Feel free to add other keywords like album, artist, etc. inside the same quote marks.
    Default search term is "The Sign, Ace of Base")

  To search movies:
    node liri movie-this ["movie name"]
    (Default search term is "Mr. Nobody")

  To let Liri do random search:
    node liri do-what-it-says
    `)
}

//Twitter:
const Twitter = require('twitter');
const twitter = new Twitter(apiKeys.twitter);

function twitterCall(twitterUserToSearch = 'ZYinMD') {
  twitter.get('statuses/user_timeline', {
    screen_name: twitterUserToSearch
  }, function(error, tweets, response) {
    if (error) {
      log(error);
      return;
    }
    tweets.length < 20 ? //< 20 means this user has less than 20 total tweets. Different wordings for that.
      log(`\n${twitterUserToSearch} has ${tweets.length} tweets in total:\n--------------------------------------`) :
      log(`\nShowing the first 20 tweets from ${twitterUserToSearch}:\n--------------------------------------`)
    for (let i of tweets) {
      log('- ' + i.text);
    }
  });
}

//Spotify
const Spotify = require('node-spotify-api');
const spotify = new Spotify(apiKeys.spotify);

function spotifyCall(query = 'The Sign, Ace of Base') {
  if (process.argv[4]) { //Show instructions if the 4th argument exists, user probably forgot to put quotes around song name.
    log(`
  Please use this format:
    node liri spotify-this-song "song name"
  Feel free to add other keywords like album, artist, etc. but within the same quote marks as the song name`)
    return
  }
  spotify.search({
    type: 'track',
    query: query,
    limit: 3 //just return the top 3 results. 1 is not enough more than 3 is useless
  }, function(err, data) {
    if (err) {
      log(err);
      return;
    }
    for (i of data.tracks.items) {
      log(`
    Artist: ${i.artists[0].name}
    Song Name: ${i.name}
    Album: ${i.album.name}
    Link: ${i.external_urls.spotify}`)
    }
  });
}

//OMDB
const request = require('request');

function omdbCall(movie = 'Mr. Nobody') {
  var queryURL = `https://www.omdbapi.com/?apikey=${apiKeys.omdbApiKey}&t=${movie}`;
  request(queryURL, function(error, response, body) {
    if (process.argv[4]) { //Show instructions if the 4th argument exists, user probably forgot to put quotes around song name.
      log(`
  Please use this format:
    node liri movie-this "movie name"`)
      return
    }
    if (error || response.statusCode != 200) {
      log('Error: ' + error);
      log('response status code =: ' + response.statusCode);
      return;
    }
    body = JSON.parse(body);
    // console.log(body);
    // var rottenTomatosRating;
    // if (body.Ratings) {
    //   rottenTomatosRating =  body.Ratings[0].Value;
    // } else {
    //   rottenTomatosRating =  'N/A';
    // }
    // var rottenTomatosRating = body.Ratings ? body.Ratings[1].Value : 'N/A';
    log(body.Error || // if body.Error exists, the call was successful but the movie was not found
  `
  Title: ${body.Title}
  Year: ${body.Year}
  IMDB Rating: ${body.imdbRating}
  Produced in: ${body.Country}
  Language: ${body.Language}
  Actors: ${body.Actors}
  Plot: ${body.Plot}`);
  })
}

function randomCall() { //do a search with a random line in random.txt
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
      return;
    }
    var arr = data.split('\n');
    pickOne = arr[Math.floor(Math.random() * (arr.length - 1))].split(', '); //minus 1 because the last line of the file is always an empty line, I set my text editor to do so for git purposes
    log(`\nnode liri ${pickOne[0]} ${pickOne[1]}`) //simulate a user input command line
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
