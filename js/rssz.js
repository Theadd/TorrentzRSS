
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

   /* $("ul.no-sortable").sortable({
        group: 'no-group',
        drag: false,
        drop: false,
        handle: 'li',
        vertical: true
    })*/
});
/*
$(function  () {
    $("ol.nav").sortable({
        group: 'nav',
        nested: false,
        vertical: false,
        exclude: '.divider-vertical',
        onDragStart: function($item, container, _super) {
            $item.find('ol.dropdown-menu').sortable('disable')
            _super($item, container)
        },
        onDrop: function($item, container, _super) {
            $item.find('ol.dropdown-menu').sortable('enable')
            _super($item, container)
        }
    })
    $("ol.dropdown-menu").sortable({
        group: 'nav'
    })
})*/