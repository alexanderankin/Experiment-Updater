var fs = require('fs');
var path = require('path');
var readline = require('readline');

var google = require('googleapis');
var googleAuth = require('google-auth-library');

var localTokenManager = require('./local-token');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// console.log(SCOPES, TOKEN_DIR, TOKEN_PATH);
// [ 'https://www.googleapis.com/auth/spreadsheets.readonly' ]

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId     = credentials.installed.client_id;
  var redirectUrl  = credentials.installed.redirect_uris[0];

  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  localTokenManager.get(function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(null, oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return callback(err);
      }
      oauth2Client.credentials = token;
      localTokenManager.put(token);
      callback(null, oauth2Client);
    });
  });
}

/**
 * This gets the client_secret.json file
 */
var location = path.join(__dirname, '..', '..', 'client_secret.json');
function getClientSecret(done) {
  fs.readFile(location, function (err, data) {
    if (err) return done(err);

    authorize(JSON.parse(data), function (err, auth) {
      if (err) return done(err);

      done(null, auth);
    });
  });
}

module.exports = {
  authorize:   authorize,
  getNewToken: getNewToken,
  getSecret:   getClientSecret,
  localApp:    require('./local-app-credentials')
};
