
/* BOOTSTRO TOUR */

//var tour = null;

var tours = {
    "success": true,
    "intersection": [
        {
            "selector": "#search-box",
            "title": "Type your search query",
            "content": "<p>Type one or more TV shows on the search box, better if they are still airing each week since we'll add rules to get only one result for the last episode of each TV show.</p>Like: <pre class=\"inline\">&quot;game of thrones&quot;</pre> or <pre class=\"inline\">&quot;game of thrones&quot; | &quot;falling skies&quot;</pre><blockquote>Remember to quote names composed by multiple words and separate each name using a pipe.</blockquote><br><p>Press <b>enter</b> when done or click the search button on the right.<br>Next step will be triggered when results are completely loaded.</p>",
            "width": "600px",
            "nextButton": "<span></span>",
            "step": "0",
            //"action": "next",
            //"selector-next": "#search-box > span > button",
            "placement": "bottom"
        }, {    //a:   id="ui-order"  "a[data-value='" + mods[e] + "']:not(.selected)")
            "selector": "#ui-order",
            "title": "Order by date",
            "content": "Ask torrentz.eu to order results by <b>date</b>.",
            "top": "20px",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "1",
            "action": "next",
            "selector-next": "#ui-order a[data-value='date']",
            "placement": "right"
        }, {
            "selector": "#ui-pages",
            "title": "Set page requests",
            "content": "To obtain a large number of results for the query intersection rule make sense, select <b>5 queries (500 results)</b>.",
            "top": "20px",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "2",
            "action": "next",
            "selector-next": "#ui-pages a[data-value='5']",
            "placement": "right"
        }, {    //~a
            "selector": "#ui-add-new-rule",
            "title": "Add new rule",
            "content": "Now, you'll add a new rule to only keep one result from the last episode of each TV show. Click to expand.",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "top": "20px",
            "width": "400px",
            "step": "3",
            "action": "next",
            "selector-next": "#ui-add-new-rule > a",
            "placement": "right"
        }, {
            "selector": "#ui-add-new-handle-duplicates",
            "title": "Handle duplicates rule",
            "content": "Click again to expand.",
            "top": "20px",
            "width": "300px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "4",
            "action": "next",
            "selector-next": "#ui-add-new-handle-duplicates > a",
            "placement": "right"
        }, {
            "selector": "#ui-add-new-handle-duplicates-tv",
            "title": "Treat as TV shows",
            "content": "Since you're looking for TV shows, proceed by clicking the <i class=\"fa fa-plus\"></i> button.",
            "top": "20px",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "5",
            "action": "next",
            "selector-next": "#ui-add-new-handle-duplicates-tv > a > div > button",
            "placement": "right"
        }, {
            "selector": ".rule-dupe-tv:last",
            "title": "Customize your new rule",
            "content": "<p>Click to expand your newly added rule and customize its parameters at will.</p><p>For example, you can prioritize larger or smaller torrents (in size), deselect them if you don't mind about file size and also <b>drag&amp;drop</b> according to your preferences since the top ones will be more relevant than the ones that come after.</p><p>When done, click <b>next</b> button on the right.</p>",
            "top": "20px",
            "width": "400px",
            "prevButton": "<span></span>",
            "step": "6",
            //"action": "next",
            //"selector-next": ".rule-dupe-tv:last > a",
            "dynamic": "<li class=\"dropdown rule-dupe-tv\"></li>",
            "placement": "right"
        }, {
            "selector": ".btn-sidebar-submit",
            "title": "Apply!",
            "content": "Click <b>Apply query &amp; rules!</b> to get the results from your search. Next step will be triggered when results are completely loaded.",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "finishButton": "<span></span>",
            "step": "7",
            "placement": "right"
        }, {
            "selector": ".ui-uuid-container:last",
            "title": "Get this UUID",
            "content": "<p>Well, you've got some results (otherwise, something went bad), but as you only want the ones that aired within the last days, excluding torrents that were published long after the original air date, you'll make a new query and <b>intersect</b> the results with this one.</p><p>So, generate a <b>UUID</b> and <b>copy</b> it to your clipboard.</p><p>When done, go back by clicking at upper left <b>TorrentzRSS logo</b> and continue with <b>part two</b> of this tour.</p>",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "8",
            "dynamic": "<small class=\"ui-uuid-container\"></small>",
            "placement": "top"
        }
    ],
    "intersection2": [
        {
            "selector": "#search-box",
            "title": "Type your search query",
            "content": "<p>Type the same TV show(s) you entered before in the search box.</p><blockquote>Your last search was: <pre class=\"inline\">"+_cookie("search-query")+"</pre></blockquote><p>Press <b>enter</b> when done or click the search button on the right.<br>Next step will be triggered when results are completely loaded.</p>",
            "width": "600px",
            "nextButton": "<span></span>",
            "step": "0",
            //"action": "next",
            //"selector-next": "#search-box > span > button",
            "placement": "bottom"
        }, {    //a:   id="ui-order"  "a[data-value='" + mods[e] + "']:not(.selected)")
            "selector": "#ui-order",
            "title": "Order by date",
            "content": "Ask torrentz.eu to order results by <b>date</b>, again. But now, only one page of results.",
            "top": "20px",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "1",
            "action": "next",
            "selector-next": "#ui-order a[data-value='date']",
            "placement": "right"
        }, {    //~a
            "selector": "#ui-add-new-rule",
            "title": "Add new rule",
            "content": "Now, you'll create a new query and intersect its results with your previous query. Click to expand.",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "top": "20px",
            "width": "400px",
            "step": "2",
            "action": "next",
            "selector-next": "#ui-add-new-rule > a",
            "placement": "right"
        }, {
            "selector": "#ui-add-new-query-intersection",
            "title": "Add query intersection rule",
            "content": "Add a <b>query intersection</b> rule by clicking the <i class=\"fa fa-plus\"></i> button.",
            "top": "20px",
            "width": "300px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "3",
            "action": "next",
            "selector-next": "#ui-add-new-query-intersection > a > div > button",
            "placement": "right"
        }, {
            "selector": ".rule-intersection:last",
            "title": "Query intersection",
            "content": "<p>Click to expand your newly added rule and <b>paste</b> the previously copied <b>UUID</b> in the text box.</p><blockquote>Your last generated UUID was: <pre class=\"inline\">"+_cookie("uuid")+"</pre></blockquote><p>When done, click <b>next</b> on the right.</p>",
            "top": "20px",
            "width": "400px",
            "prevButton": "<span></span>",
            "step": "4",
            "dynamic": "<li class=\"dropdown rule-intersection\"></li>",
            "placement": "right"
        }, {
            "selector": ".btn-sidebar-submit",
            "title": "That's all!",
            "content": "Finally, click <b>Apply query &amp; rules!</b> to get the results from your search.",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "finishButton": "<span></span>",
            "step": "5",
            "placement": "right"
        }, {
            "selector": ".m-table:last",
            "title": "Still got unwanted results?",
            "content": "<p>You can add as many advanced rules as you want to exclude unwanted results.</p>",
            "width": "400px",
            "nextButton": "<span></span>",
            "prevButton": "<span></span>",
            "step": "6",
            "dynamic": "<table class=\"m-table\"></li>",
            "placement": "top"
        }
    ]
}


$(function(){
    /*$("body").on("click","#tour", function() {
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
    $("body").on("click","#tour-intersection", function() {
        bootstro.start('', {
            items : tours.intersection,
            stopOnBackdropClick: false,
            stopOnEsc: false,
            finishButton : '<small><a class="bootstro-finish-btn"><i class="fa fa-times-circle"></i> Close guided tour</a></small>',
            nextButtonText : 'Next <i class="fa fa-chevron-circle-right"></i>'
        });
    });
    $("body").on("click","#tour-intersection2", function() {
        bootstro.start('', {
            items : tours.intersection2,
            stopOnBackdropClick: false,
            stopOnEsc: false,
            finishButton : '<small><a class="bootstro-finish-btn"><i class="fa fa-times-circle"></i> Close guided tour</a></small>',
            nextButtonText : 'Next <i class="fa fa-chevron-circle-right"></i>'
        });
    });
});
