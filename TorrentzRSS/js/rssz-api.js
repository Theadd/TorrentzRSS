

/*var defaultsObj = {
    'parameters' : {
        'quality' : 'good',
        'order' : 'peers',
        'requests' : 1
    },
    'settings' : {
        'ttl' : 15,
        'duplicates' : {
            'delay' : 120,
            'onlydelayinrss' : true,
            'previousresults' : true
        }
    }
};

var defaultsArray = $.map(defaultsObj, function(value, index) {
    return [value];
});

var defaults = [];
defaults['parameters'] = defaultsArray[0];
defaults['settings'] = defaultsArray[1];*/

var defaults = [];
defaults['parameters'] = [];
defaults['parameters']['quality'] = 'good';
defaults['parameters']['order'] = 'peers';
defaults['parameters']['requests'] = 1;
defaults['settings'] = [];
defaults['settings']['ttl'] = 15;
defaults['settings']['duplicates'] = [];
defaults['settings']['duplicates']['delay'] = 120;
defaults['settings']['duplicates']['onlydelayinrss'] = true;
defaults['settings']['duplicates']['previousresults'] = true;

/*Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};*/

var related = { 'good' : 'feed', 'any' : 'feed_any', 'verified' : 'feed_verified', 'rating' : 'N', 'date' : 'A', 'size' : 'S', 'peers' : '' };
/**
 *
 * @constructor
 */
