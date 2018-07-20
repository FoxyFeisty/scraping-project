(function() {

var navStart = document.getElementById("start"),
	navStore = document.getElementById("store"),
	navMenue = document.getElementById("menues"),
	navArr = [navStart, navStore, navMenue],
	divStart = document.getElementById("divStart"),
	divStore = document.getElementById("divStore"),
	divMenue = document.getElementById("divMenue"),
	divMessage = document.getElementById("divMessage"),
	urlInput = document.getElementById("urlInput"),
	urlBtn = document.getElementById("urlBtn"),
	uploadDiv = document.getElementById("uploadDiv"),
	uploadForm = document.getElementById("uploadForm"),
	menueName = document.getElementById("menueName"),
	reminder = document.getElementById("reminder"),
	uploadBtn = document.getElementById("uploadBtn"),
	fehlerDiv = document.getElementById("fehler"),
	deleteBtn = document.getElementById("deleteBtn"),
	testBtn = document.getElementById("testBtn"),
	selectBtn = document.getElementById("selectBtn"),
	allMenues = document.getElementById("allMenues"),
	lengthChildren = divMenue.children.length,	// abhängig von Button-Anzahl darüber
	clickedItem,
	globalArr = new Array(),
	classItem,		// evtl. nicht global
	menueText,		// evtl. nicht global
	posItem,		// evtl. nicht global
	inputArr = new Array(),
	urlArr = new Array(),
	test = "",
	toggleVar = "stop",
	menueNameVar = "";

// AJAX-Verbindung
var ajaxhttp = new XMLHttpRequest();
ajaxhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		if (ajaxhttp.responseText && test == "download") {
			fehler.style.display = "inline";
			fehler.innerHTML = ajaxhttp.responseText;
		}
		if (ajaxhttp.responseText && test == "update") {
			// x = ajaxhttp.responseText;
			// innerHTML, nicht textNode
			
			var div = document.createElement("div");
			div.innerHTML = ajaxhttp.responseText;
			globalArr.push(div);
			console.log(globalArr);
			// allMenues.appendChild(div);

				
			// var x = div.getElementsByClassName("csc-default celayout-0");
			// var y = x[6];
		}
	}
}
// Daten in FormData() speichern und an Server senden
function sendData(input) {
	// inputArr.push(input);
	var urlData = new FormData();
	urlData.set('data', input);
	urlData.set('test', test);
	ajaxhttp.open('POST', 'sendURL.php', true);
	ajaxhttp.send(urlData);
}
// mit Upload-Button URL senden und Seiteninhalt anfordern
function uploadURL() {
	// Test-Variable für ajaxhttp-Weiche
	test = "download";
	menueNameVar = '';
	sendData(urlInput.value);
	// UploadDiv sichtbar machen
	uploadDiv.style.display = "inline-block";
	uploadForm.style.display = "block";
}
// Fehlermeldungen bei User-Fehleingaben
function errorMessage(str, obj) {
	var p = document.createElement("p"),
		t = document.createTextNode(str);
	p.appendChild(t);
	obj.appendChild(p);
	obj.style.display = "inline";
}
// Überprüfung des eingegebenen URL
function testURL() {
	var regEx = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
	if (urlInput.value.match(regEx) == null || urlInput.value == "") {
		errorMessage("Bitte geben Sie eine gültige URL ein.", fehlerDiv);
	} else {
		uploadURL();
	}
}


