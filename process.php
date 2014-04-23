<?php

/* CONFIGURATION PARAMETERS */

define("RSSZ_DEBUG_MODE", true);
define("RSSZ_USE_PROXY", false);
define("RSSZ_PROXY", 'localhost:8118');
/** Allow web browsers to get content from this node when the requesting web page is located in another domain. */
define("RSSZ_ALLOW_CROSS_DOMAIN", true);
define("RSSZ_SITE_NAME", "TorrentzRSS!");
define("RSSZ_SITE_URL", "http://Theadd.github.io/TorrentzRSS/");
/** Time in minutes for torrent applications to wait between requests. */
define("RSSZ_MIN_TTL", 15);
/** Timeout in seconds per page requests from this node to torrentz.eu. */
define("RSSZ_TIMEOUT_PER_PAGE", 3);
/** Whether or not to set a timeout for each request. */
define("RSSZ_SET_TIMEOUT", false);
/** Does this server/node act as master, delegating (some or all) requests to other API nodes?
 * NOTE: This only delegates cURL http requests to torrentz.eu, all data processing is still being done in this node. */
define("RSSZ_MULTIPLE_NODES", false);
    //EDIT ONLY IF RSSZ_MULTIPLE_NODES IS SET TO TRUE:
    /** Ratio of this node (e.g.: 0.2 = 20% of requests will be handled by this node). */
    define("RSSZ_RATIO", 0.5);
    /** $_NODES contains an array of nodes within "your" network of API nodes. */
    $_NODES = array(    //This are valid nodes provided as example
        array(
            "http://rssz.netau.net/process.php",    //{string} Remote node url to process.php
            0.1,    //{float} Ratio. (e.g.: 0.2 = 20% of requests will be handled by this node)
            1     //timeout per page requests
        ),
        array(
            "http://mation.byethost15.com/process.php",
            0.15,
            0.75
        ),
        array(
            "http://rssz.esy.es/process.php",
            0.25,
            0.75
        )
    );
    //NOTE: The sum of all ratios should be 1.0 (RSSZ_RATIO + $_NODES[0][2] + ... + $_NODES[n-1][2]).
    //      Requests with random (from 0.01 to 1) bigger than sum of ratios will be requested by this node.

/* END OF CONFIGURATION PARAMETERS */

if (RSSZ_DEBUG_MODE) {
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
} else {
    error_reporting(0);
}

/* RSSZ_USE_SHELL_EXEC: If true, it will use 'curl' command line to retrieve the data, otherwise it will use curl functions from php. */
if (!function_exists('curl_setopt') || !function_exists('curl_setopt')) {   //TODO: both are identical.
    define("RSSZ_USE_SHELL_EXEC", true);
} else {
    define("RSSZ_USE_SHELL_EXEC", false);
}

require_once 'XML/RSS.php';
require_once 'XML/Serializer.php';

function logThis($data, $msg) {
    if ($_REQUEST['debug']) {
        if (!class_exists('FirePHP')) {
            if (!@(include('FirePHPCore/FirePHP.class.php'))) {
                $_REQUEST['debug'] = false;
                return;
            } else {
                ob_start();
            }
        }
        $firephp = FirePHP::getInstance(true);
        $firephp->log($data, $msg);
    }
}

$_REQUEST['debug'] = (isset($_REQUEST['debug']) && ($_REQUEST['debug'])) ? true : RSSZ_DEBUG_MODE;
$results = 0;
$errors = array();
//$priority_hashes = array();
$tiny = '';
$userTTL = 0;   //overwritten, use RSSZ_MIN_TTL instead
$session = array( 0 => array(
    'duplicatesDelay' => 0,   //overwritten
    'duplicatesDelayOnlyRSS' => false,   //overwritten
    'keepPreviousResults' => false,   //RSS only
    'priority_hashes' => array()
));
$SQI = 0;   //Search Query Index: Identifies current search among nested search queries due to merge query rule

logThis("Init", 'Logger');

if (RSSZ_ALLOW_CROSS_DOMAIN) {
    header('Access-Control-Allow-Origin: *');
}

function json_get_encoded($data) {
    return ((version_compare(phpversion(), '5.4.0', '>=')) ? json_encode($data, JSON_PRETTY_PRINT) : json_encode($data));
}

function array_orderby()
{
    $args = func_get_args();
    $data = array_shift($args);
    foreach ($args as $n => $field) {
        if (is_string($field)) {
            $tmp = array();
            foreach ($data as $key => $row)
                $tmp[$key] = $row[$field];
            $args[$n] = $tmp;
            }
    }
    $args[] = &$data;
    call_user_func_array('array_multisort', $args);
    return array_pop($args);
}

/** Returns an array of regex patterns required to match an advanced search string.
 *
 * @example 'these words "this phrase" | "exactword" blue | "red hair"'
 * array (size=4)
 * 0 => string 'these' (length=5)
 * 1 => string 'words' (length=5)
 * 2 => string '(this\sphrase)|\bexactword\b' (length=24)
 * 3 => string 'blue|(red\shair)' (length=16)
 *
 * @param $string {String} Advanced search string.
 * @return array Array of regex patterns.
 */
