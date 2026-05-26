const https = require('https');

https.get('https://freepd.com/music/Romantic/Love%20Theme.mp3', (res) => {
  console.log('Status Code:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