// Objekt zum Speichern und Auslesen der Mittagskarten im LocalStorage
function Menue() {
	var scrapeData = {
			"menueName" : [],
			"url" : [],
			"classItem" : [],
			"posItem" : [],
			"menueText" : []
		},
		that = this;
	// Aktuelle Menü-Daten im LocalStorage speichern
	this.storeData = function(place, page, css, pos, txt) {
		scrapeData.menueName.push(place);
		scrapeData.url.push(page);
		scrapeData.classItem.push(css);
		scrapeData.posItem.push(pos);
		scrapeData.menueText.push(txt);
		localStorage.setItem('scrapeData', JSON.stringify(scrapeData));
	}
	this.updateText = function(nameStr, txt) {
		that.getDataStorage();
		var arr = scrapeData.menueName;
		var pos = arr.indexOf(nameStr);
		scrapeData.menueText.splice(pos, 1);
		scrapeData.menueText.splice(pos, 0, txt);
	}
	// Gesamtes Menü auslesen
	this.getDataStorage = function() {
		scrapeData = JSON.parse(localStorage.getItem("scrapeData"));
		return scrapeData;
	}

	// einzelnen Eintrag auslesen über Parameter 'menueName.value'
	// this.getSingleData = function(nameStr) {
	// 	that.getDataStorage();
	// 	var arr = scrapeData.menueName;
	// 	var i = arr.indexOf(nameStr);
	// 	var singleData = {
	// 		"menueName" : scrapeData.menueName[i],
	// 		"url" : scrapeData.url[i],
	// 		"classItem" : scrapeData.classItem[i],
	// 		"posItem" : scrapeData.posItem[i],
	// 		"menueText" : scrapeData.menueText[i]
	// 	};
	// 	return singleData;
	// }
	this.updateData = function() {
		that.getDataStorage();
		test = "update";
		var arr = scrapeData.menueName;
		for (i=0; i<arr.length; i++) {
			var page = scrapeData.url[i];
			// menueNameVar = scrapeData.menueName[i];
			sendData(page);
		}
		// that.getDataStorage();
		// var arr = scrapeData.menueName;
		// var i = arr.indexOf(nameStr);
		// var page = scrapeData.url[i];
		// sendData(page);
		// test = "update";
	}
	this.updateAll = function() {
		// that.getDataStorage();
		// urlArr = scrapeData.url;
		// test = "update";
		// sendData(urlArr);
		// var urlArr = new Array();
		// for (i=0: i<scrapeData.url.length; i++) {
		// 	urlArr.push(scrapeData.url[i]);
		// }
	}
}
// Objekt initialisieren
var scrapeObj = new Menue();