function RSSZApi(path, params) {

    this.path = path;
    this.params = params;

    /** @constructs */
    (function() {
        console.log("Initiating API!");

    })();

    function array_merge(primary, secondary) {
        for (var key in secondary) {
            if (typeof primary[key] === "undefined") {
                primary[key] = secondary[key];
            } else if (typeof primary[key] === "object" && typeof secondary[key] === "object") {
                array_merge(primary[key], secondary[key]);
            }
        }
    }

    this.reduce = function() {
        console.log("Reducing...");
        console.dir(this.params);
        console.dir(defaults);
        //this.params['parameters'] = this.params['parameters'].concat(defaults['parameters']);//.unique();    //array_merge(defaults, this.params);
        //this.params = this.params.concat(defaults);//.unique();    //array_merge(defaults, this.params);
        //this.params = $.merge(this.params, defaults);
        array_merge(this.params, defaults);
        console.dir(this.params);
        this.params['p'] = related[this.params['parameters']['quality']]  + "" +  related[this.params['parameters']['order']];
        this.params['p'] +=  '-'  + "" +  this.params['parameters']['requests'];
        this.params['p'] +=  '-t'  + "" +  this.params['settings']['ttl'];
        this.params['p'] +=  '-d'  + "" +  this.params['settings']['duplicates']['delay'];
        this.params['p'] +=  '-'  + "" +  ((this.params['settings']['duplicates']['onlydelayinrss']) ? 'r' : '');
        this.params['p'] +=  ((this.params['settings']['duplicates']['previousresults']) ? 'k' : '');
        if (typeof this.params['errors'] === "undefined") {
            this.params['errors'] = [];
        }
        console.log("Parameters done");
//rules	//rev_rule = {'l': 'limit', 'm': 'merge', 'd': 'dupe-movies', 't': 'dupe-tv', 's': 'sort', 'e': 'exclude', 'c': 'eval', 'i': 'intersection' };
        this.params['r'] = '';
        if (typeof this.params['rules'] !== "undefined" && this.params['rules'].length) {
            console.log("Reducing rules...");
            for (var iRule in this.params['rules']) {
                var ruleContainer = this.params['rules'][iRule];
                for (var rule in ruleContainer) {
                    var params = ruleContainer[rule];
                    console.log("RULE: " + rule + " PARAMS: " + params);
                    switch (rule) {
                        case "limit":
                            this.params['r'] +=  '-l'  + "" + params;
                            break;
                        case "merge":
                            this.params['r'] +=  '-m'  + "" + params;
                            break;
                        case "intersect":
                            this.params['r'] +=  '-i'  + "" + params;
                            break;
                        case "movieduplicates":
                            this.params['r'] +=  '-d';
                            for (var paramKey in params) {
                                var param = params[paramKey];
                                switch (param) {
                                    case "betterquality": this.params['r'] +=  'Q'; break;
                                    case "poorerquality": this.params['r'] +=  'q'; break;
                                    case "moreseeds": this.params['r'] +=  'S'; break;
                                    case "morepeers": this.params['r'] +=  'P'; break;
                                    case "largersizes": this.params['r'] +=  'L'; break;
                                    case "smallersizes": this.params['r'] +=  's'; break;
                                    default: this.params['errors'].push("Unknown parameter '" + param + "' in '" + rule + "'.");
                                }
                            }
                            break;
                        case "tvduplicates":
                            this.params['r'] +=  '-t';
                            for (var paramKey in params) {
                                var param = params[paramKey];
                                switch (param) {
                                    case "betterquality": this.params['r'] +=  'Q'; break;
                                    case "poorerquality": this.params['r'] +=  'q'; break;
                                    case "moreseeds": this.params['r'] +=  'S'; break;
                                    case "morepeers": this.params['r'] +=  'P'; break;
                                    case "largersizes": this.params['r'] +=  'L'; break;
                                    case "smallersizes": this.params['r'] +=  's'; break;
                                    default: this.params['errors'].push("Unknown parameter '" + param + "' in '" + rule + "'.");
                                }
                            }
                            break;
                        case "exclude":
                            this.params['r'] +=  '-e';
                            if ((params['options']) && is_array(params['options'])) {
                                for (var paramKey in params) {
                                    var param = params[paramKey];
                                    switch (param) {
                                        case "regex": this.params['r'] +=  'r'; break;
                                        case "matching": this.params['r'] +=  'm'; break;
                                        case "title": this.params['r'] +=  't'; break;
                                        case "string": break;	//default
                                        case "non-matching": break;	//default
                                        case "category": break;	//default
                                        default: this.params['errors'].push("Unknown parameter '" + param + "' in '" + rule + "'.");
                                    }
                                }
                            }
                            this.params['r'] +=  'p'  + "" +  Base64.encode(params['pattern']);
                            break;
                        case "evaluate":
                            this.params['r'] +=  '-c'  + "" +  Base64.encode(params);
                            break;
                        case "sort":
                            this.params['r'] +=  '-s';
                            if (params['field'] == 'seeds') {
                                this.params['r'] +=  'e';
                            } else if (params['field'] == 'seeds-leechers') {
                                this.params['r'] +=  'm';
                            } else {
                                this.params['r'] +=  params['field'].substring(0, 1);
                            }
                            if (!(params['order'])) {
                                this.params['r'] +=  'D';
                            } else {
                                this.params['r'] +=  params['order'].substring(0, 1);
                            }
                            break;
                        default:
                            this.params['errors'].push("Unknown rule '" + rule + "'.");
                            break;
                    }
                }
            }
        }
        this.params['r'] = this.params['r'].substring(1);
        this.params['q'] = this.params['query'];
        console.log("Reduced");
    };

}


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