function getPatternsFromString($string) {
    $string .= '  ';
    $patterns = array();
    $aux = array();
    $str = str_getcsv($string, ' ');
    foreach ($str as &$value) {
        if (strpos($value, " ") !== false) {
            $value = str_replace(" ", '\s', $value);
            $value = "($value)";
        } else if ($value != '|') {
            if (preg_match("/\"$value\"/", $string)) {
                $value = '\b'.$value.'\b';
            }
        }
    }
    $last_value = $str[count($str) - 1];
    foreach ($str as $key => $value) {
        if ($value == "|") {
            if ($key == count($str) - 2) {
                $aux[] = $str[$key - 1]."|".$last_value;
            } else {
                $aux[] = $str[$key - 1]."|".$str[$key + 1];
            }
            $str[$key - 1] = "";
            $str[$key] = "";
            $str[$key + 1] = "";
        }
    }
    foreach ($str as $value) {
        if (strlen($value)) {
            $patterns[] = $value;
        }
    }
    $patterns = array_merge($patterns, $aux);

    return $patterns;
}

function process_url($url, &$channel) {
	$url = addslashes(stripslashes($url));
    $content = "";

    if (RSSZ_USE_SHELL_EXEC) {
        $command = (RSSZ_USE_PROXY) ? 'curl -x '.RSSZ_PROXY.' "'.$url.'" -iX GET' : 'curl "'.$url.'" -iX GET';
        $response = shell_exec($command);
    } else {
        $agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        if (RSSZ_USE_PROXY) {
            curl_setopt($ch, CURLOPT_PROXY, RSSZ_PROXY);
        } else {
            curl_setopt($ch, CURLOPT_PROXY, null);
        }
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $agent);
        //curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        $response = curl_exec($ch);
        curl_close($ch);
    }

    $isHeader = true;
    foreach(preg_split("/((\r?\n)|(\r\n?))/", $response) as $line){

        if ($isHeader) {
            if (empty($line)) {
                $isHeader = false;
                continue;
            } else {
                //HTTP/1.1 429 Too Many Requests
                if (preg_match("/HTTP.*?\s(\d+?)\s(.*?)$/", $line, $im)) {
                    logThis($im[1]." ".$im[2], "HTTP Response status");
                    if (intval($im[1]) == 429) {
                        $GLOBALS['errors'][] = "Torrentz.eu says: [".$im[1]."] ".$im[2];
                    }
                }
            }
        }
        if (!$isHeader) {
            $content .= $line.PHP_EOL;
        }
    }

    if (preg_match("/class=\"error\">(.*?)</", $content, $m)) {
        $GLOBALS['errors'][] = "Torrentz.eu says: ".$m[1];
    }
    $filename = microtime(true);
    file_put_contents("data/".$filename.".xml", $content);

    $rss = new XML_RSS("data/".$filename.".xml");
    $rss->parse();
    $items = $rss->getItems();

    foreach ($items as $item) {
        preg_match("/Size\:\s(.*?)\sSeeds\:\s([\d,]+)\D.*?Peers\:\s([\d,]+)\D.*?Hash\:\s(.*?)$/", $item['description'], $m);
        $m[2] = str_replace(',', '', $m[2]);
        $m[3] = str_replace(',', '', $m[3]);
        $item['title_lowercase'] = strtolower(htmlentities($item['title'], ENT_COMPAT, "UTF-8"));
        $item['link'] = "http://torrage.com/torrent/".strtoupper($m[4]).".torrent";
        $item['size'] = $m[1];
        $item['size_raw'] = intval($m[1]);
        $item['hash'] = strtoupper($m[4]);
        $item['seeds'] = intval($m[2]);
        $item['peers'] = intval($m[2]) + intval($m[3]);
        $item['leechers'] = intval($m[3]);
        $item['seeds-leechers'] = intval($m[2]) - intval($m[3]);
        @$item['pubtimestamp'] = strtotime($item['pubdate']);
        $channel[] = $item;
    }

    unset($rss);
    unlink("data/".$filename.".xml");

    return count($items);
}

/** Get results from a remote node running this script.
 * @param $url
 * @param $channel
 * @return int
 */
function remote_process_url($url, &$channel) {
    $url = addslashes(stripslashes($url));

    if (!($result = file_get_contents($url))) {
        trigger_error($php_errormsg, E_USER_WARNING);
        return null;
    }
    $content = json_decode($result, true);
    $count = 0;

    if (!empty($content['channel']['errors'])) {
        foreach ($content['channel']['errors'] as $error) {
            if (preg_match("/\[429\]/", $error)) {
                trigger_error($error, E_USER_WARNING);
                return null;
            }
            $GLOBALS['errors'][] = $error;
        }
    }

    foreach ($content['channel'] as $item) {
        if (isset($item['title'])) {
            ++$count;
            $channel[] = $item;
        }
    }

    return $count;
}