// User-Eingaben prüfen und im LocalStorage speichern
function storeElem(e) {
	// Prüfung der Usereingaben
	reminder.innerHTML = '';
	if (classItem == undefined || posItem == undefined) {
		errorMessage("Bitte wähle unten einen Bereich aus.", reminder);
	} 
	if (menueName.value === '') {
		errorMessage("Vergiss nicht das Lokal.", reminder);
	}
	else {
		scrapeObj.storeData(menueName.value, urlInput.value, classItem, posItem, menueText);
		urlInput.value = "";
		menueName.value = "";
		uploadDiv.style.display = "none";
		fehlerDiv.innerHTML = "";
		divStore.style.display = "none";
		divMessage.style.display = "inline";	
	}
}
// User-Auswahl auf geladenen Inhalten
function scrapeElem(e) {
	var	allElemArr = new Array();
	// farbige Markierung für User
	if (clickedItem !== undefined) {
		clickedItem.style.backgroundColor = "transparent";
	} 
	if (e.target !== e.currentTarget) {
		e.target.style.backgroundColor = "yellow";
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
		menueText = e.target.outerText;
	}
}
// Liste der Mittagskarten anzeigen
function showMenues() {
	var x = scrapeObj.getDataStorage();
	// Doppelerstellung der Listenpunkte vermeiden
	if (allMenues.children.length > 0) {
		allMenues.removeChild(allMenues.childNodes[0]);
	}
	// if (allMenues.children.length == 0) {
		liMenue = document.createElement("ul");
	// }
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
	}
}
// Inhalt der Mittagskarten anzeigen
function showMenueDetail(e) {
	var liItems = allMenues.children[0].children;
	if (e.target !== e.currentTarget) {
		for (i=0; i<liItems.length; i++) {
			liItems[i].style.border = "3px solid orange";
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
		div.innerText = x.menueText[i];
		div.style.backgroundColor = "white";
		// doppelte Einträge vermeiden 
		if (divMenue.children.length > lengthChildren) {
			divMenue.removeChild(divMenue.children[lengthChildren]);
		}
		divMenue.appendChild(div);
		e.target.style.border = "3px solid black";
		e.stopPropagation();
	}
}

// Mittagskarten aktualisieren
function updateMenues() {
	// ################# TBD #################### /
	scrapeObj.updateData();
}

// Einträge aus Menü-Liste löschen
function deleteMenues(e) {
	// Daten aus LocalStorage auslesen
	var obj = scrapeObj.getDataStorage();
	// Pos aus Listen-Data-Attribute ermitteln
	pos = e.target.getAttribute('data');
	// Element aus Array löschen
	obj.menueName.splice(pos, 1);
	obj.menueText.splice(pos, 1);
	obj.classItem.splice(pos, 1);
	obj.posItem.splice(pos, 1);
	obj.url.splice(pos, 1);
	// LocalStorage mit neuem Array überschreiben
	localStorage.setItem('scrapeData', JSON.stringify(obj));
	// // überprüfen, ob nur noch ein Element
	// if (obj.menueName.length == 1) {
	// 	toggleVar = "select";
	// }
	if (obj.menueName.length > 0) {
		// Liste neu generieren
		showMenues();
		// Lösch-Style anwenden
		deleteStyle();
	} else {
		selectMenues();
	}
}

// Löschansicht in Menü-Liste
function deleteStyle() {
// wenn Detailansicht ausgeklappt, dann diese löschen
if (divMenue.children.length > lengthChildren) {
	divMenue.removeChild(divMenue.children[lengthChildren]);
}
// Listenansicht verändern
listAll = divMenue.children[lengthChildren-1].children[0].children;
for (i=0; i<listAll.length; i++) {
	listAll[i].style.backgroundColor = "red";
	listAll[i].style.border = "3px dashed black";
	listAll[i].innerHTML = listAll[i].innerHTML + " löschen";
}




// div = document.createElement("div");
// t = document.createTextNode("Klicke auf eine Mittagskarte, um sie zu löschen.");
// div.appendChild(t);
// divMenue.insertBefore(div, allMenues);
}

// Toggle-Variable und Button-Beschriftung ändern
function selectMenues() {
	if (toggleVar == "stop" && allMenues.children[0].children.length > 0) {
		toggleVar = "delete";
		selectBtn.innerHTML = "Fertig"
		allMenues.removeEventListener('click', showMenueDetail);
		allMenues.addEventListener('click', deleteMenues);
		deleteStyle();
	} else {
		toggleVar = "stop";
		selectBtn.innerHTML = "Einträge löschen"
		allMenues.removeEventListener('click', deleteMenues);
		allMenues.addEventListener('click', showMenueDetail);
		showMenues();
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
// ... nav-Menüpunkte ein- und ausblenden
function divStyle(inlineElem, elem2, elem3, elem4) {
	inlineElem.style.display = "inline";
	elem2.style.display = "none";
	elem3.style.display = "none";
	elem4.style.display = "none";
}
// ... nav-Menüpunkte stylen
function navStyle(e, arr) {
	for (i=0; i<arr.length; i++) {
		if (e.target == arr[i]) {
			arr[i].style.backgroundColor = "black";
			arr[i].style.color = "white";
		} else {
			arr[i].style.backgroundColor = "white";
			arr[i].style.color = "black";
		}
	}
}
// Event-Funktionen für Menü-Buttons
function showStart(e) {
	divStyle(divStart, divMessage, divStore, divMenue);
	navStyle(e, navArr);
	unsetMenue();
}
function showStore(e) {
	divStyle(divStore, divMessage, divStart, divMenue);
	navStyle(e, navArr);
	unsetMenue();
}
function showMenue(e) {
	divStyle(divMenue, divMessage, divStore, divStart);
	navStyle(e, navArr);
	showMenues();
}

// Event-Listener für ...

// ... Menü-Buttons
navStart.addEventListener('click', showStart);
navStore.addEventListener('click', showStore);
navMenue.addEventListener('click', showMenue);

// ... Buttons
newBtn.addEventListener('click', updateMenues);

// URL über Inputfeld abschicken
urlBtn.addEventListener('click', testURL);
// URL-Eingabe zurücksetzen
deleteBtn.addEventListener('click', function (e) { 
	urlInput.value = "";
	fehlerDiv.innerHTML = "";
});

// Einträge aktualisieren
// if (toggleVar == "delete") {
// 	selectBtn.removeEventListener('click', stopDelete );
selectBtn.addEventListener('click', selectMenues );
// } else if (toggleVar == "stop") {
// 	selectBtn.removeEventListener('click', deleteMenues );
// 	selectBtn.addEventListener('click', stopDelete );
// }

// Ausgewählten Scraping-Bereich speichern
uploadBtn.addEventListener('click', storeElem);


// ... Sonstiges
// Bereich zum Anklicken beim Scrapen
fehlerDiv.addEventListener('click', scrapeElem);
// Menü-Listenpunkte
allMenues.addEventListener('click', showMenueDetail);

}());


// ####### NOTES ########## 

// ####### Weitere Attribute von 'e' (Event) ######### 
// itemFirstChild = e.target.firstElementChild,
// itemLastChild = e.target.lastElementChild,
// itemPreviousElementSibling = e.target.previousElementSibling;
// classItemArr = e.target.classList; // Array mit einzelnen Klassen
// itemStyle = e.target.attributes[2].value; // "background-color: yellow;"