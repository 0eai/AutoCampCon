var request = require('request');
var cheerio = require('cheerio');

var form = {
  username: '16352041',
  password: 'tb6mb9qf'
};

const { 
  setInet
} = require('./fire');

const connect = (data) => {
  var url = 'http://10.58.0.1/login?dst=http%3A%2F%2F10.57.0.1%2Flogin%3Fdst%3Dhttp%253A%252F%252F1.254.254.254%252F%26username%3D' + data.username + '%26password%3D' + data.password + '&username=' + data.username + '&password=' + data.password;
  request(url, function (error, response, body) {
  console.log('connect:');
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode); 
  //console.log('body:', body);
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var isWordFound = searchForWord($, 'You are logged in');
      if(isWordFound) {
        console.log('You are logged in');
        setInet();
      } else {
        console.log('not');
     
      }
    }
  });
};

function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}
const status = (data) => {
  request('http://10.58.0.1/status', function (error, response, body) {
    console.log('status:');
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode); 
    //console.log('body:', body);
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var isWordFound = searchForWord($, data.username);
      if(isWordFound) {
        console.log('Welcome ' + data.username);
      } else {
        console.log('not');
        connect(form);
      }
      $('tr > td').each(function(i, element){
          var a = $(this).text();
          console.log(a);
      });
    }
  });
};

const logout = (data) => {
  request('http://10.58.0.1/logout', function (error, response, body) {
    console.log('logout:');
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode); 
    //console.log('body:', body);
    var $ = cheerio.load(body);
    var isWordFound = searchForWord($, 'you have just logged out');
    if(isWordFound) {
      console.log('you have just logged out');
    } else {
      console.log('not');
    }
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      $('tr').each(function(i, element){
        var a = $(this).prev();
        console.log(a.text());
      });
    }
  });
};


//connect(form);
status(form);
//logout(form);

setInterval(function(){
  status(form);
}, 30 * 1000);  

module.exports = {  connect, status, logout };
