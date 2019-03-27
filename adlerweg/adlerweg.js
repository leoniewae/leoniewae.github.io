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
    [breite1,laenge1],
    13 // Zoomfaktor 1= ganze Welt bis 25= sehr nah

);

//Openstreet Map hinzufügen
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(karte);

//positionsmarker hinzufügen
let pin1 = L.marker(
   [breite1,laenge1]
).addTo(karte);

let pin2 = L.marker(
    [breite2,laenge2]
 ).addTo(karte);

//popup zum Pin hängen
pin1.bindPopup(titel1).openPopup();
pin2.bindPopup(titel2).openPopup();

const blick1 = {
    kunde: "Wilder Kaiser",
    standort: "Gruttenhütte",
    seehoehe: "1640",
    lat: 47.55564,
    lng: 12.31861
};

let pin3 = L.marker (
    [blick1.lat, blick1.lng]
).addTo(karte);


    const blick2 = {
        kunde: "Bergbahn Scheffau",
        standort: "Brandstadl",
        seehoehe: "1640",
        lat: 44.4912,
        lng: 12.24522 };

    let pin4 = L.marker (
        [blick2.lat, blick2.lng]
    ).addTo(karte);
    

        const blick3 = {
            kunde: "Lechtal Tourismus",
            standort: "Sonnalm Jöchelspitz",
            seehoehe: "1786",
            lat: 47.41028,
            lng: 10.60083};


        const adlerblicke =[
            blick1,
            blick2,
            blick3
        ];

        for (let blick of adlerblicke) {
let blickpin = L.marker ( [blick.lat, blick.lng]
    ).addTo(karte);
    blickpin.bindPopup(
        `<h1>Standort ${blick1.standort}</h1>
        <p>Höhe: ${blick1.seehoehe} m </p>
        <em>Kunde: ${blick1.kunde}</em>`);
    
        }
    