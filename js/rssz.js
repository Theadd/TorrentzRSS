
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