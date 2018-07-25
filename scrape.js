(function() {

var navStart = document.getElementById("start"),
	navStore = document.getElementById("store"),
	navMenue = document.getElementById("menues"),
	navArr = [navStart, navStore, navMenue],
	divStart = document.getElementById("divStart"),
	divStore = document.getElementById("divStore"),
	divMenue = document.getElementById("divMenue"),
	loadSVG = document.getElementById("loadSVG"),
	divMessage = document.getElementById("divMessage"),
	divMessage2 = document.getElementById("divMessage2"),
	urlInput = document.getElementById("urlInput"),
	urlBtn = document.getElementById("urlBtn"),
	uploadDiv = document.getElementById("uploadDiv"),
	uploadForm = document.getElementById("uploadForm"),
	inputName = document.getElementById("menueName"),
	reminder = document.getElementById("reminder"),
	uploadBtn = document.getElementById("uploadBtn"),
	fehlerDiv = document.getElementById("fehler"),
	deleteBtn = document.getElementById("deleteBtn"),
	newBtn = document.getElementById("newBtn"),
	selectBtn = document.getElementById("selectBtn"),
	allMenues = document.getElementById("allMenues"),
	lengthChildren = divMenue.children.length,	// abhängig von Button-Anzahl darüber
	clickedItem,
	posInArr,
	classItem,		
	menueText,		
	posItem,		
	test = "",
	toggleVar = "stop",
	toggleVar2 = "stop";

// Objekt zum Speichern und Auslesen der Mittagskarten im LocalStorage
function Menue() {
	this.scrapeData = {
			"menueName" : [],
			"url" : [],
			"classItem" : [],
			"posItem" : [],
			"menueText" : []
		},
	that = this;

	this.returnData = function() {
		return that.scrapeData;
	}
	// Aktuelle Menü-Daten im LocalStorage speichern
	this.storeData = function(place, page, css, pos, txt) {
		console.log("1: ", that.scrapeData);
		console.log("2: ", scrapeObj);
		that.scrapeData.menueName.push(place);
		that.scrapeData.url.push(page);
		that.scrapeData.classItem.push(css);
		that.scrapeData.posItem.push(pos);
		that.scrapeData.menueText.push(txt);
		localStorage.setItem('scrapeData', JSON.stringify(that.scrapeData));
		console.log('storeData: in LocalStorage gespeichert.');
	}
	// Gesamtes Menü auslesen
	this.getDataStorage = function() {
		that.scrapeData = JSON.parse(localStorage.getItem("scrapeData"));
		return that.scrapeData;
	}
	// Karte updaten
	this.updateText = function(pos, txt) {
		// that.returnData();
		that.scrapeData.menueText[pos] = txt;
		localStorage.setItem('scrapeData', JSON.stringify(that.scrapeData));
		console.log('updateText: LocalStorage überschrieben.')
	}
}
// Objekt initialisieren
var scrapeObj = new Menue();

// AJAX-Verbindung
var ajaxhttp = new XMLHttpRequest();
ajaxhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		if (ajaxhttp.responseText && test == "download") {
			fehler.style.display = "inline";
			fehler.innerHTML = ajaxhttp.responseText;
			loadSVG.classList.add("hidden");
		}
		if (ajaxhttp.responseText && test == "update") {
			// Gesamte Website mit LocalStorage-Infos filtern
			var div = document.createElement("div");
			div.innerHTML = ajaxhttp.responseText;	// innerHTML (statt textNode) für "getElementsByClassName"-Methode
			var arr = div.getElementsByClassName(classItem);
			var textNeu = arr[posItem].innerHTML;
			// Text in LocalStorage aktualisieren
			scrapeObj.updateText(posInArr, textNeu);
			// Meldung für User ausgeben
			var obj = scrapeObj.returnData();
			// wenn noch kein Meldungs-Div hinzugefügt
			if ((divMenue.children.length-lengthChildren) <= 0) {
				var noteDiv = document.createElement("div");
				noteDiv.innerHTML = "'"+obj.menueName[posInArr]+"' wurde aktualisiert.<br>";
				noteDiv.classList.add("detail");
				divMenue.appendChild(noteDiv);
			} else {
				var noteDiv = divMenue.lastElementChild;
				var str = obj.menueName[posInArr];
				// Test, ob Karte bereits aktualisiert & Meldung vorhanden
				if (noteDiv.innerHTML.indexOf(str) == -1) {
					newDiv = document.createElement("div");
					t = document.createTextNode("'"+obj.menueName[posInArr]+"' wurde aktualisiert.");
					newDiv.appendChild(t);
					noteDiv.appendChild(newDiv);
				}
			}
			loadSVG.classList.add("hidden");
		}
	} 
	else {
		loadSVG.classList.add("hidden");
	}
}
// Daten in FormData() speichern und an Server senden
function sendData(input) {
	var urlData = new FormData();
	urlData.set('data', input);
	urlData.set('test', test);
	ajaxhttp.open('POST', 'sendURL.php', true);
	ajaxhttp.send(urlData);
	loadSVG.classList.remove("hidden");
}
// mit Upload-Button URL senden und Seiteninhalt anfordern
function uploadURL() {
	// Test-Variable für ajaxhttp-Weiche
	test = "download";
	sendData(urlInput.value);
	// evtl. Fehlermeldung ausblenden
	fehlerDiv.innerHTML = "";
	// UploadDiv sichtbar machen
	uploadDiv.style.display = "inline-block";
	uploadForm.style.display = "block";
}
// Fehlermeldungen bei User-Fehleingaben
function errorMessage(str, obj) {
	var p = document.createElement("p"),
		t = document.createTextNode(str);
	p.appendChild(t);
	p.classList.add("detail");
	obj.appendChild(p);
	obj.style.display = "inline";
}
// Überprüfung des eingegebenen URL
function testURL() {
	var regEx = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
	if (urlInput.value.match(regEx) == null || urlInput.value == "") {
		if (fehlerDiv.children.length < 1) { 
			errorMessage("Bitte gib eine gültige URL ein.", fehlerDiv); 
		}
	} else {
		uploadURL();
	}
}
// User-Eingaben prüfen und im LocalStorage speichern
function storeElem(e) {
	// Prüfung der Usereingaben
	reminder.innerHTML = '';
	if (classItem == undefined || posItem == undefined) {
		errorMessage("Bitte wähle unten einen Bereich aus.", reminder);
	} 
	else if (inputName.value === '') {
		errorMessage("Vergiss nicht das Lokal.", reminder);
	}
	else {
		scrapeObj.returnData();
		scrapeObj.storeData(inputName.value, urlInput.value, classItem, posItem, menueText);
		urlInput.value = "";
		menueName.value = "";
		uploadDiv.style.display = "none";
		fehlerDiv.innerHTML = "";
		divStore.style.display = "none";
		divMessage.style.display = "inline";
		fehlerDiv.addEventListener('mouseover', styleElem );
		fehlerDiv.addEventListener('mouseout', unStyleElem );
	}
}
// User-Auswahl auf geladenen Inhalten
function scrapeElem(e) {
	fehlerDiv.removeEventListener('mouseover', styleElem );
	fehlerDiv.removeEventListener('mouseout', unStyleElem );
	var	allElemArr = new Array();
	// farbige Markierung für User
	if (clickedItem !== undefined) {
		clickedItem.style.backgroundColor = "transparent";
	} 
	if (e.target !== e.currentTarget) {
		e.target.style.backgroundColor = "orange";
		// Klasse des angeklickten Bereichs speichern
		clickedItem = e.target,
		classItem = e.target.className;
		e.stopPropagation();
		// alle Elemente mit ermittelten Klasse speichern
		allElemArr = fehler.getElementsByClassName(classItem);
		// Position des tatsächlich angeklickten Elements in Array ermitteln
		for (i=0; i<allElemArr.length; i++) {
			if (allElemArr[i].innerHTML === e.target.innerHTML) {
				posItem = i;
			}
		}
		// Text des angeklickten Bereichs speichern
		menueText = e.target.innerHTML;
	}
}

