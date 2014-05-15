

/**
 *
 * @constructor
 */
function RSSZServer() {

    var http = null;
    var server = this;
    var ipcomm = require('ipc');
    var url = null;

    this.port = 1542;
    this.enabled = false;
    this.started = false;

    /** @constructs */
    (function() {

        http = remote.require("http");
        url = url = remote.require('url');

        http = http.createServer(function(request, response) {

            response.writeHead(200, {"Content-Type": "text/plain"});
            var data = request.url;//JSON.stringify(request);
            response.write("response!" + data);
            response.end();
            console.log("Request: " + request.url);


            var url_parts = url.parse(request.url, true);
            var query = url_parts.query;
            var path = url_parts.pathname;

            var params = [];
            var subparams = [];
            var aux = "";
            $.each(query, function(name, value) {
                if (name.indexOf('[') != -1) {
                    aux = name.split("]").join("").split('[');
                    subparams = params;
                    for (var i = 0; i < aux.length; ++i) {
                        if (typeof subparams[aux[i]] === "undefined") {
                            if (i == aux.length - 1) {
                                subparams[aux[i]] = value;
                            } else {
                                subparams[aux[i]] = [];
                            }
                        }
                        subparams = subparams[aux[i]];
                    }
                } else {
                    params[name] = value;
                }
            });
            var api = new RSSZApi(path, params);
            api.reduce();
            console.log(api.params);
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




