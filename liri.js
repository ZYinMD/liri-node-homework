const f = require('./functions.js')
f.logInput();
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
    console.log('do-what-it-says');
    break;
  default:
    f.instructions();
}
