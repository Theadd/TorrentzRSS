

/**
 *
 * @constructor
 */
function RSSZServer() {

    var http = null;
    var server = this;
    var ipcomm = require('ipc');

    this.port = 1542;
    this.enabled = false;
    this.started = false;

    /** @constructs */
    (function() {

        http = remote.require("http");

        http = http.createServer(function(request, response) {

            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write("response!" + request.url);
            response.end();
            console.log("Request: " + request.url);
        });

        ipcomm.on('reload-config', function(event, arg) {
            server.reload();
        });

        console.log("Server initiated!");
    })();

    this.start = function() {
        server.reload();
    };

    this.stop = function() {
        if (server.started) {
            console.log("Closing...");
            http.close();
            console.log("Closed");
        }
    };

    this.reload = function() {
        console.log("Reloading...");
        var _port = _cookie('server-port') || 1542;
        var _enabled = _cookie('server') || false;
        if (_port != server.port && _enabled != server.enabled) {
            server.port = parseInt(_port);
            server.enabled = _enabled;
            server.stop();
            if (server.enabled) {
                console.log("Starting on port " + server.port);
                http.listen(server.port);
                server.started = true;
                console.log("Started");
            }
        }
        console.log("Reloaded");
    };
}




