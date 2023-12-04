const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();

app.use(express.static(__dirname));

const httpsOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const localIpAddress = '192.168.1.53';
https.createServer(httpsOptions, app).listen(3000, localIpAddress, function () {
  console.log(`HTTPS server running on https://${localIpAddress}:3000`);
});
