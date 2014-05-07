<?php

/*$var = array();
$var[] = array('name' => 'John');
$var[] = array('name' => 'Willian');
$var[] = array('name' => 'Mary');
$var[] = array('name' => 'Devil');
$_REQUEST['var'] = $var;*/
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



?>