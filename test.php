<?php
/*
$sujeto = "Revolution 2012 S02E18 SWESUB HDTV XviD Haggebulle";
$patron = "/[[:space:]]([0-9]+?)[[:space:]]/";
preg_match("/[[:space:]]s([0-9]+)e([0-9]+)[[:space:]]/i", $sujeto, $m, PREG_OFFSET_CAPTURE);
//preg_match_all($patron, $sujeto, $m, PREG_SET_ORDER);
echo "<pre>".print_r($m, true)."</pre>";
*/

$url = 'http://torrentz.eu/feed_anyA?q=%22da+vincis+demons%22+|+%22falling+skies%22+|+continuum+|+defiance+|+%22doctor+who%22+|+vikings+|+revolution+|+fringe+|+%22game+of+thrones%22+|+outcasts+|+%22marvel+agents%22+|+%22orphan+black%22+%2B720p+size+%3E+500m+size+%3C+2g';
$proxy = '127.0.0.1:8888';
//$proxyauth = 'user:password';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
//curl_setopt($ch, CURLOPT_PROXY, $proxy);
curl_setopt($ch, CURLOPT_PROXY, null);
//curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
$curl_scraped_page = curl_exec($ch);
curl_close($ch);

echo $curl_scraped_page;


?>
