
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
        <button class="btn btn-sidebar pull-right" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul class="dropdown-menu no-sortable">\
        <li>\
            <div class="nav-option-textbox no-sortable">\
                <input id="limit-value" type="text" placeholder="Limit" class="pull-right no-sortable" value="25"  style="width: calc(100% - 130px);" />\
            </div>\
            <a id="limit" data-value="0" class="nav-option no-sortable" href="#"><i class="fa fa-th-list no-sortable"></i> Max shown</a>\
        </li>\
    </ul>\
</li>',
    'merge': '<li class="dropdown">\
        <a href="#" class="dropdown-toggle">\
    <i class="fa fa-cloud-download"></i>\
    <span class="hidden-xs">Merge RSS</span>\
    <div class="btn-sidebar-container">\
        <button class="btn btn-sidebar pull-right" type="button">\
            <i class="fa fa-trash-o"></i>\
        </button>\
        <button class="btn btn-sidebar pull-right" type="button">\
            <i class="fa fa-eye"></i>\
        </button>\
    </div>\
</a>\
    <ul class="dropdown-menu no-sortable">\
        <li class="no-sortable">\
            <div class="nav-option-textbox no-sortable">\
                <input id="merge-value" type="text" placeholder="http://" class="pull-right no-sortable" style="width: calc(100% - 70px); text-align: left;" />\
            </div>\
            <a id="merge" data-value="0" class="nav-option no-sortable" href="#"><i class="fa fa-link no-sortable"></i> URL</a>\
        </li>\
    </ul>\
</li>'
};

/*<li id="sidebar-rules-delimiter" class="divider no-sortable">ACTIONS</li>
 <li id="add-new-rule" class="dropdown no-sortable">*/

$('body').on("click","#add-new-rule button", function() {
    $('#sidebar-rules-delimiter').before(sidebar_rules[$(this).data("value")]);
});