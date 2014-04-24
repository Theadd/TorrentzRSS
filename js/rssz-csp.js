

simpleAJAXLib = {
    init: function () {
        //this.fetchJSON('http://37.187.9.5/rssz/process.php?f=rss&p=feed-1-t15-d120-rk&r=&q=skidrow');
        this.fetchJSON('http://torrentz.eu/any?f=skidrow');
    },

    fetchJSON: function (url) {
        var root = 'https://query.yahooapis.com/v1/public/yql?q=';
        var yql = 'select * from html where url="' + url + '"';
        var proxy_url = root + encodeURIComponent(yql) + '&format=json&diagnostics=false&callback=simpleAJAXLib.display';
        document.getElementsByTagName('body')[0].appendChild(this.jsTag(proxy_url));
    },

    jsTag: function (url) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        return script;
    },

    display: function (results) {
        // do the necessary stuff
        console.log(results);
        //document.getElementById('demo').innerHTML = "Result = " + (results.error ? "Internal Server Error!" : JSON.stringify(results.query.results));
    }
}

function csProcess() {
    /** @constructs */
    (function() {
        //Do something here...
    })();

    this.perform = function(tbody, clear) {
        simpleAJAXLib.init();
        /*var request = $.ajax({
            type: 'GET',
            url: 'http://torrentz.eu/feed',
            data: { q: 'skidrow' },
            async: true,
            xhrFields: {
                withCredentials: false
            },
            crossDomain: true
        });

        $("#rss-url").attr("href", config['process_url'] + "?f=rss&p=" + process_params + "&r=" + this.rules + "&q=" + this.query);
        $("#json-url").attr("href", config['process_url'] + "?f=json&p=" + process_params + "&r=" + this.rules + "&q=" + this.query);
        $("#web-url").attr("href", "?p=" + process_params + "&r=" + this.rules + "&q=" + this.query + "#results");

        request.success(function(data) {
            console.log(data);
            if (clear)
                tbody.html("");

            $.each(data, function(i_channel, channel) {
                $.each(channel, function(i, item) {
                    if (item['title'] !== undefined) {
                        tbody.append('<tr><td><a href="'+item['link']+'">'+item['title']+'</a> <i class="fa fa-angle-double-right"></i> '+item['category']+'</td><td>'+jQuery.timeago(item['pubtimestamp'].toString())+'</td><td>'+item['size']+'</td><td>'+item['seeds']+'</td><td>'+item['leechers']+'</td></tr>');
                    }
                });
                $.each(channel['errors'], function(i, item) {
                    log.error(item);
                });
                $('#results-info').html("<b>" + channel['total'] + " Matching results!</b><br />\nExcluded " + channel['excluded'] + " out of " + (channel['total'] + channel['excluded']) + " results.");
            });

            $('#ajax-content').show();
            $('.preloader').hide();

            busy = false;
        });
        request.fail(function(data) {
            log.warn("Fail: "+data);
            console.log(data);

            $('#ajax-content').show();
            $('.preloader').hide();

            busy = false;
        });*/
    };

}