// Liste der Mittagskarten anzeigen
function showMenues() {
	var x = scrapeObj.getDataStorage();
	// Doppelerstellung der Listenpunkte vermeiden
	if (allMenues.children.length > 0) {
		allMenues.removeChild(allMenues.childNodes[0]);
	}
	liMenue = document.createElement("ul");
	// Listenpunkte aus LocalStorage generieren
	if (x !== null) {
		for (i=0; i<x.menueName.length; i++) {
			var liItem = document.createElement("li");
			var t = document.createTextNode(x.menueName[i]);
			liItem.appendChild(t);
			// data-Attribut gleich mit Position in LocalStorage-Array (für Löschvorgang)
			var att = document.createAttribute("data");   
			att.value = i;
			liItem.setAttributeNode(att); 
			liMenue.appendChild(liItem);
		}
		allMenues.appendChild(liMenue); 
		allMenues.addEventListener('click', showMenueDetail);
	}
}
// Inhalt der Mittagskarten anzeigen
function showMenueDetail(e) {
	var liItems = allMenues.children[0].children;
	if (e.target !== e.currentTarget) {
		for (i=0; i<liItems.length; i++) {
			liItems[i].style.boxShadow = "";
			}
	}
	if (e.target !== e.currentTarget && liItems !== e.target.children) {
		// Listenpunkt, auf den geklickt wurde
		clickedList = e.target.innerHTML;
		// überprüfen, ob Karte bereits geladen 
		if (allMenues.children.length > 1) {
			allMenues.removeChild(allMenues.lastElementChild);
		} 
		// Text aus LocalStorage auslesen & anzeigen
		x = scrapeObj.getDataStorage();
		var arr = x.menueName;
		var i = arr.indexOf(clickedList);
		var div = document.createElement("div");
		// Test, ob Text gespeichert wurde
		if (x.menueText[i] !== "") {
			div.innerHTML = x.menueText[i];
		} else {
			div.innerHTML = "Dieses Menü ist leer.";
		}
		div.classList.add("detail");
		// doppelte Einträge vermeiden 
		if (divMenue.children.length > lengthChildren) {
			divMenue.removeChild(divMenue.children[lengthChildren]);
		}
		divMenue.appendChild(div);
		e.target.style.boxShadow = "2px 3px 2px";
		e.stopPropagation();
	}
}
// Mittagskarten aktualisieren
function updateMenues(e) {
	// Daten aus LocalStorage auslesen
	var obj = scrapeObj.getDataStorage();
	// Pos aus Listen-Data-Attribute ermitteln
	posInArr = e.target.getAttribute('data');
	var urlItem = obj.url[posInArr];
	test = "update";
	posItem = obj.posItem[posInArr];
	classItem = obj.classItem[posInArr];
	// Überprüfen, ob bei gespeichertem Menü Klasse vorhanden
	if (classItem !== '') {
		sendData(urlItem);
	} else {
		divMenue.style.display = "none";
		divMessage2.style.display = "inline";	
	}
}
// Geänderte Ansicht in Menü-Liste bei Löschen/Bearbeiten
function changeStyle() {
	// wenn Detailansicht ausgeklappt, dann diese löschen
	if (divMenue.children.length > lengthChildren) {
		divMenue.removeChild(divMenue.children[lengthChildren]);
	}
	// Listenansicht verändern
	listAll = divMenue.children[lengthChildren-1].children[0].children;
	if (toggleVar === "delete") {
		for (i=0; i<listAll.length; i++) {
			listAll[i].style.backgroundColor = "red";
			// listAll[i].style.border = "3px dashed black";
			listAll[i].innerHTML = ' <i class="fas fa-times"></i> ' + listAll[i].innerHTML;
		}
	}
	else if (toggleVar2 === "updating") {
		for (i=0; i<listAll.length; i++) {
			// listAll[i].style.border = "3px dashed black";
			listAll[i].innerHTML = '<i class="fas fa-sync-alt"></i> ' + listAll[i].innerHTML;
		}
	}
}

