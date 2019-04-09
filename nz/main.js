//alert ("Hallo Welt!")

const div = document.getElementById("map");
const breite = div.getAttribute("data-lat");
const laenge = div.getAttribute("data-lng");
const titel = div.getAttribute("data-title");

//console.log(breite,laenge,titel);
//Karte initialisieren
let karte = L.map("map");
//console.log (karte);

//auf Ausschnitt zoomen
karte.setView(
    [breite, laenge],
    13 // Zoomfaktor 1= ganze Welt bis 25= sehr nah

);

const kartenlayer = {
    osm: L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),

    stamen_toner: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.pgn",{
        subdomains: ["a", "b","c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }),
    stamen_relief: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",{
        subdomains: ["a", "b","c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }),
    stamen_watercolor: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",{
       subdomains: ["a", "b","c"],
       attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
    })

};

kartenlayer.stamen_relief.addTo(karte)

L.control.layers ({
"Stamen Toner": kartenlayer.stamen_toner,
"Stamen Relief": kartenlayer.stamen_relief,
"Stamen Watercolor": kartenlayer.stamen_watercolor
}).addTo(karte);


//Openstreet Map hinzufügen
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(karte);

//positionsmarker hinzufügen
let pin = L.marker(
    [breite, laenge]
).addTo(karte);

//popup zum Pin hängen
pin.bindPopup(titel).openPopup();

karte.addControl(new L.Control.Fullscreen());
var hash = new L.Hash(karte);
var coords = new L.Control.Coordinates();
coords.addTo(karte);
karte.on('click', function(e) {
	coords.setCoordinates(e);
});