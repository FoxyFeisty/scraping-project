<?php 

error_reporting(0);

// URL empfangen
$url = filter_input(INPUT_POST, 'data');

$test = filter_input(INPUT_POST, 'test');
	
// HTTP-Verbindung im Hintergrund aufbauen und alle Website-Daten als String empfangen
$xml = file_get_contents($url, false);

if ($xml !== false) {

	preg_match("/<body[^>]*>(.*?)<\/body>/is", $xml, $matched);
	$filter_body = preg_replace("/<body[^>]*>/is", "", $matched[0]);
	$filter_body = preg_replace("/<\/body>/is", "", $filter_body);
	$filter_script = preg_replace("/<script[^>]*>(.*?)<\/script>/is", "", $filter_body);
	$filter_br = preg_replace("/(<br[^>]*>\s*){2,}/is", "", $filter_script);
	$filter_all = preg_replace("/<img[^>]*>/is", "", $filter_br);

	echo $filter_all;

} else {

	echo "<div class=\"detail\">URL $url nicht erreichbar</div>";
}
