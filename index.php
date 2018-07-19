<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="scraping.css" type="text/css"></link>
<!-- 		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous"> -->
		<title>SCRAPING</title>
	</head>
	<body>
		<nav>
			<ul>
				<li id="start">Start</a></li>
				<li id="store">Karte speichern</li>
				<li id="menues">Mein Menü</li>
			</ul>
		</nav>

		<div id="divStart">
			<h1>LunchLover – die App für alle Hungrigen</h1>
			<p>Dein Highlight des Tages ist die Mittagspause? Dann bist du hier richtig! Mit "LunchLover" kannst du dir die Mittagskarten deiner Lieblingsrestaurants ganz einfach aufs Handy holen.</p>
			<div class="blockDiv">
				<h2>Und so geht's:</h2>
				<ol>
					<li>Gehe zur Website deines Lieblingslokals und schau, ob sie eine Mittagskarte online haben.</li>
					<li>Kopiere den genauen Browserlink und füge ihn hier unter "Karte speichern" ein.</li>
					<li>Jetzt siehst du die gesamte Seite. Wähle durch Klicken den Bereich mit der Mittagskarte aus.</li>
					<li>Wenn du mit der gelben Auswahl zufrieden bist, dann gib noch den Namen des Lokals ein, drücke auf "Auswahl speichern" – fertig!</li>
					<li>Deine gesammelten Mittagskarten findest du unter "Mein Menü".</li>
				</ol>
			</div>
		</div>

		<div id="divStore">
			<p>Einfach Website mit der gewünschten Mittagskarte einfügen und auf "Absenden" klicken.</p>
			<form action="<?php echo $_SERVER["SCRIPT_NAME"] ?>" method="POST" id="urlForm">
				<input type="text" id="urlInput" name="urlInput">
				<div id="btnDiv">
					<button class="button" type="button" id="urlBtn" name="urlBtn">Absenden</button>
					<button class="button" type="button" id="deleteBtn">Löschen</button>
				</div>
			</form>
			<div id="uploadDiv">
				<div id="lokalDiv"><p>Gib den Namen des Lokals an und wähle unten einen Bereich aus:</p></div>
				<form class="hidden" id="uploadForm" action="<?php echo $_SERVER["SCRIPT_NAME"] ?>" method="POST">
					<input type="text" id="menueName" name="menueName">
					<button class="button" type="button" id="uploadBtn" name="uploadBtn">Auswahl speichern</button>
				</form>
				<div class="hidden" id="reminder"></div>
			</div>
			<div class="hidden" id="fehler"></div>
		</div>

		<div class="hidden" id="divMessage">
			<p>Deine Mittagskarte wurde erfolgreich hochgeladen.</p>
		</div>

		<div id="divMenue">
			<!-- <button class="button" type="button" id="testBtn" name="testBtn">Menü laden</button> -->
			<button class="button" type="button" id="newBtn">Alle aktualisieren</button>
			<button class="button" type="button" id="selectBtn">Menü bearbeiten</button>
			<div id="allMenues"></div>
		</div>

		<script src="scrape.js" type="text/javascript"></script>
	</body>
</html>