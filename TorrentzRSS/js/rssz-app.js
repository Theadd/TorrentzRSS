var optionsWindow = null;

$(function  () {
    if (!window.atomApp) {
      $("a.toggle-devtools").parent().addClass("disabled");
    }
});

body.on("click","a.toggle-devtools", function() {
  if (window.atomApp) {
    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    BrowserWindow.getAllWindows()[0].toggleDevTools();
  }
});

body.on("click","a.reload-ignore-cache", function() {
  if (window.atomApp) {
    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    BrowserWindow.getAllWindows()[0].reloadIgnoringCache();
  } else {
    window.location.reload(true);
  }
});

body.on("click","a.toggle-options", function() {
  if (window.atomApp) {
      console.log("1");
    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    optionsWindow = new BrowserWindow({width: 400, height: 400 });
      console.log("2");
    // and load the index.html of the app.
    optionsWindow.loadUrl('file://' + __dirname + '/window.html#options');
    optionsWindow.setAlwaysOnTop(true);
      console.log("3");
    optionsWindow.setTitle("Options");
      console.log("4");
    //optionsWindow.flashFrame();
      console.log("5");
    // Emitted when the window is closed.
    optionsWindow.on('closed', function() {
      optionsWindow = null;
    });
console.log("REQUIRE HTTP!");
      var http = remote.require('http');
      console.log("REQUIRED");
      var options = {   //http://torrentz.eu/feed?q=skidrow+games
          host: 'torrentz.eu',
          port: 80,
          path: '/feed?q=skidrow+games',
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
          }
      };
      /*var agent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';
      var options = {   //http://torrentz.eu/feed?q=skidrow+games
          host: '37.187.9.5',
          port: 80,
          path: '/',
          method: 'GET'
      };*/

      var req = http.request(options, function(res) {
          console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
          });
      });

      req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
      });

      // write data to request body
      req.write('data\n');
      req.write('data\n');
      //window.req = req;
      req.end();

      /*var requestify = remote.require('requestify');
      requestify.get('http://example.com').then(function(response) {
          // Get the response body (JSON parsed - JSON response or jQuery object in case of XML response)
          response.getBody();

          // Get the response raw body
          console.log(response.body);
      });*/

  } else {
    //window.location.reload(true);
  }
});