function getMovieQualityRate($title) {
    $rate = 0;

    if (preg_match("/(?:dvd.?scr(?:eener)?)|(?:br.?scr(?:eener)?)|(?:bluray.?scr(?:eener)?)|(?:hdtv.?scr(?:eener)?)/", $title)) {
        $rate = 2;
    } else if (preg_match("/screener/", $title)) {
        $rate = 1;
    } else {
        if (preg_match("/(?:br.?rip)|(?:bd.?rip)|(?:bluray.?rip)|(?:bluray)/", $title)) {
            $rate = 7;
        } else if (preg_match("/(?:dvd.?rip)/", $title)) {
            $rate = 6;
        } else if (preg_match("/hdtv/", $title)) {
            $rate = 5;
        } else if (preg_match("/(?:web.?rip)/", $title)) {
            $rate = 4;
        } else if (preg_match("/rip/", $title)) {
            $rate = 3;
        }
    }

    return $rate;
}

function getTVShowQualityRate($title) {

    if (preg_match("/[[:space:]]1080p[[:space:]]/", $title)) {
        $rate = 5;
    } else if (preg_match("/[[:space:]]720p[[:space:]]/", $title)) {
        $rate = 4;
    } else if (preg_match("/[[:space:]]hdtv[[:space:]]/", $title)) {
        $rate = 3;
    } else if (preg_match("/[[:space:]]web.?(?:rip)?[[:space:]]/", $title)) {
        $rate = 2;
    } else if (preg_match("/[[:space:]]480p[[:space:]]/", $title)) {
        $rate = 1;
    } else {
        $rate = 0;
    }

    return $rate;
}

function getTVShowInfo($title) {
    $info = array('name' => '', 'episode' => -1);
    if (preg_match("/[[:space:]]s([0-9]+)e([0-9]+)[[:space:]]/", $title, $m, PREG_OFFSET_CAPTURE)) {
        $info['episode'] = intval($m[1][0]) * 1000 + intval($m[2][0]);
        $info['name'] = preg_replace('/[^a-z]/', '', substr($title, 0, $m[0][1]));
    } else if (preg_match("/[[:space:]]([0-9]+)x([0-9]+)[[:space:]]/", $title, $m, PREG_OFFSET_CAPTURE)) {
        $info['episode'] = intval($m[1][0]) * 1000 + intval($m[2][0]);
        $info['name'] = preg_replace('/[^a-z]/', '', substr($title, 0, $m[0][1]));
    } else if (preg_match("/[[:space:]]special[[:space:]]/", $title, $m, PREG_OFFSET_CAPTURE)) {
        $info['episode'] = 0;   //special episode
        $info['name'] = 'special '.preg_replace('/[^a-z]/', '', substr($title, 0, $m[0][1]));
    } else {
        $info = false;
    }
    return $info;
}

