// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// creates and mounts a logger function to see where requests are coming from
const LOGGER = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
}

app.use(LOGGER);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

function isValidDate(d) {
  // quickly checks if it's a date
  return d instanceof Date && !isNaN(d);
};

app.get("/api/timestamp", (req, res) => {
  // fancy one-liner to return current unix and utc times in case of no input
  res.json({unix: Date.parse(new Date()), utc: new Date().toUTCString()});
})

app.get("/api/timestamp/:date", (req, res) => {
  let date = req.params["date"];

  // if the input isn't already in unix format, convert it.
  let unixTimestamp = (isNaN(date)) ? Date.parse(date) : parseInt(date);

  // convert it into readable data using .toDateString()
  let localeDate = new Date(unixTimestamp).toUTCString();

  if(isValidDate(new Date(localeDate))) {
    // returns the unix timestamp and the utc date
    res.json({unix: unixTimestamp, utc: localeDate});
  } else {
    res.json({error: "Invalid Date"});
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 5000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});