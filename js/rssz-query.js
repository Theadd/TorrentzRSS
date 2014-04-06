
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
    this.rules = '';
    this.rule_delimiter = '-';

    //private:
    var this_qm = this;
    var config = config_params;
    var busy = false;
    /** Sets the relation between the named parameters on the web and the required parameter names at the back end. */
    var related = { 'good': 'feed', 'any': 'feed_any', 'verified': 'feed_verified', 'rating': 'N', 'date': 'A', 'size': 'S', 'peers': '' };
    var log = null;

    /** @constructs */
    (function() {
        body.on("click","button.add-new-rule", function() {
            $('#sidebar-rules-delimiter').before(sidebar_rules[$(this).data("value")]);
            $("ul.sortable-inner").sortable({
                items: "li:not(.no-sortable-inner)",
                placeholder: "placeholder"
            });
            this_qm.validate();
        });


        body.on("click","button.query-rule-remove", function() {
            $(this).closest("li").remove();
        });

        body.on("click","button.query-rule-toggle", function() {
            var rule = $(this).closest("li").find(".query-rule"),
                icon = $(this).find("i");

            icon.toggleClass('fa-eye');
            icon.toggleClass('fa-eye-slash');
            $(this).closest("li").toggleClass('no-apply');

            if (rule.data('value').length) {
                rule.data('original', rule.data('value'));
                rule.data('value', '');
            } else {
                rule.data('value', rule.data('original'));
            }

        });
    })();

    /** Sets an instance of alertManager as logger.
     *
     * @see alertManager
     * @param alert_manager {object} Instance of alertManager class.
     */
    this.setLogger = function(alert_manager) {
        log = alert_manager;
    };

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


            var process_params = related[this.quality] + related[this.orderby] + '-' + this.pages;

            var request = $.ajax({
                type: 'GET',
                url: config['process_url'],
                data: { f: 'json', 'p': process_params, 'r': this.rules, 'q': this.query },
                async: true,
                xhrFields: {
                    withCredentials: false
                },
                crossDomain: true
            });

            request.success(function(data) {

                if (clear)
                    tbody.html("");

                $.each(data, function(i_channel, channel) {
                    $.each(channel, function(i, item) {
                        console.log(i + " = " + JSON.stringify(item));
                        if (item['title'] !== undefined) {

                            tbody.append('<tr><td><a href="'+item['link']+'">'+item['title']+'</a> <i class="fa fa-angle-double-right"></i> '+item['category']+'</td><td>'+jQuery.timeago(item['pubdate'])+'</td><td>'+item['size']+'</td><td>'+item['seeds']+'</td><td>'+item['peers']+'</td></tr>');
                        }
                    });
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
            });
        } else {
            log.warn("Either busy or disabled!");

            return false;
        }

        return true;
    };

    /** Update parameters value. */
    this.refresh = function() {

        if (!this_qm.isBusy() && this.enabled) {
            this.validate();
            this.setBusy(true);

            this.quality = $('#quality').data('value');
            this.orderby = $('#order').data('value');
            this.pages = $('#pages').data('value');
            this.query = $('#search-query').val();
            //this.query = this.query.replace(' ', '+');
            /*this.query = this.query.replace(/[\u00A0-\u99999<>\&]/gim, function(i) {
                return '&#'+i.charCodeAt(0)+';';
            });*/

            this.setBusy(false);
        } else {
            log.warn("Either busy or disabled!");
        }
    };

    this.validate = function() {
        if (!this_qm.isBusy()) {
            this_qm.setBusy(true);
            this_qm.rules = '';

            $.each($('.query-rule'), function() {
                var value = getSidebarRule($(this));
                if (value.length) {
                    this_qm.rules += this_qm.rule_delimiter + value;
                }
            });

            this_qm.rules = this_qm.rules.substr(this.rule_delimiter.length);
            this_qm.setBusy(false);
        } else {
            log.warn("Either busy or disabled!");
        }
    }

    function getSidebarRule(rule) {
        var name = rule.data('value'),
            value = '';

        switch (name) {
            case "limit":
                var aux = parseInt(rule.find('input').val());
                if (aux > 0) {
                    value = 'l' + aux;
                } else {
                    log.warn("Rule 'limit results' should be greater than zero.");
                }
                break;
            case "merge":
                value = 'm' + rule.find('input').val();
                break;
            case "dupe-movies":
                value = 'd';
                rule.find('a.selected').each(function() {
                    value += $(this).data('value');
                });
                break;
        }

        return value;
    }

}