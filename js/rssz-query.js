
var globals = { 'process_url': 'http://37.187.9.5/rssz/process.php' };

/** Class to manage search queries.
 * @constructor
 * @type {class}
 * @example
 * var manager = new queryManager();
 * @param config_params Array containing a set of configuration parameters.
 * @property {boolean} enabled if not enabled it won't perform any operation.
 */
function queryManager(config_params) {

    //public:
    this.enabled = true;
    this.quality = "good";
    this.orderby = "peers";
    this.pages = "1";
    this.query = "espa%C3%B1ol+|+spanish+|+castellano+movies+|+video+seed+%3E+20+size+%3E+600m+size+%3C++6000m+-hdtv+-screener+-latino+-xxx";

    //private:
    var this_qm = this;
    var config = config_params;
    var busy = false;
    /** Sets the relation between the named parameters on the web and the required parameter names at the back end. */
    var related = { 'good': 'feed', 'any': 'feed_any', 'verified': 'feed_verified', 'rating': 'N', 'date': 'A', 'size': 'S', 'peers': '' };

    /** @constructs */
    (function() {
        //Do something here...
    })();

    /** Set busy state.
     *
     * @see queryManager#isBusy
     * @param is_busy {boolean} new busy state.
     */
    this.setBusy = function(is_busy) {
        busy = is_busy;
    };

    /** Get object's busy state.
     *
     * @see {@link setBusy}
     * @returns {boolean} is either busy or not.
     */
    this.isBusy = function() {
        return busy;
    };

    /** Performs current search query if possible.
     *
     * @param tbody {object} target tbody container for results.
     * @param clear {boolean} whether to remove current results before appending new ones.
     * @returns {boolean} whether is being performed or not (does not mean completed).
     */
    this.perform = function(tbody, clear) {

        if (!busy && this.enabled) {

            this.refresh();
            busy = true;
            if (clear)
                tbody.html("");

            var process_params = related[this.quality] + related[this.orderby] + '-' + this.pages;

            var request = $.ajax({
                type: 'GET',
                url: config['process_url'],
                data: { f: 'json', 'p': process_params, 'q': this.query },
                async: true,
                xhrFields: {
                    withCredentials: false
                },
                crossDomain: true
            });

            request.success(function(data) {

                //var tbody = $('#results-table').find('tbody');
                $.each(data, function(i_channel, channel) {
                    $.each(channel, function(i, item) {
                        console.log(i + " = " + JSON.stringify(item));
                        if (item['title'] !== undefined) {

                            tbody.append('<tr><td><a href="'+item['link']+'">'+item['title']+'</a> <i class="fa fa-angle-double-right"></i> '+item['category']+'</td><td>'+jQuery.timeago(item['pubdate'])+'</td><td>'+item['size']+'</td><td>'+item['seeds']+'</td><td>'+item['peers']+'</td></tr>');
                        }
                    });
                });
                busy = false;
            });
            request.fail(function(data) {
                alert("fail: "+data);
                console.log(data);
                busy = false;
            });
        } else {
            alert("Either busy or disabled!");

            return false;
        }

        return true;
    };

    /** Update parameters value. */
    this.refresh = function() {

        if (!busy && this.enabled) {
            busy = true;

            this.quality = $('#quality').data('value');
            this.orderby = $('#order').data('value');
            this.pages = $('#pages').data('value');
            this.query = $('#search-query').val();
            //this.query = this.query.replace(' ', '+');
            /*this.query = this.query.replace(/[\u00A0-\u99999<>\&]/gim, function(i) {
                return '&#'+i.charCodeAt(0)+';';
            });*/

            busy = false;
        } else {
            alert("Either busy or disabled!");
        }
    };

}