/* Returns an associative array (key: hash) corresponding with the resulting channel items. */
function handleDuplicatesAsMovies($channel, $rule) {
    //Handle duplicates as movies
    $hashes = array();
    $args = str_split(substr($rule, 1));    //i.e.: QSs --> array('Q', 'S', 's');
    $aux = array_orderby($channel, 'title_lowercase', SORT_ASC);
    $items = count($aux);
    $i = 0;
    while ($i + 1 < $items) {
        if (strlen($iname = substr($aux[$i]['title_lowercase'], 0, strpos($aux[$i]['title_lowercase'], ' ', 5)))) {
            $wnd = 1;
            $halfpos = round(strlen($aux[$i]['title_lowercase']) / 2);
            while (true) {
                if (!((@substr($aux[$i+$wnd]['title_lowercase'], 0, strlen($iname)) == $iname)
                    && levenshtein(substr($aux[$i]['title_lowercase'], 0, $halfpos), substr($aux[$i+$wnd]['title_lowercase'], 0, $halfpos)) < round($halfpos * 0.5)))
                    break;
                $item1 = $aux[$i];
                $item2 = $aux[$i+$wnd];
                $swapped = false;
                foreach ($args as $arg) {
                    switch ($arg) {
                        case 'Q':
                            //better quality
                            $rate1 = getMovieQualityRate($item1['title_lowercase']);
                            $rate2 = getMovieQualityRate($item2['title_lowercase']);
                            if ($rate2 > $rate1) {
                                //keep item2 and break foreach
                                $item1 = $item2;
                                break 2;
                            } else if ($rate1 > $rate2) break 2;
                            break;
                        case 'q':
                            //poorer quality
                            $rate1 = getMovieQualityRate($item1['title_lowercase']);
                            $rate2 = getMovieQualityRate($item2['title_lowercase']);
                            if ($rate2 < $rate1) {
                                //keep item2 and break foreach
                                $item1 = $item2;
                                break 2;
                            } else if ($rate1 < $rate2) break 2;
                            break;
                        case 'S':
                            //quite more seeds
                            if ($item2['seeds'] > $item1['seeds']) {
                                if ($item2['seeds'] >= $item1['seeds'] * 1.25) {
                                    //keep item2 and break foreach
                                    $item1 = $item2;
                                    break 2;
                                } else {
                                    //swap
                                    if (!$swapped) {
                                        $tmp = $item1;
                                        $item1 = $item2;
                                        $item2 = $tmp;
                                        $swapped = true;
                                        //continue foreach
                                    }
                                }
                            } else if ($item1['seeds'] >= $item2['seeds'] * 1.25) break 2;
                            break;
                        case 'P':
                            //quite more peers
                            if ($item2['peers'] > $item1['peers']) {
                                if ($item2['peers'] >= $item1['peers'] * 1.25) {
                                    //keep item2 and break foreach
                                    $item1 = $item2;
                                    break 2;
                                } else {
                                    //swap
                                    if (!$swapped) {
                                        $tmp = $item1;
                                        $item1 = $item2;
                                        $item2 = $tmp;
                                        $swapped = true;
                                        //continue foreach
                                    }
                                }
                            } else if ($item1['peers'] >= $item2['peers'] * 1.25) break 2;
                            break;
                        case 'L':
                            //larger sizes
                            if ($item2['size_raw'] > $item1['size_raw']) {
                                if ($item2['size_raw'] >= $item1['size_raw'] * 1.25) {
                                    //keep item2 and break foreach
                                    $item1 = $item2;
                                    break 2;
                                } else {
                                    //swap
                                    if (!$swapped) {
                                        $tmp = $item1;
                                        $item1 = $item2;
                                        $item2 = $tmp;
                                        $swapped = true;
                                        //continue foreach
                                    }
                                }
                            } else if ($item1['size_raw'] >= $item2['size_raw'] * 1.25) break 2;
                            break;
                        case 's':
                            //smaller sizes
                            if ($item2['size_raw'] < $item1['size_raw']) {
                                if ($item2['size_raw'] <= $item1['size_raw'] * 1.25) {
                                    //keep item2 and break foreach
                                    $item1 = $item2;
                                    break 2;
                                } else {
                                    //swap
                                    if (!$swapped) {
                                        $tmp = $item1;
                                        $item1 = $item2;
                                        $item2 = $tmp;
                                        $swapped = true;
                                        //continue foreach
                                    }
                                }
                            } else if ($item1['size_raw'] <= $item2['size_raw'] * 1.25) break 2;
                            break;
                    }
                }
                $aux[$i] = $item1;
                ++$wnd; //next item in group
            }
            $hashes[$aux[$i]['hash']] = true;   //save
            $i += $wnd; //next group
        }
    }

    return $hashes;
}

