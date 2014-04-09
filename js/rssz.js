
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
    <span class="hidden-xs">Merge RSS</span>\
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
                <input type="text" placeholder="http://" class="pull-right" style="width: calc(100% - 70px); text-align: left;" />\
            </div>\
            <a class="nav-option" href="#"><i class="fa fa-link"></i> URL</a>\
        </li>\
    </ul>\
</li>',
    'dupe-movies': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-film"></i>\
    <span class="hidden-xs">Duplicated movies</span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right query-rule-remove" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right query-rule-toggle" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul data-value="dupe-movies" class="dropdown-menu query-rule">\
        <li class="divider inner-divider no-sortable no-sortable-inner">REORDER BY PREFERENCE <i class="fa fa-lg fa-angle-double-down"></i></li>\
        <li class="no-sortable"><a data-value="q" class="nav-option nav-option-checkbox selected" href="#"><i class="fa fa-check"></i> Quality</a></li>\
        <li class="no-sortable"><a data-value="c" class="nav-option nav-option-checkbox selected" href="#"><i class="fa fa-check"></i> Seeds + Peers</a></li>\
        <li class="no-sortable"><a data-value="n" class="nav-option nav-option-checkbox selected" href="#"><i class="fa fa-check"></i> Newer</a></li>\
        <li class="no-sortable"><a data-value="o" class="nav-option nav-option-checkbox" href="#"><i class="fa fa-check"></i> Older</a></li>\
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