/*
$defaults = array(
    'parameters' => array(
    'quality' => 'good',
    'order' => 'peers',
    'requests' => 1
),
'settings' => array(
    'ttl' => 15,
    'duplicates' => array(
    'delay' => 120,
    'onlydelayinrss' => true,
    'previousresults' => true
)
)
);
$related = array( 'good' => 'feed', 'any' => 'feed_any', 'verified' => 'feed_verified', 'rating' => 'N', 'date' => 'A', 'size' => 'S', 'peers' => '' );
//process.php?f=json&p=feed_verifiedA-2-t15-d120-rk&r=&q=skidrow+games&_=1399416858169
//parameters and settings
$_REQUEST = array_merge($defaults, $_REQUEST);
$_REQUEST['p'] = $related[$_REQUEST['parameters']['quality']] . $related[$_REQUEST['parameters']['order']];
$_REQUEST['p'] .= '-' . $_REQUEST['parameters']['requests'];
$_REQUEST['p'] .= '-t' . $_REQUEST['settings']['ttl'];
$_REQUEST['p'] .= '-d' . $_REQUEST['settings']['duplicates']['delay'];
$_REQUEST['p'] .= '-' . (($_REQUEST['settings']['duplicates']['onlydelayinrss']) ? 'r' : '');
$_REQUEST['p'] .= (($_REQUEST['settings']['duplicates']['previousresults']) ? 'k' : '');

//rules	//rev_rule = {'l': 'limit', 'm': 'merge', 'd': 'dupe-movies', 't': 'dupe-tv', 's': 'sort', 'e': 'exclude', 'c': 'eval', 'i': 'intersection' };
$_REQUEST['r'] = '';
foreach ($_REQUEST['rules'] as $iRule => $ruleContainer) {
    foreach ($ruleContainer as $rule => $params) {
        switch ($rule) {
            case "limit":
                $_REQUEST['r'] .= '-l' . $params;
                break;
            case "merge":
                $_REQUEST['r'] .= '-m' . $params;
                break;
            case "intersect":
                $_REQUEST['r'] .= '-i' . $params;
                break;
            case "movieduplicates":
                $_REQUEST['r'] .= '-d';
                foreach ($params as $param) {
                switch ($param) {
                    case "betterquality": $_REQUEST['r'] .= 'Q'; break;
                    case "poorerquality": $_REQUEST['r'] .= 'q'; break;
                    case "moreseeds": $_REQUEST['r'] .= 'S'; break;
                    case "morepeers": $_REQUEST['r'] .= 'P'; break;
                    case "largersizes": $_REQUEST['r'] .= 'L'; break;
                    case "smallersizes": $_REQUEST['r'] .= 's'; break;
                    default: $_REQUEST['errors'][] = "Unknown parameter '$param' in '$rule'.";
                }
            }
                break;
            case "tvduplicates":
                $_REQUEST['r'] .= '-t';
                foreach ($params as $param) {
                switch ($param) {
                    case "betterquality": $_REQUEST['r'] .= 'Q'; break;
                    case "poorerquality": $_REQUEST['r'] .= 'q'; break;
                    case "moreseeds": $_REQUEST['r'] .= 'S'; break;
                    case "morepeers": $_REQUEST['r'] .= 'P'; break;
                    case "largersizes": $_REQUEST['r'] .= 'L'; break;
                    case "smallersizes": $_REQUEST['r'] .= 's'; break;
                    default: $_REQUEST['errors'][] = "Unknown parameter '$param' in '$rule'.";
                }
            }
                break;
            case "exclude":
                $_REQUEST['r'] .= '-e';
                if (isset($params['options']) && is_array($params['options'])) {
                    foreach ($params['options'] as $param) {
                        switch ($param) {
                            case "regex": $_REQUEST['r'] .= 'r'; break;
                            case "matching": $_REQUEST['r'] .= 'm'; break;
                            case "title": $_REQUEST['r'] .= 't'; break;
                            case "string": break;	//default
                            case "non-matching": break;	//default
                            case "category": break;	//default
                            default: $_REQUEST['errors'][] = "Unknown parameter '$param' in '$rule'.";
                        }
                    }
                }
                $_REQUEST['r'] .= 'p' . base64_encode($params['pattern']);
                break;
            case "evaluate":
                $_REQUEST['r'] .= '-c' . base64_encode($params);
                break;
            case "sort":
                $_REQUEST['r'] .= '-s';
                if ($params['field'] == 'seeds') {
                    $_REQUEST['r'] .= 'e';
                } else if ($params['field'] == 'seeds-leechers') {
                    $_REQUEST['r'] .= 'm';
                } else {
                    $_REQUEST['r'] .= substr($params['field'], 0, 1);
                }
                if (!isset($params['order'])) {
                    $_REQUEST['r'] .= 'D';
                } else {
                    $_REQUEST['r'] .= substr($params['order'], 0, 1);
                }
                break;
            default:
                $_REQUEST['errors'][] = "Unknown rule '$rule'.";
                break;
        }
    }
}
$_REQUEST['r'] = substr($_REQUEST['r'], 1);

//query
$_REQUEST['q'] = $_REQUEST['query'];

include "process.php";
*/

