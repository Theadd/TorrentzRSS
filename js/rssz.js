
/* SORTABLE SIDEBAR */

$(function  () {
    $("ul.main-menu").sortable({
        group: 'main-menu',
        handle: 'li',
        nested: false,
        vertical: true,
        exclude: '.no-sortable',
        onDragStart: function($item, container, _super) {
            $item.find('ul.main-menu').sortable('disable')
            _super($item, container)
        },
        onDrop: function($item, container, _super) {
            $item.find('ul.main-menu').sortable('enable')
            _super($item, container)
        }
    })
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

});