// Einträge aus Menü-Liste löschen
function deleteMenues(e) {
	console.log("deleteMenues", e);
	// Daten aus LocalStorage auslesen
	var obj = scrapeObj.getDataStorage();
	// Pos aus Listen-Data-Attribute ermitteln
	var pos = e.target.getAttribute('data');
	// Element aus Array löschen
	obj.menueName.splice(pos, 1);
	obj.menueText.splice(pos, 1);
	obj.classItem.splice(pos, 1);
	obj.posItem.splice(pos, 1);
	obj.url.splice(pos, 1);
	// LocalStorage mit neuem Array überschreiben
	localStorage.setItem('scrapeData', JSON.stringify(obj));
	console.log('deleteMenues: localStorage überschrieben');
	// wenn mindestens 1 Element im LocalStorage gespeichert ist
	if (obj.menueName.length > 0) {
		// Liste neu generieren
		showMenues();
		// Lösch-Style anwenden
		changeStyle();
	} else {
		// alle Elemente gelöscht
		toggleVar = "stop";
		selectBtn.innerHTML = "Löschen";
		showMenues();
		allMenues.removeEventListener('click', deleteMenues);
		allMenues.addEventListener('click', showMenueDetail);
	}
}

// Toggle-Variable und Button-Beschriftung ändern
function selectMenues(e) {
	if (e.target === selectBtn) {
		if (toggleVar2 === "updating") {
			return
		}
		if (toggleVar == "stop" && allMenues.children[0].children.length > 0) {
			toggleVar = "delete";
			selectBtn.innerHTML = "Fertig";
			allMenues.removeEventListener('click', showMenueDetail);
			allMenues.addEventListener('click', deleteMenues);
			changeStyle();
		} else if (allMenues.children[0].children.length > 0) {
			toggleVar = "stop";
			selectBtn.innerHTML = "Einträge löschen";
			allMenues.removeEventListener('click', deleteMenues);
			allMenues.addEventListener('click', showMenueDetail);
			showMenues();
		}
	}
	else if (e.target === newBtn) {
		if (toggleVar === "delete") {
			return
		}
		if (toggleVar2 == "stop" && allMenues.children[0].children.length > 0) {
			toggleVar2 = "updating";
			newBtn.innerHTML = "Fertig"
			allMenues.removeEventListener('click', showMenueDetail);
			allMenues.addEventListener('click', updateMenues);
			changeStyle();
		} else {
			toggleVar2 = "stop";
			newBtn.innerHTML = "Aktualisieren"
			allMenues.removeEventListener('click', updateMenues);
			allMenues.addEventListener('click', showMenueDetail);
			// Update-Meldung löschen
			if ((divMenue.children.length-lengthChildren) > 0) {
				divMenue.removeChild(divMenue.lastElementChild);
			}
			showMenues();
		}
	}
}
// Mouseover-Eventfunktionen bei Auswahl des Scraping-Bereichs
function styleElem(e) {
	if (e.target !== e.currentTarget) {
		e.target.style.backgroundColor = "lightgrey";	
	}
}
function unStyleElem(e) {
	if (e.target !== e.currentTarget) {
		e.target.style.backgroundColor = "";	
	}
}

