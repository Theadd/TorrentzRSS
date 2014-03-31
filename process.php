<?php

require_once "XML/RSS.php";
require_once 'XML/Serializer.php';


function process_url($url, &$channel) {
    $command = 'curl -x localhost:8118 "'.$url.'" -iX GET';
    $response = shell_exec($command);

    $isHeader = true;
    $content = "";
    foreach(preg_split("/((\r?\n)|(\r\n?))/", $response) as $line){

        if ($isHeader && empty($line)) {
            $isHeader = false;
            continue;
        }
        if (!$isHeader) {
            $content .= $line.PHP_EOL;
        }
    }
    $filename = microtime(true);
    file_put_contents("tmp/".$filename.".xml", $content);

    $rss =& new XML_RSS("tmp/".$filename.".xml");
    $rss->parse();
    $items = $rss->getItems();

    foreach ($items as $item) {
        preg_match("/Size\:\s(.*?)\sSeeds\:\s(\d+?)\D.*?Peers\:\s(\d+?)\D.*?Hash\:\s(.*?)$/", $item['description'], $m);
        $item['link'] = "http://torrage.com/torrent/".strtoupper($m[4]).".torrent";
        $item['size'] = $m[1];
        $item['hash'] = strtoupper($m[4]);
        $item['seeds'] = $m[2];
        $item['peers'] = $m[3];
        $channel[] = $item;
    }

    return count($items);
}


$data['channel'] = array(
    "title" => "TorrentzRSS!",
    "link"  => "http://37.187.9.5/rssz",
    "ttl"  => 15,
    "total" => 0
);

$query = "http://torrentz.eu/feedA?q=espa%C3%B1ol+|+spanish+|+castellano+movies+|+video+seed+%3E+20+size+%3E+600m+size+%3C++6000m+-hdtv+-screener+-latino+-xxx";

$total = 0;
$page = 0;
while (($sum = process_url($query.'&p='.$page, $data['channel'])) != 0) {
    $total += $sum;
    $page+=2;
}

$data['channel']["total"] = $total;

header('Access-Control-Allow-Origin: *');

if (isset($_REQUEST['f']) && strtolower($_REQUEST['f']) == 'json') {
    header('Content-Type: application/json');
    echo json_encode($data, JSON_PRETTY_PRINT);
} else {
    $serializer = new XML_Serializer($options);

    if ($serializer->serialize($data)) {
        header('Content-type: text/xml');
        echo $serializer->getSerializedData();
    }
}