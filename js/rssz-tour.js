
/* BOOTSTRO TOUR */

//var tour = null;

var tours = {
    "success": true,
    "intersection": [
        {
            "selector": "#search-box",
            "title": "type tv shows here",
            "content": "I was found because I have selector=#dashboard-header",
            "width": "400px",
            "step": "0",
            "action": "next",
            "selector-next": "#search-box > span > button",
            "placement": "bottom"
        }, {
            "selector": "#ui-add-new-rule",
            "title": "add rule",
            "content": "I was found because I have selefwctor=#dashboard-header",
            "width": "400px",
            "step": "1",
            "action": "next",
            "selector-next": "#ui-add-new-rule > a",
            "placement": "right"
        }, {
            "selector": "#ui-add-new-handle-duplicates",
            "title": "dupes",
            "content": "I wasasfw found because I have selector=#dashboard-header",
            "width": "400px",
            "step": "2",
            "action": "next",
            "selector-next": "#ui-add-new-handle-duplicates > a",
            "placement": "right"
        }, {
            "selector": "#ui-add-new-handle-duplicates-tv",
            "title": "tv dupes",
            "content": "I wasasfw found because I have selector=#dashboard-header",
            "width": "400px",
            "step": "3",
            "action": "next",
            "selector-next": "#ui-add-new-handle-duplicates-tv > a > div > button",
            "placement": "right"
        }, {
            "selector": ".rule-dupe-tv:last",
            "title": "Click to expand.",
            "content": "Content here.",
            "width": "400px",
            "step": "4",
            "action": "next",
            "selector-next": ".rule-dupe-tv:last > a",
            "dynamic": "<li class=\"dropdown rule-dupe-tv\"></li>",
            "placement": "right"
        }, {
            "selector": ".btn-sidebar-submit",
            "title": "Apply!",
            "content": "I was found because I have selector=.btn-sidebar-submit",
            "width": "400px",
            "step": "5",
            "placement": "right"
        }
    ]
}


$(function(){
    //tour = new tourManager();
    /*$("body").on("click","#tour", function() {
        tour.build("intersection");
        bootstro.start(".bootstro", {
            onComplete : function(params)
            {
                alert("Reached end of introduction with total " + (params.idx + 1)+ " slides");
            },
            onExit : function(params)
            {
                alert("Introduction stopped at slide #" + (params.idx + 1));
            },
            container: 'body'
        });
    });*/
    $("body").on("click","#tour", function() {
        bootstro.start('', {
            items : tours.intersection,
            stopOnBackdropClick: false,
            stopOnEsc: false
        });
    });
});




/**
 *
 * @constructor
 */
function tourManager() {

    /*var tours =
        {'intersection': [
            {
                'step': 0,
                'selector': '#dashboard-header',
                'title': 'title',
                'content': 'content',
                'placement': 'bottom'
            }, {
                'step': 1,
                'selector': '.btn-sidebar-submit',
                'title': 'title',
                'content': 'content',
                'placement': 'right'
            }
        ]}
    ;*/

    /** @constructs */
    (function() {
        //Do something here...
    })();

    /**
     *
     * @param name
     * @returns {*}
     */
    this.build = function(name) {
        console.log(tours);
        $.each(tours[name], function(i, item) {
            var target = $(item['selector']);
            target.data('bootstro-step', item['step']);
            target.data('bootstro-title', item['title']);
            target.data('bootstro-content', item['content']);
            target.data('bootstro-placement', item['placement']);
            target.data('container', "body");
            target.addClass("bootstro");
        });

    };

    this.destroy = function(name) {

    };
}

/*
 <a class="navbar-brand bootstro" href="#"
 data-bootstro-title="This is the Brand aa"
 data-bootstro-content="It is always visible aa"
 data-bootstro-placement="top"
 data-bootstro-container="body"
 data-container="body"
 data-bootstro-step="1">
 Wololo!!
 </a>
 */