// Unterfunktionen für Menü-Buttons ...
// ... "Mein Menü" auf "0" setzen bei Wechsel in Navigation
function unsetMenue() {
	if (allMenues.childNodes[0]) { 
		allMenues.removeChild(allMenues.childNodes[0]); 
	}
	if (divMenue.children.length > lengthChildren) {
		divMenue.removeChild(divMenue.children[lengthChildren]);
	}
}
// ... Buttons unter "Mein Menü" zurücksetzen bei Wechsel in Navigation
function unsetBtn() {
	selectBtn.innerHTML = "Einträge löschen";
	newBtn.innerHTML = "Aktualisieren";
	allMenues.removeEventListener('click', deleteMenues);
	allMenues.removeEventListener('click', updateMenues);
	toggleVar = "stop";
	toggleVar2 = "stop";
}
// ... nav-Menüpunkte ein- und ausblenden
function divStyle(inlineElem, elem2, elem3, elem4, elem5) {
	inlineElem.style.display = "inline";
	elem2.style.display = "none";
	elem3.style.display = "none";
	elem4.style.display = "none";
	elem5.style.display = "none";
}
// ... nav-Menüpunkte stylen
function navStyle(e, arr) {
	for (i=0; i<arr.length; i++) {
		if (e.target == arr[i]) {
			arr[i].classList.remove("nav-off");
			arr[i].classList.add("nav-on");
		} else {
			arr[i].classList.remove("nav-on");
			arr[i].classList.add("nav-off");
		}
	}
}

// Event-Funktionen für Menü-Buttons
function showStart(e) {
	divStyle(divStart, divMessage, divMessage2, divStore, divMenue);
	navStyle(e, navArr);
	unsetMenue();
	unsetBtn();
}
function showStore(e) {
	divStyle(divStore, divMessage, divMessage2, divStart, divMenue);
	navStyle(e, navArr);
	unsetMenue();
	unsetBtn();
}
function showMenue(e) {
	divStyle(divMenue, divMessage, divMessage2, divStore, divStart);
	navStyle(e, navArr);
	unsetBtn();
	showMenues();
}

// Event-Listener für ...
// ... Menü-Buttons
navStart.addEventListener('click', showStart);
navStore.addEventListener('click', showStore);
navMenue.addEventListener('click', showMenue);

// ... Buttons
// URL über Inputfeld abschicken
urlBtn.addEventListener('click', testURL);
// URL-Eingabe zurücksetzen
deleteBtn.addEventListener('click', function (e) { 
	urlInput.value = "";
	fehlerDiv.innerHTML = "";
	uploadDiv.style.display = "none";
});
// Menü-Einträge zum Aktualisieren freigeben
newBtn.addEventListener('click', selectMenues);
// Menü-Einträge zum Löschen freigeben
selectBtn.addEventListener('click', selectMenues);
// Ausgewählten Scraping-Bereich speichern
uploadBtn.addEventListener('click', storeElem);

// ... Sonstiges
// Bereich zum Anklicken beim Scrapen
fehlerDiv.addEventListener('click', scrapeElem);
// Hover-Effekt für aktuellen Scraping-Bereich
fehlerDiv.addEventListener('mouseover', styleElem);
// Scraping-Hover-Effekt zurücksetzen
fehlerDiv.addEventListener('mouseout', unStyleElem);
// Menü-Listenpunkte
allMenues.addEventListener('click', showMenueDetail);

}());