//alert ("Hallo Welt!")

const div = document.getElementById("map");
const breite1 = div.getAttribute("data-lat1");
const laenge1 = div.getAttribute("data-lng1");
const titel1 = div.getAttribute("data-title1");

const breite2 = div.getAttribute("data-lat2");
const laenge2 = div.getAttribute("data-lng2");
const titel2 = div.getAttribute("data-title2");
//console.log(breite,laenge,titel);
//Karte initialisieren
let karte = L.map("map");
//console.log (karte);

//auf Ausschnitt zoomen
karte.setView(
    [breite1, laenge1],
    13 // Zoomfaktor 1= ganze Welt bis 25= sehr nah

);

//Openstreet Map hinzufügen
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png",{
 subdomains: ["a","b", "c"],
 attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

}).addTo(karte);

//positionsmarker hinzufügen
let pin1 = L.marker(
    [breite1, laenge1]
).addTo(karte);

let pin2 = L.marker(
    [breite2, laenge2]
).addTo(karte);

//popup zum Pin hängen
pin1.bindPopup(titel1).openPopup();
pin2.bindPopup(titel2).openPopup();

let blickeGruppe = L.featureGroup().addTo(karte)

for (let blick of ADLERBLICKE) {

    let blickpin = L.marker([blick.lat, blick.lng]).addTo(blickeGruppe);
    blickpin.bindPopup(
        `<h1>Standort ${blick.standort}</h1>
        <p>Höhe: ${blick.seehoehe} m </p>
        <em>Kunde: ${blick.kunde}</em>`);

}

//console.log(blickeGruppe.getBounds());

//Auf Adlerblicke zoomen
karte.fitBounds(blickeGruppe.getBounds());