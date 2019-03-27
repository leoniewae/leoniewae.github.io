//alert ("Hallo Welt!")

const div= document.getElementById("map");
const breite1 = div.getAttribute ("data-lat1");
const laenge1 = div.getAttribute ("data-lng1");
const titel1 = div.getAttribute ("data-title1");

const breite2 = div.getAttribute ("data-lat2");
const laenge2 = div.getAttribute ("data-lng2");
const titel2 = div.getAttribute ("data-title2");
//console.log(breite,laenge,titel);
//Karte initialisieren
let karte = L.map ("map");
//console.log (karte);

//auf Ausschnitt zoomen
karte.setView (
    [breite,laenge],
    13 // Zoomfaktor 1= ganze Welt bis 25= sehr nah

);

//Openstreet Map hinzufügen
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(karte);

//positionsmarker hinzufügen
let pin = L.marker(
   [breite1,laenge1]
).addTo(karte);
let pin = L.marker(
    [breite2,laenge2]
 ).addTo(karte);

//popup zum Pin hängen
pin.bindPopup(titel1).openPopup();
pin.bindPopup(titel2).openPopup();
