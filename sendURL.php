<?php 
// URL empfangen
$url = filter_input(INPUT_POST, 'data');

$test = filter_input(INPUT_POST, 'test');

if ($test === "download") {
	
	// HTTP-Verbindung im Hintergrund aufbauen und alle Website-Daten als String empfangen
	$xml = file_get_contents($url, true);

	//echo $xml;

	// <body> herausfiltern
	preg_match("/<body[^>]*>(.*?)<\/body>/is", $xml, $matched);
	$filter_body = preg_replace("/<body[^>]*>/is", "", $matched[0]);
	$filter_body = preg_replace("/<\/body>/is", "", $filter_body);
	$filter_body = preg_replace("/<script[^>]*>/is", "", $filter_body);
	$filter_body = preg_replace("/<\/script>/is", "", $filter_body);
	$filter_body = preg_replace("/<img[^>]*>/is", "", $filter_body);

	echo $filter_body;
}
if ($test === "update") {

	// HTTP-Verbindung im Hintergrund aufbauen und alle Website-Daten als String empfangen
	$xml = file_get_contents($url, true);

	//echo $xml;

	// <body> herausfiltern
	preg_match("/<body[^>]*>(.*?)<\/body>/is", $xml, $matched);
	$filter_body = preg_replace("/<body[^>]*>/is", "", $matched[0]);
	$filter_body = preg_replace("/<\/body>/is", "", $filter_body);
	$filter_body = preg_replace("/<script[^>]*>/is", "", $filter_body);
	$filter_body = preg_replace("/<\/script>/is", "", $filter_body);
	$filter_body = preg_replace("/<img[^>]*>/is", "", $filter_body);

	echo $filter_body;

	// $urlArr = explode(",", $url);
	// for ($i=0; $i<count($urlArr); $i++) {
	// 	$xml = file_get_contents($urlArr[$i], true);
	// }
	// echo $xml;



	// for ($i=0; $i<count($url); $i++) {
	// 	$xml = file_get_contents($url[$i], true);
	// 	echo $xml;
	// }
	// $xml[] = file_get_contents($url, true);
	// for ($i = 0; $i < count($xml); $i++) {
	// 	echo $xml[0]);
	// }
}

