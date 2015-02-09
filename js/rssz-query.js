
var globals = { 'process_url': 'http://37.187.9.5:8080/TorrentzRSS/process.php', 'title': 'TorrentzRSS!' };

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
    this.settings = "t15-d120-rk-Lm";
    this.rules = '';
    this.rule_delimiter = '-';

    //private:
    var this_qm = this;
    var config = config_params;
    var busy = false;
    /** Sets the relation between the named parameters on the web and the required parameter names at the back end. */
    var related = { 'good': 'feed', 'any': 'feed_any', 'verified': 'feed_verified', 'rating': 'N', 'date': 'A', 'size': 'S', 'peers': '' };
    var log = null;
    var last_p = '';
    var last_r = '';
    var last_q = '';
    var temp_p = '';
    var skip_refresh = false;

    /** @constructs */
    (function() {
        body.on("click","button.add-new-rule", function() {
            //$('#no-selected-rule').before().css('border-bottom', "1px solid rgba(255, 255, 255, 0.5) !important");
            $('#no-selected-rule').hide();
            $('#sidebar-rules-delimiter').before(sidebar_rules[$(this).data("value")]);
            $("ul.sortable-inner").sortable({
                items: "li:not(.no-sortable-inner)",
                placeholder: "placeholder"
            });
            this_qm.validate();
            $("[data-toggle='tooltip']").tooltip();
        });


        body.on("click","button.query-rule-remove", function() {
            $(this).closest("li").remove();
            if (!$('.query-rule').size()) {
                //$('#no-selected-rule').before().css('border-bottom', 0);
                $('#no-selected-rule').show();
            }
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

        body.on("click","#get-uuid", function(e) {
            if (!this_qm.isBusy()) {
                this_qm.setBusy(true);

                var request = $.ajax({
                    type: 'GET',
                    url: config['process_url'],
                    data: { f: 'json', 'p': last_p, 'r': last_r, 'q': last_q, 'tiny': true },
                    async: true,
                    xhrFields: {
                        withCredentials: false
                    },
                    crossDomain: true
                });

                request.success(function(data) {
                    $("#uuid-container").html("* <b>UUID</b>: " + data);
                    _cookie("uuid", data);
                    this_qm.setBusy(false);
                });
                request.fail(function(data) {
                    log.warn("Fail: "+data);
                    this_qm.setBusy(false);
                });
            } else {
                log.warn("Either busy or disabled!");
            }
            e.preventDefault();
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

    this.updateStats = function() {

        var request = $.ajax({
            type: 'GET',
            url: config['process_url'],
            data: { stats: true },
            async: true,
            xhrFields: {
                withCredentials: false
            },
            crossDomain: true
        });

        request.success(function(data) {
            $("#total-queries").html(nFormatter(data['queries']));
            $("#excluded-torrents").html(nFormatter(data['excluded']));
            $("#parsed-torrents").html(nFormatter(data['total']));
        });
    };

    function nFormatter(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num;
    }

    this.loadUUID = function(uuid) {
        this_qm.setBusy(true);

        var request = $.ajax({
            type: 'GET',
            url: config['process_url'],
            data: { uuid: uuid },
            async: true,
            xhrFields: {
                withCredentials: false
            },
            crossDomain: true
        });

        request.success(function(data) {

            //load query, parameters and rules
            var query = data['q'];
            //TODO: Not implemented

            this_qm.setBusy(false);
            //run query
        });
        request.fail(function(data) {

            log.warn("Fail: "+data);
            this_qm.setBusy(false);
        });
    };

    this.loadSearch = function(p, r, q) {
        skip_refresh = true;

        temp_p = p;
        this.rules = r;
        this.query = q;
    };

    /** Performs current search query if possible.
     *
     * @param tbody {object} target tbody container for results.
     * @param clear {boolean} whether to remove current results before appending new ones.
     * @returns {boolean} whether is being performed or not (does not mean completed).
     */
    this.perform = function(tbody, clear) {

        if (!busy && this.enabled) {

            var process_params = '';
            if (!skip_refresh) {
                this.refresh();
                process_params = related[this.quality] + related[this.orderby] + this.rule_delimiter + this.pages + this.rule_delimiter + this.settings;
            } else {
                skip_refresh = false;
                process_params = temp_p;
            }

            var title2 = decodeURIComponent(this.query).replace(/\+/g, ' ');
            $(document).attr("title", config['title'] + " " + title2);

            busy = true;

            last_p = process_params;
            last_r = this.rules;
            last_q = this.query;

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

            $("#rss-url").attr("href", config['process_url'] + "?f=rss&p=" + process_params + "&r=" + this.rules + "&q=" + this.query);
            $("#json-url").attr("href", config['process_url'] + "?f=json&p=" + process_params + "&r=" + this.rules + "&q=" + this.query);
            $("#web-url").attr("href", "?p=" + process_params + "&r=" + this.rules + "&q=" + this.query + "#results");

            request.success(function(data) {

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
                bootstro.nextWithDelay();
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
            _cookie("search-query", this.query);
            //general settings    //"t15-d120-rk-Lm";
            var dupe_settings = $("#dupe-delay");
            this.settings = "t" + parseInt($("#ttl").find('input').val()) + this_qm.rule_delimiter + "d" + parseInt(dupe_settings.find('input').val()) + this_qm.rule_delimiter;
            dupe_settings.find('a.selected').each(function() {
                this_qm.settings += $(this).data('value');
            });
            this.settings += this_qm.rule_delimiter + "L" + $("#links-source").find('a.selected').first().data('value');

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
            //log.warn(this_qm.rules);
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
            case "intersection":
                value = 'i' + rule.find('input').val();
                break;
            case "dupe-movies":
                value = 'd';
                rule.find('a.selected').each(function() {
                    value += $(this).data('value');
                });
                break;
            case "dupe-tv":
                value = 't';
                rule.find('a.selected').each(function() {
                    value += $(this).data('value');
                });
                break;
            case "sort":
                value = 's';
                rule.find('a.selected').each(function() {
                    value += $(this).data('value');
                });
                break;
            case "exclude":
                var pattern = Base64.encode(rule.find('input').val());
                value = 'e';
                rule.find('a.selected').each(function() {
                    value += $(this).data('value');
                });
                value += 'p'+pattern;
                break;
            case "eval":
                var condition = Base64.encode(rule.find('input').val());
                value = 'c'+condition;
                break;
        }

        return value;
    }

}