/* Returns an associative array (key: hash) corresponding with the resulting channel items. */
function handleDuplicatesAsTVShows($channel, $rule) {
    //Handle duplicates as TV Shows
    $hashes = array();
    $args = str_split(substr($rule, 1));    //i.e.: QSs --> array('Q', 'S', 's');
    $aux = array_orderby($channel, 'title_lowercase', SORT_ASC);
    $items = count($aux);
    $i = 0;
    while ($i + 1 < $items) {
        $minTimestampForGroup = time();
        $wnd = 1;
        $info1 = false;
        while (true) {
            if ($i + $wnd >= $items)
                break;  //reached end of array
            $info1 = getTVShowInfo($aux[$i]['title_lowercase']);
            if ($info1 == false) {
                break;
            }
            //set min timestamp for group
            if ($minTimestampForGroup > $aux[$i]['pubtimestamp']) {
                $minTimestampForGroup = $aux[$i]['pubtimestamp'];
            }
            $info2 = getTVShowInfo($aux[$i+$wnd]['title_lowercase']);
            if ($info2 == false) {
                ++$wnd;
                continue;
            }
            if (levenshtein($info1['name'], $info2['name']) > 5)
                break; //not same tv serie, go next group
            $item1 = $aux[$i];
            $item2 = $aux[$i+$wnd];
            //get only last episode
            if ($info1['episode'] < $info2['episode']) {
                $aux[$i] = $item2;
                //set min timestamp for group to the later episode
                $minTimestampForGroup = $aux[$i]['pubtimestamp'];
                ++$wnd; //next item in group
                continue;
            } else if ($info1['episode'] > $info2['episode']) {
                ++$wnd;
                continue;
            }
            //set min timestamp for group
            if ($minTimestampForGroup > $item2['pubtimestamp']) {
                $minTimestampForGroup = $item2['pubtimestamp'];
            }

            if ($GLOBALS['session'][$GLOBALS['SQI']]['keepPreviousResults']) {  //prioritize already served torrents from last call
                if (isset($GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'][$item1['hash']])) {
                    ++$wnd;
                    continue;
                } else if (isset($GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'][$item2['hash']])) {
                    $aux[$i] = $item2;
                    ++$wnd; //next item in group
                    continue;
                }
            }
            $swapped = false;
            foreach ($args as $arg) {
                switch ($arg) {
                    case 'Q':
                        //better quality
                        $rate1 = getTVShowQualityRate($item1['title_lowercase']);
                        $rate2 = getTVShowQualityRate($item2['title_lowercase']);
                        if ($rate2 > $rate1) {
                            //keep item2 and break foreach
                            $item1 = $item2;
                            break 2;
                        } else if ($rate1 > $rate2) break 2;
                        break;
                    case 'q':
                        //poorer quality
                        $rate1 = getMovieQualityRate($item1['title_lowercase']);
                        $rate2 = getMovieQualityRate($item2['title_lowercase']);
                        if ($rate2 < $rate1) {
                            //keep item2 and break foreach
                            $item1 = $item2;
                            break 2;
                        } else if ($rate1 < $rate2) break 2;
                        break;
                    case 'S':
                        //quite more seeds
                        if ($item2['seeds'] > $item1['seeds']) {
                            if ($item2['seeds'] >= $item1['seeds'] * 1.25) {
                                //keep item2 and break foreach
                                $item1 = $item2;
                                break 2;
                            } else {
                                //swap
                                if (!$swapped) {
                                    $tmp = $item1;
                                    $item1 = $item2;
                                    $item2 = $tmp;
                                    $swapped = true;
                                    //continue foreach
                                }
                            }
                        } else if ($item1['seeds'] >= $item2['seeds'] * 1.25) break 2;
                        break;
                    case 'P':
                        //quite more peers
                        if ($item2['peers'] > $item1['peers']) {
                            if ($item2['peers'] >= $item1['peers'] * 1.25) {
                                //keep item2 and break foreach
                                $item1 = $item2;
                                break 2;
                            } else {
                                //swap
                                if (!$swapped) {
                                    $tmp = $item1;
                                    $item1 = $item2;
                                    $item2 = $tmp;
                                    $swapped = true;
                                    //continue foreach
                                }
                            }
                        } else if ($item1['peers'] >= $item2['peers'] * 1.25) break 2;
                        break;
                    case 'L':
                        //larger sizes
                        if ($item2['size_raw'] > $item1['size_raw']) {
                            if ($item2['size_raw'] >= $item1['size_raw'] * 1.25) {
                                //keep item2 and break foreach
                                $item1 = $item2;
                                break 2;
                            } else {
                                //swap
                                if (!$swapped) {
                                    $tmp = $item1;
                                    $item1 = $item2;
                                    $item2 = $tmp;
                                    $swapped = true;
                                    //continue foreach
                                }
                            }
                        } else if ($item1['size_raw'] >= $item2['size_raw'] * 1.25) break 2;
                        break;
                    case 's':
                        //smaller sizes
                        if ($item2['size_raw'] < $item1['size_raw']) {
                            if ($item2['size_raw'] <= $item1['size_raw'] * 1.25) {
                                //keep item2 and break foreach
                                $item1 = $item2;
                                break 2;
                            } else {
                                //swap
                                if (!$swapped) {
                                    $tmp = $item1;
                                    $item1 = $item2;
                                    $item2 = $tmp;
                                    $swapped = true;
                                    //continue foreach
                                }
                            }
                        } else if ($item1['size_raw'] <= $item2['size_raw'] * 1.25) break 2;
                        break;
                }
            }
            $aux[$i] = $item1;
            ++$wnd; //next item in group
        }
        if ($info1 != false) {     //save
            if (($GLOBALS['session'][$GLOBALS['SQI']]['duplicatesDelayOnlyRSS'] && strtolower($_REQUEST['f']) == 'rss') || !$GLOBALS['session'][$GLOBALS['SQI']]['duplicatesDelayOnlyRSS']) {
                if ($minTimestampForGroup <= time() - (60 * $GLOBALS['session'][$GLOBALS['SQI']]['duplicatesDelay'])) {
                    $hashes[$aux[$i]['hash']] = true;
                }
            } else {
                $hashes[$aux[$i]['hash']] = true;
            }
        }
        $i += $wnd; //next group
    }

    return $hashes;
}

/** Used in query intersection rule. */
function compareHash($val1, $val2)
{
    return strcmp($val1['hash'], $val2['hash']);
}

function run($p, $r, $q) {
	$channel = array();
	$params = explode('-', $p);
	$cin = array("ñ", "Ñ", "ç", "Ç", " ", ">", "<");
	$cout = array("%C3%B1", "%C3%91", "%C3%A7", "%C3%87", "+", "%3E", "%3C");
	$q = str_replace($cin, $cout, $q);

    //General settings
    if (isset($params[2])) {
        if ($GLOBALS['SQI'] == 0) { //set TTL to main search query, skip nested ones.
            $GLOBALS['userTTL'] = intval(substr($params[2], 1));
        }
        $GLOBALS['session'][$GLOBALS['SQI']]['duplicatesDelay'] = intval(substr($params[3], 1));
        $GLOBALS['session'][$GLOBALS['SQI']]['duplicatesDelayOnlyRSS'] = (strpos($params[4], 'r') !== false);
        $GLOBALS['session'][$GLOBALS['SQI']]['keepPreviousResults'] = (strpos($params[4], 'k') !== false);
    }

    $left = rand(1, 100) / 100;
    logThis($left, 'left');
    $using_remote_node = false;
    if (RSSZ_MULTIPLE_NODES && $left > RSSZ_RATIO) {
        //HANDLING RSSZ_MULTIPLE_NODES:
        $left -= RSSZ_RATIO;
        foreach ($GLOBALS['_NODES'] as $slave) {
            if (($left -= $slave[1]) <= 0) {
                //remote request
                $using_remote_node = true;
                if (RSSZ_SET_TIMEOUT) {
                    ini_set('default_socket_timeout', max(round($slave[2] * $params[1]), 1));
                }
                $query = $slave[0] . "?f=json&p=" . $p . "&r=&q=" . $q;
                if (($sum = @remote_process_url($query, $channel)) === null) {
                    logThis("FALLBACK FROM REMOTE NODE! $query", "FALLBACK!");
                    $using_remote_node = false;
                } else {
                    $GLOBALS['results'] += $sum;
                }
                logThis($query, 'Query');
                logThis(ini_get('default_socket_timeout'), 'Timeout');
                break;
            }
        }
    }
    if (!$using_remote_node) {
        if (RSSZ_SET_TIMEOUT) {
            ini_set('default_socket_timeout', intval(RSSZ_TIMEOUT_PER_PAGE));
        }
        $query = "http://torrentz.eu/" . $params[0] . "?q=" . $q;
        $page = 0;
        while (($sum = process_url($query.'&p='.$page, $channel_aux)) != 0 && ($params[1] * 2 > $page)) {
            $channel = array_merge($channel, $channel_aux);
            $GLOBALS['results'] += $sum;
            $channel_aux = array();
            $page += 2;
        }
        logThis(ini_get('default_socket_timeout'), 'Timeout');
    }

	$r = explode('-', $r);
	foreach ($r as $rule) {
		switch (substr($rule, 0, 1)) {
			case 'l':
				//limit results
				if (count($channel) > intval(substr($rule, 1))) {
					$channel = array_slice($channel, 0, intval(substr($rule, 1)));
				}
				break;
			case 'm':
				//merge
				$tiny = substr($rule, 1);
				if (strlen($tiny) > 10 && file_exists("data/".$tiny)) {
					$request = unserialize(file_get_contents("data/".$tiny));
                    $GLOBALS['SQI']++;
                    //Initialize session for this nested search query and load hashes
                    $GLOBALS['session'][$GLOBALS['SQI']] = array(
                        'duplicatesDelay' => 0,   //overwritten
                        'duplicatesDelayOnlyRSS' => false,   //overwritten
                        'keepPreviousResults' => false,   //RSS only
                        'priority_hashes' => (isset($request['hashes'])) ? $request['hashes'] : array()
                    );
                    //$GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'] = (isset($request['hashes'])) ? $request['hashes'] : array();
					$aux = run($request['p'], $request['r'], $request['q']);
                    //save hashes back
                    $bdata = unserialize(file_get_contents("data/".$tiny));
                    $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'] = array();
                    foreach ($aux as $result) {
                        $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'][$result['hash']] = true;
                    }
                    $bdata['hashes'] = $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'];
                    file_put_contents("data/".$tiny, serialize($bdata));
                    //end save
                    $GLOBALS['SQI']--;
					$channel = array_merge($channel, $aux);
				}
				break;
			case 'i':
				//intersection
				$tiny = substr($rule, 1);
				if (strlen($tiny) > 10 && file_exists("data/".$tiny)) {
					$request = unserialize(file_get_contents("data/".$tiny));
                    $GLOBALS['SQI']++;
                    //Initialize session for this nested search query and load hashes
                    $GLOBALS['session'][$GLOBALS['SQI']] = array(
                        'duplicatesDelay' => 0,   //overwritten
                        'duplicatesDelayOnlyRSS' => false,   //overwritten
                        'keepPreviousResults' => false,   //RSS only
                        'priority_hashes' => (isset($request['hashes'])) ? $request['hashes'] : array()
                    );
                    //$GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'] = (isset($request['hashes'])) ? $request['hashes'] : array();
					$aux = run($request['p'], $request['r'], $request['q']);
                    //save hashes back
                    $bdata = unserialize(file_get_contents("data/".$tiny));
                    $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'] = array();
                    foreach ($aux as $result) {
                        $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'][$result['hash']] = true;
                    }
                    $bdata['hashes'] = $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'];
                    file_put_contents("data/".$tiny, serialize($bdata));
                    //end save
                    $GLOBALS['SQI']--;
                    $channel = array_uintersect($channel, $aux, 'compareHash');
				}
				break;
			case 's':
				//sort
				$arg = (substr($rule, 2, 1) == 'A') ? SORT_ASC : SORT_DESC;
				$field = '';
				switch (substr($rule, 1, 1)) {
					case 't': $field = 'title_lowercase'; break;
					case 'd': $field = 'pubtimestamp'; break;
					case 's': $field = 'size_raw'; break;
					case 'p': $field = 'peers'; break;
					case 'e': $field = 'seeds'; break;
					case 'l': $field = 'leechers'; break;
					case 'm': $field = 'seeds-leechers'; break;
				}
				$channel = array_orderby($channel, $field, $arg);
				break;
            case 'd':
                //Handle duplicates as movies
                $hashes = handleDuplicatesAsMovies($channel, $rule);
                $i = 0;
                $channels = count($channel);
                while ($i < $channels) {
                    if (isset($hashes[$channel[$i]['hash']])) {
                        unset($hashes[$channel[$i]['hash']]);
                    } else {
                        unset($channel[$i]);
                    }
                    ++$i;
                }
                $channel = array_values($channel);  //reindex
                break;
            case 't':
                //Handle duplicates as TV shows
                $hashes = handleDuplicatesAsTVShows($channel, $rule);
                $i = 0;
                $channels = count($channel);
                while ($i < $channels) {
                    if (isset($hashes[$channel[$i]['hash']])) {
                        unset($hashes[$channel[$i]['hash']]);
                    } else {
                        unset($channel[$i]);
                    }
                    ++$i;
                }
                $channel = array_values($channel);  //reindex
                break;
            case 'e':
                //Exclude
                $pos = strpos($rule, 'p');
                $args = substr($rule, 0, $pos);     //r=regexp, m=matching, t=title
                $isRegExp = (strpos($args, 'r'));
                $matching = (strpos($args, 'm'));
                $fromTitle = (strpos($args, 't'));
                $pattern = base64_decode(substr($rule, $pos + 1));//strtolower(base64_decode(substr($rule, $pos + 1)), ENT_COMPAT, "UTF-8");
                if (!$isRegExp) {
                    $pattern = getPatternsFromString($pattern);
                }
                logThis($pattern, "Pattern");

                $i = 0;
                $channels = count($channel);
                while ($i < $channels) {
                    $field = ($fromTitle) ? $channel[$i]['title_lowercase'] : $channel[$i]['category'][0];
                    $match = true;
                    if ($isRegExp) {
                        $match = preg_match("/".$pattern."/", $field);
                    } else {
                        foreach ($pattern as $pattern_)
                        {
                            if (!preg_match("/".$pattern_."/i", $field))
                            {
                                $match = false;
                                break;
                            }
                        }
                    }
                    if ($match && $matching) {
                        unset($channel[$i]);
                    } else if (!$match && !$matching) {
                        unset($channel[$i]);
                    }
                    ++$i;
                }
                $channel = array_values($channel);  //reindex
                break;
            case 'c':
                //Evaluate condition
                $unsafe = base64_decode(substr($rule, 1));
                $condition = preg_replace('/[^(?:seeds)(?:peers)(?:leechers)(?:size)\+\-\*\/%(?:==)(?:!=)<>(?:<=)(?:>=)!&\|\^\~\(\)\s0-9\.]/', '', $unsafe);
                if (!strlen($condition))
                    break;
                if ($unsafe != $condition) {
                    $GLOBALS['errors'][] = "Input from 'Evaluate condition' rule was reinterpreted as: ".$condition;
                }

                $i = 0;
                $channels = count($channel);
                while ($i < $channels) {
                    $condition_i = str_replace(array('seeds', 'peers', 'leechers', 'size'), array(strval($channel[$i]['seeds']), strval($channel[$i]['peers']), strval($channel[$i]['leechers']), strval($channel[$i]['size_raw'])), $condition);
                    $condition_i = preg_replace('/[^\+\-\*\/%(?:==)(?:!=)<>(?:<=)(?:>=)!&\|\^\~\(\)\s0-9\.]/', '', $condition_i);
                    if (!@eval("return (".$condition_i.");")) {
                        unset($channel[$i]);
                    }
                    ++$i;
                }
                $channel = array_values($channel);  //reindex
                break;
		}
	}

	return $channel;
}


function triggerOnShutdown($total, $excluded, $statsfile, $errors, $errorsfile) {

    //UPDATE ERRORS FILE:
    if (is_array($errors) && count($errors)) {
        $date = @date("r");
        if (!($contents = @file($errorsfile, FILE_IGNORE_NEW_LINES))) {
            $contents = array();
        }
        foreach ($errors as $error) {
            if (count($contents) > 500) {
                array_shift($contents);
            }
            $contents[] = $date." - ".$error;
        }
        file_put_contents($errorsfile, implode("\r\n", $contents));
    }

    //UPDATE STATS FILE:
    $lockwait = 2;       // seconds to wait for lock
    $waittime = 250000;  // microseconds to wait between lock attempts
    // 2s / 250000us = 8 attempts.

    if (!file_exists($statsfile)) {
        $stats = array('total' => 0, 'excluded' => 0, 'queries' => 0);
        file_put_contents($statsfile, serialize($stats));
    }
    //TODO: file_get_contents, fopen, flock, fwrite & fclose within bucle
    $stats = unserialize(file_get_contents($statsfile));
    if( $fh = fopen($statsfile, 'w+') ) {
        $waitsum = 0;
        // attempt to get exclusive, non-blocking lock
        $locked = flock($fh, LOCK_EX | LOCK_NB);
        while( !$locked && ($waitsum <= $lockwait) ) {
            $waitsum += $waittime/1000000; // microseconds to seconds
            usleep($waittime);
            $locked = flock($fh, LOCK_EX | LOCK_NB);
        }
        if( !$locked ) {
            //echo "Could not lock $statsfile for write within $lockwait seconds.";
        } else {
            $stats['queries']++;
            $stats['total'] += $total;
            $stats['excluded'] += $excluded;
            fwrite($fh, serialize($stats));
            flock($fh, LOCK_UN);  // ALWAYS unlock
        }
        fclose($fh);            // ALWAYS close your file handle
    } else {
        //echo "Could not open $statsfile";
    }
}

if (!isset($_REQUEST['r']))
    $_REQUEST['r'] = '';

if (isset($_REQUEST['f']) && strtolower($_REQUEST['f']) == 'rss') {
    $data = array('q' => $_REQUEST['q'], 'p' => $_REQUEST['p'], 'r' => $_REQUEST['r']);
    $sdata = serialize($data);
    $tiny = md5($sdata);
    if (file_exists("data/".$tiny)) {
        $bdata = unserialize(file_get_contents("data/".$tiny));
        if (isset($bdata['hashes'])) {
            $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'] = $bdata['hashes'];
        }
    } else {
        file_put_contents("data/".$tiny, $sdata);
    }
}

if (isset($_REQUEST['tiny'])) {
	$data = array('q' => $_REQUEST['q'], 'p' => $_REQUEST['p'], 'r' => $_REQUEST['r']);
	$sdata = serialize($data);
	$tiny = md5($sdata);
	file_put_contents("data/".$tiny, $sdata);
	echo $tiny;
} else if (isset($_REQUEST['stats'])) {
    header('Content-Type: application/json; charset=utf-8', true,200);
    echo json_get_encoded(unserialize(file_get_contents("data/stats")));
} else if (isset($_REQUEST['uuid'])) {
    $_REQUEST['uuid'] = addslashes(stripslashes($_REQUEST['uuid']));
    header('Content-Type: application/json; charset=utf-8', true,200);
    echo json_get_encoded(unserialize(file_get_contents("data/".$_REQUEST['uuid'])));
} else {

	$data['channel'] = array(
		"title" => RSSZ_SITE_NAME.' '.urldecode($_REQUEST['q']),
		"link"  => RSSZ_SITE_URL,
		"dataSource"  => "http://torrentz.eu/",
		"project"  => "https://github.com/Theadd/TorrentzRSS",
		"author"  => "Theadd",
		"version"  => "1.1",
		"license"  => "GPL v2",
		"params"  => $_REQUEST['p'],
		"rules"  => $_REQUEST['r'],
		"query"  => $_REQUEST['q'],
		"errors"  => 0,
		"ttl"  => (($userTTL < RSSZ_MIN_TTL) ? RSSZ_MIN_TTL : $userTTL),
		"total" => 0,
		"excluded" => 0
	);

	$value = run($_REQUEST['p'], $_REQUEST['r'], $_REQUEST['q']);
	$data['channel'] = array_merge($data['channel'], $value);
	$data['channel']["total"] = count($value);
	$data['channel']["excluded"] = $results - $data['channel']["total"];
	$data['channel']["errors"] = $errors;

	if (isset($_REQUEST['f']) && strtolower($_REQUEST['f']) == 'json') {
		//header('Content-Type: application/json');
        header('Content-Type: application/json; charset=utf-8', true,200);
		echo json_get_encoded($data);
	} else {    //rss

        //save returned hashes so we'll prioritize them in later rss calls
        $bdata = unserialize(file_get_contents("data/".$tiny));
        $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'] = array();
        foreach ($value as $result) {
            $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'][$result['hash']] = true;
        }
        $bdata['hashes'] = $GLOBALS['session'][$GLOBALS['SQI']]['priority_hashes'];
        file_put_contents("data/".$tiny, serialize($bdata));
        //end save

        $options = array(
            "indent"          => "    ",
            "linebreak"       => "\n",
            "typeHints"       => false,
            "addDecl"         => true,
            "encoding"        => "UTF-8",
            "rootName"        => "rss",
            "rootAttributes"  => array("version" => "2.0"),
            "defaultTagName"  => "item",
            "attributesArray" => "_attributes"
        );

		$serializer = new XML_Serializer($options);

		if ($serializer->serialize($data)) {
			header('Content-type: text/xml');
			echo $serializer->getSerializedData();
		}
	}

    register_shutdown_function('triggerOnShutdown', $data['channel']["total"], $data['channel']["excluded"], getcwd().'/data/stats', $errors, getcwd().'/data/errors.log');

}

?>