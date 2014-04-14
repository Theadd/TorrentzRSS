
var body = $('body');

/* BASE64 */

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = {

// private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

// public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

// private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

// private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}


/* FLOATING ALERTS - GROWL */

/** Class to manage bootstrap growl floating alerts.
 * @constructor
 * @type {class}
 * @example
 * var abox = new alertManager();
 * abox.warn('This is a warning.');
 */
function alertManager() {
    /** @constructs */
    (function() {
        //Do something here...
    })();

    /** Set busy state.
     *
     * @see queryManager#isBusy
     * @param is_busy {boolean} new busy state.
     */
    this.warn = function(msg) {
        $.growl({
            icon: 'fa fa-warning',
            message: msg,
            title: ''
        }, {
            ele: "#content",
            type: "warning",
            allow_dismiss: true,
            position: {
                from: "top",
                align: "right"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            fade_in: 400,
            delay: 7000,
            pause_on_mouseover: true
        });
    };

    this.error = function(msg) {
        $.growl({
            icon: 'fa fa-times-circle-o',
            message: msg,
            title: ''
        }, {
            ele: "#content",
            type: "danger",
            allow_dismiss: true,
            position: {
                from: "top",
                align: "right"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            fade_in: 400,
            delay: 7000,
            pause_on_mouseover: true
        });
    };
}


/**
 *
 * @constructor
 */
function URLParameters() {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    /** @constructs */
    (function() {
        //Do something here...
    })();

    /**
     *
     * @param sParam
     * @returns {*}
     */
    this.get = function(sParam) {
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
        return "";
    };
}

/* SORTABLE SIDEBAR */

$(function  () {
    $("ul.main-menu").sortable({
        items: "li:not(.no-sortable)",
        placeholder: "placeholder"
    })
});

/* SORTABLE INNER SIDEBAR */

$(function  () {
    $("ul.sortable-inner").sortable({
        items: "li:not(.no-sortable-inner)",
        placeholder: "placeholder"
    });
});

/* NAV OPTIONs (i.e. radio buttons) */

body.on("click","a.nav-option-radio", function() {
    /*var group = $(this).closest("ul");
    group.find("a.nav-option-radio").removeClass("selected");
    $(this).addClass("selected");
    group.data("value", $(this).data("value"));*/

    var parent = $(this).closest("ul"),
        group = $(this).data("group");

    if (group === undefined) {
        parent.find("a.nav-option-radio").removeClass("selected");
        $(this).addClass("selected");
        parent.data("value", $(this).data("value"));
    } else {
        parent.find("a.nav-option-radio[data-group='" + group + "']").removeClass("selected");
        $(this).addClass("selected");
    }
});

body.on("click","a.nav-option-radio-optional", function() {
    var parent = $(this).closest("ul"),
        group = $(this).data("group"),
        selected = $(this).hasClass("selected");
    //ul[data-group='Companies']
    if (group === undefined) {
        parent.find("a.nav-option-radio-optional").removeClass("selected");
        if (!selected) $(this).addClass("selected");
        //parent.data("value", $(this).data("value"));
    } else {
        parent.find("a.nav-option-radio-optional[data-group='" + group + "']").removeClass("selected");
        if (!selected) $(this).addClass("selected");
    }
});

/* INITIALIZE SEARCH QUERY MANAGER */

var manager = null;
var abox = null;

jQuery(window).ready(function () {
    console.log("initializing search query manager");
    abox = new alertManager();
    manager = new queryManager(globals);
    manager.setLogger(abox);
    appResize();
    //test query for testing
    if (document.domain.substring(document.domain.length - 9, document.domain.length) == "local.com") {
        $("#search-query").val('"da vincis demons" | "falling skies" | continuum | defiance | "doctor who" | vikings | revolution | fringe | "game of thrones" | "marvel agents" | "orphan black" size > 500m size < 2g');
    }
    //load query, params and rules from url
    //var params = window.location.href.split("/"),
    //    last = params[params.length - 1];
//http://local.com:63342/TorrentzRSS/?p=feed_verifiedS-2&r=&q=%22da%20vincis%20demons%22%20|%20%22falling%20skies%22%20|%20continuum%20|%20defiance%20|%20%22doctor%20who%22%20|%20vikings%20|%20revolution%20|%20fringe%20|%20%22game%20of%20thrones%22%20|%20%22marvel%20agents%22%20|%20%22orphan%20black%22%20size%20%3E%20500m%20size%20%3C%202g#results
    var params = new URLParameters();
    var pval = params.get('p');
    var rval = params.get('r');
    var qval = params.get('q');
    if (pval.length && qval.length) {
        manager.loadSearch(pval, rval, qval);
        var query = decodeURIComponent(qval).replace(/\+/g, ' ');
        $('#search-query').val(query);

        var regex = /feed([a-z_]*)([A-Z]*)-([0-9]+)/g;
        var result;
        result = regex.exec(pval);
        if (result[3].length) {
            var page_element = {'1': 1, '2': 2, '5': 3, '10': 4, '100': 5 };
            $("#pages > li:nth-child(" + page_element[result[3]] + ") > a").click();
        }
        if (result[1].length) {
            if (result[1] == '_any') {
                $("#quality > li:nth-child(1) > a").click();
            } else {
                $("#quality > li:nth-child(3) > a").click();
            }
        }
        //var related = { 'good': 'feed', 'any': 'feed_any', 'verified': 'feed_verified', 'rating': 'N', 'date': 'A', 'size': 'S', 'peers': '' };
        if (result[2].length) {
            if (result[2] == 'N') {
                $("#order > li:nth-child(1) > a").click();
            } else if (result[2] == 'A') {
                $("#order > li:nth-child(2) > a").click();
            } else if (result[2] == 'S') {
                $("#order > li:nth-child(3) > a").click();
            }
        }
        /******/
        if (rval.length) {
            $('#no-selected-rule').hide();
            var bottom = $('#sidebar-rules-delimiter');
            var rules = rval.split(manager.rule_delimiter),
                i = 0,
                rev_rule = {'l': 'limit', 'm': 'merge', 'd': 'dupe-movies', 't': 'dupe-tv', 's': 'sort', 'e': 'exclude', 'c': 'eval' };
            //limit=l;merge=m;dupe-movies=d;dupe-tv=t;sort=s;exclude=e;eval=c
            for (; i < rules.length; ++i) {
                var name = rev_rule[rules[i].substring(0, 1)];
                bottom.before(sidebar_rules[name]); //add rule element to DOM
                var rule = bottom.prev().find(".query-rule");
                switch (name) {
                    case "limit":
                        rule.find('input').val(rules[i].substring(1));
                        break;
                    case "merge":
                        rule.find('input').val(rules[i].substring(1));
                        break;
                    case "dupe-movies":
                    case "dupe-tv":
                    case "sort":
                    case "exclude":
                        var mods = rules[i].substring(1).split("");
                        for (var e = 0; e < mods.length; ++e) {
                            if (name == "exclude" && mods[e] == 'p') {
                                rule.find('input').val(Base64.decode(rules[i].substring(e + 2)));
                                break;
                            }
                            rule.find("a[data-value='" + mods[e] + "']:not(.selected)").click(); //((name == 'sort') ? "" : ":not(.selected)")
                        }
                        break;
                    case "eval":
                        rule.find('input').val(Base64.decode(rules[i].substring(1)));
                        break;
                }
            }
            $("ul.sortable-inner").sortable({
                items: "li:not(.no-sortable-inner)",
                placeholder: "placeholder"
            });
        }


        //$(document).attr("title", $(document).attr("title") + " " + query);
        //LoadAjaxContent('results');

    }


   /* var regex = /^[0-9a-z]{20,50}$/;
    var m = regex.exec(last);
    if (m) {
        manager.loadUUID(m);
    }*/


});

/* HANDLE WINDOW RESIZE */

function appResize() {
    var content = $('#content'),
        available = $(window).height() - content.offset().top;
    content.css('min-height', available + 'px');
}

jQuery(window).resize(function () {
    appResize();
});


$(function () { $("[data-toggle='tooltip']").tooltip(); });


/* HANDLES FOR SIDEBAR MANAGER */

var sidebar_rules = {
    'limit': '<li class="dropdown">\
    <a href="#" class="dropdown-toggle">\
    <i class="fa fa-unlink"></i>\
    <span class="hidden-xs">Limit results</span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="limit" class="dropdown-menu query-rule">\
        <li class="no-sortable">\
            <div class="nav-option-textbox">\
                <input type="text" placeholder="Limit" class="pull-right" value="25"  style="width: calc(100% - 130px);" />\
            </div>\
            <a class="nav-option" href="#"><i class="fa fa-th-list"></i> Max shown</a>\
        </li>\
    </ul>\
</li>',
    'merge': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-cloud-download"></i>\
    <span class="hidden-xs">Merge query</span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="merge" class="dropdown-menu query-rule">\
        <li class="no-sortable">\
            <div class="nav-option-textbox">\
                <input type="text" placeholder=" UUID" class="pull-right" style="width: calc(100% - 80px); text-align: left;" />\
            </div>\
            <a class="nav-option" href="#"><i class="fa fa-link"></i> Query</a>\
        </li>\
    </ul>\
</li>',
    'dupe-movies': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-film"></i>\
    <span class="hidden-xs">Handle duplicates <span class="superscript hidden-sm hidden-md">MOVIES</span></span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="dupe-movies" class="dropdown-menu sortable-inner query-rule">\
        <li class="divider inner-divider no-sortable no-sortable-inner">CHECK &amp; REORDER BY PREFERENCE <i class="fa fa-lg fa-angle-double-down"></i></li>\
        <li class="no-sortable"><a data-value="Q" data-group="quality" class="nav-option nav-option-radio-optional selected" href="#"><i class="fa fa-check"></i> Better quality</a></li>\
        <li class="no-sortable"><a data-value="q" data-group="quality" class="nav-option nav-option-radio-optional" href="#"><i class="fa fa-check"></i> Poorer quality</a></li>\
        <li class="no-sortable"><a data-value="S" data-group="peers" class="nav-option nav-option-radio-optional selected" href="#"><i class="fa fa-check"></i> Quite more seeds</a></li>\
        <li class="no-sortable"><a data-value="P" data-group="peers" class="nav-option nav-option-radio-optional" href="#"><i class="fa fa-check"></i> Quite more peers</a></li>\
        <li class="no-sortable"><a data-value="L" data-group="size" class="nav-option nav-option-radio-optional" href="#"><i class="fa fa-check"></i> Larger sizes</a></li>\
        <li class="no-sortable"><a data-value="s" data-group="size" class="nav-option nav-option-radio-optional selected" href="#"><i class="fa fa-check"></i> Smaller sizes</a></li>\
    </ul>\
</li>',
    'dupe-tv': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-youtube-play"></i>\
    <span class="hidden-xs">Handle duplicates <span class="superscript hidden-sm hidden-md">TV</span></span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="dupe-tv" class="dropdown-menu sortable-inner query-rule">\
        <li class="divider inner-divider no-sortable no-sortable-inner">CHECK &amp; REORDER BY PREFERENCE <i class="fa fa-lg fa-angle-double-down"></i></li>\
        <li class="no-sortable"><a data-value="Q" data-group="quality" class="nav-option nav-option-radio-optional selected" href="#"><i class="fa fa-check"></i> Better quality</a></li>\
        <li class="no-sortable"><a data-value="q" data-group="quality" class="nav-option nav-option-radio-optional" href="#"><i class="fa fa-check"></i> Poorer quality</a></li>\
        <li class="no-sortable"><a data-value="S" data-group="peers" class="nav-option nav-option-radio-optional selected" href="#"><i class="fa fa-check"></i> Quite more seeds</a></li>\
        <li class="no-sortable"><a data-value="P" data-group="peers" class="nav-option nav-option-radio-optional" href="#"><i class="fa fa-check"></i> Quite more peers</a></li>\
        <li class="no-sortable"><a data-value="L" data-group="size" class="nav-option nav-option-radio-optional" href="#"><i class="fa fa-check"></i> Larger sizes</a></li>\
        <li class="no-sortable"><a data-value="s" data-group="size" class="nav-option nav-option-radio-optional selected" href="#"><i class="fa fa-check"></i> Smaller sizes</a></li>\
    </ul>\
</li>',
    'sort': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-sort"></i>\
    <span class="hidden-xs">Sort by</span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="sort" class="dropdown-menu no-sortable query-rule">\
        <ul class="dropdown-menu dropdown-persistent">\
            <li class="no-sortable"><a data-value="t" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Title</a></li>\
            <li class="no-sortable"><a data-value="d" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Date</a></li>\
            <li class="no-sortable"><a data-value="s" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Size</a></li>\
            <li class="no-sortable"><a data-value="p" class="nav-option nav-option-radio selected" href="#"><i class="fa fa-check"></i> Peers (S+L)</a></li>\
            <li class="no-sortable"><a data-value="e" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Seeds</a></li>\
            <li class="no-sortable"><a data-value="l" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Leechers</a></li>\
            <li class="no-sortable"><a data-value="m" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Seeds - Leechers</a></li>\
        </ul>\
        <ul class="dropdown-menu dropdown-persistent">\
            <li class="divider inner-divider no-sortable">OPTIONS</li>\
            <li class="no-sortable"><a data-value="A" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Ascending</a></li>\
            <li class="no-sortable"><a data-value="D" class="nav-option nav-option-radio selected" href="#"><i class="fa fa-check"></i> Descending</a></li>\
        </ul>\
    </ul>\
</li>',
    'exclude': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-reply"></i>\
    <span class="hidden-xs">Exclude results</span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="exclude" class="dropdown-menu query-rule">\
        <li class="no-sortable">\
            <div class="nav-option-textbox">\
                <input type="text" placeholder=" Pattern (Use lowercase letters!)" class="pull-right" style="width: 100%; text-align: left;" />\
            </div>\
            <a class="nav-option" href="#">&nbsp;</a>\
        </li>\
        <li class="divider inner-divider no-sortable no-sortable-inner">OPTIONS</li>\
        <li class="no-sortable"><a data-value="r" data-group="type" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Regular expression</a></li>\
        <li class="no-sortable"><a data-value="R" data-group="type" class="nav-option nav-option-radio selected" href="#"><i class="fa fa-check"></i> String literal</a></li>\
        <li class="no-sortable"><a data-value="m" data-group="match" class="nav-option nav-option-radio selected" href="#"><i class="fa fa-check"></i> Matching</a></li>\
        <li class="no-sortable"><a data-value="M" data-group="match" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> Non-matching</a></li>\
        <li class="no-sortable"><a data-value="t" data-group="field" class="nav-option nav-option-radio selected" href="#"><i class="fa fa-check"></i> From title field</a></li>\
        <li class="no-sortable"><a data-value="T" data-group="field" class="nav-option nav-option-radio" href="#"><i class="fa fa-check"></i> From category field</a></li>\
    </ul>\
</li>',
    'eval': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-question"></i>\
    <span class="hidden-xs">Evaluate condition</span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="eval" class="dropdown-menu query-rule">\
        <li class="no-sortable">\
            <div class="nav-option-textbox">\
                <input type="text" placeholder=" seeds > leechers * 2" class="pull-right" style="width: 100%; text-align: left;" data-toggle="tooltip" data-placement="right" data-html="true"\
                title="<b>Available parameters:</b><br><ul><li><b>seeds</b>: People sharing.</li><li><b>leechers</b>: People downloading.</li><li><b>peers</b>: All, seeds + leechers</li><li><b>size</b>: Torrent size (in MB).</li></ul><br><b>Operators:</b><ul><li><b>Arithmetic</b>: + - * / %</li><li><b>Comparison</b>: == != &lt; &gt; &lt;= &gt;=</li><li><b>Logic</b>: ! &amp;&amp; ||</li><li><b>Bitwise</b>: &amp; | ^ ~ &lt;&lt; &gt;&gt;</li></ul>" />\
            </div>\
            <a class="nav-option" href="#">&nbsp;</a>\
        </li>\
    </ul>\
</li>'
};





