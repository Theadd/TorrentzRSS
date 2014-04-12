
var body = $('body');

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
            type: "error",
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
    var group = $(this).closest("ul");
    group.find("a.nav-option-radio").removeClass("selected");
    $(this).addClass("selected");
    group.data("value", $(this).data("value"));
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
</li>'
};





