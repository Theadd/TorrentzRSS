
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

$('body').on("click","a.nav-option-radio", function() {
    var group = $(this).closest("ul");
    group.find("a.nav-option-radio").removeClass("selected");
    $(this).addClass("selected");
    group.data("value", $(this).data("value"));
});

/* INITIALIZE SEARCH QUERY MANAGER */

var manager = null;

jQuery(window).ready(function () {
    console.log("initializing search query manager");
    manager = new queryManager(globals);
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
    <ul data-value="limit" class="dropdown-menu no-sortable query-rule">\
        <li>\
            <div class="nav-option-textbox no-sortable">\
                <input type="text" placeholder="Limit" class="pull-right no-sortable" value="25"  style="width: calc(100% - 130px);" />\
            </div>\
            <a class="nav-option no-sortable" href="#"><i class="fa fa-th-list no-sortable"></i> Max shown</a>\
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
    <ul data-value="merge" class="dropdown-menu no-sortable query-rule">\
        <li class="no-sortable">\
            <div class="nav-option-textbox no-sortable">\
                <input type="text" placeholder="http://" class="pull-right no-sortable" style="width: calc(100% - 70px); text-align: left;" />\
            </div>\
            <a class="nav-option no-sortable" href="#"><i class="fa fa-link no-sortable"></i> URL</a>\
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
    <ul data-value="dupe-movies" class="dropdown-menu no-sortable sortable-inner query-rule">\
        <li class="divider inner-divider no-sortable no-sortable-inner">REORDER BY PREFERENCE <i class="fa fa-lg fa-angle-double-down"></i></li>\
        <li class="no-sortable"><a data-value="q" class="nav-option nav-option-checkbox no-sortable selected" href="#"><i class="fa fa-check no-sortable"></i> Quality</a></li>\
        <li class="no-sortable"><a data-value="c" class="nav-option nav-option-checkbox no-sortable selected" href="#"><i class="fa fa-check no-sortable"></i> Seeds + Peers</a></li>\
        <li class="no-sortable"><a data-value="n" class="nav-option nav-option-checkbox no-sortable selected" href="#"><i class="fa fa-check no-sortable"></i> Newer</a></li>\
        <li class="no-sortable"><a data-value="o" class="nav-option nav-option-checkbox no-sortable" href="#"><i class="fa fa-check no-sortable"></i> Older</a></li>\
    </ul>\
</li>'
};

var rules = '';

$('body').on("click","button.add-new-rule", function() {
    $('#sidebar-rules-delimiter').before(sidebar_rules[$(this).data("value")]);
    $("ul.sortable-inner").sortable({
        items: "li:not(.no-sortable-inner)",
        placeholder: "placeholder"
    });
    rules = '';
    $.each($('.query-rule'), function() {
        rules += $(this).data('value') + ', ';
    });
    console.log(rules);
});


$('body').on("click","button.query-rule-remove", function() {
    $(this).closest("li").remove();
});