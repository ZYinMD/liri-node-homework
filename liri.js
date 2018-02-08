const f = require('./functions.js')
f.logInput(); //call this every time, which logs the user input command into log.txt.
switch (process.argv[2]) {
  case 'my-tweets':
    f.twitterCall(process.argv[3]);
    break;
  case 'spotify-this-song':
    f.spotifyCall(process.argv[3]);
    break;
  case 'movie-this':
    f.omdbCall(process.argv[3]);
    break;
  case 'do-what-it-says':
    f.randomCall();
    break;
  default:
    f.instructions(); //if argument 2 isn't recognizable, show the instructions
}
