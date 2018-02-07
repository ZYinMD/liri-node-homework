require("dotenv").config();
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
        console.log(`\nShowing the first 20 tweets from ${twitterUserToSearch}:\n--------------------------------------`) :
        console.log(`\n${twitterUserToSearch} has ${tweets.length} tweets in total:\n--------------------------------------`)
      for (let i of tweets) {
        console.log('- ' + i.text);
      }
    } else {
      console.log(error)
    }
  }
}
//for Spotify to work
const Spotify = require('node-spotify-api');
const spotify = new Spotify(apiKeys.spotify);
spotifyCall = function(query = 'The Sign Ace of Base') {
  if (process.argv[4]) {
    console.log(`
  Please use this format:
  \x1b[1mnode liri spotify-this-song "song name"
  \x1b[0mFeel free to add other keywords like album, artist, etc. but within the same quote marks as the song name`)
    return
  }
  spotify.search({
    type: 'track',
    query: query
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    for (i of data.tracks.items) {
      console.log(`
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
    console.log(`
  Please use this format:
  \x1b[1mnode liri movie-this "movie name"\x1b[0m`)
  return
  }
  if (error || response.statusCode != 200) {
    console.log('Error: ' + error);
    console.log('response status code =: ' + response.statusCode);
    return;
  } else {
    body = JSON.parse(body);
    console.log(body.Error || `
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

const instructions = function() {
  console.log(`
  Instructions:
  ---------------------------

  To search tweets:
  \x1b[1mnode liri my-tweets [twitterUsernameToSearch]\x1b[0m
  (Default username is ZYinMD)

  To search songs in Spotify:
  \x1b[1mnode liri spotify-this-song ["song name"]\x1b[0m
  (Feel free to add other keywords like album, artist, etc. inside the same quote marks.
  Default search term is "The Sign by Ace of Base")

  To search movies:
  \x1b[1mnode liri movie-this ["movie name"]\x1b[0m
  (Default search term is "Mr. Nobody")
    `)
}
module.exports = {
  twitterCall: twitterCall,
  instructions: instructions,
  spotifyCall: spotifyCall,
  omdbCall: omdbCall
}
