//alert ("Hallo Welt!")

const div= document.getElementById("map");
const breite = div.getAttribute ("data-lat");
const laenge = div.getAttribute ("data-lng");
const titel = div.getAttribute ("data-title");

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
   [breite,laenge]
).addTo(karte);

//popup zum Pin hängen
pin.bindPopup(titel);
