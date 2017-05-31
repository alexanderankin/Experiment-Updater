var fs = require('fs');

var homeDir = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE);
var TOKEN_DIR = homeDir + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// console.log('Using TOKEN_DIR', TOKEN_DIR);

// console.log(SCOPES, TOKEN_DIR, TOKEN_PATH);
// [ 'https://www.googleapis.com/auth/spreadsheets.readonly' ]
// '/home/$USER/.credentials/'
// '/home/$USER/.credentials/sheets.googleapis.com-nodejs-quickstart.json'

function get(callback) {
  fs.readFile(TOKEN_PATH, callback);
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 * @param {function} optional callback function(error){}
 */
function put(token, callback) {
  callback = callback || function noop() {};

  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }

  fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (e) {
    if (e) return callback(e);
    console.log('Token stored to ' + TOKEN_PATH);
    callback(null);
  });
}

module.exports = { get: get, put: put };
