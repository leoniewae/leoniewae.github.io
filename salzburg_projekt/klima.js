let karte = L.map("map");

const kartenlayer = {
    osm: L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    bmapgelaende: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    stamen_relief: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }),
    stamen_watercolor: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
    }),


};

kartenlayer.geolandbasemap.addTo(karte);


const layerControl = L.control.layers({
    "Geoland Basemap": kartenlayer.geolandbasemap,
    "Geoland Basemap Orthofoto": kartenlayer.bmaporthofoto30cm,
    "Geoland Basemap Gelände": kartenlayer.bmapgelaende,
    "Stamen Relief": kartenlayer.stamen_relief,
    "Stamen Watercolor": kartenlayer.stamen_watercolor
}).addTo(karte);


let letzteGeonamesUrl = null;
karte.on("load zoomend moveend", function () {
    console.log("karte geladen", karte.getBounds());

    const wikipediaGruppe = L.featureGroup().addTo(karte);
    layerControl.addOverlay(wikipediaGruppe, "Wikipedia Artikel");


    async function wikipediaArtikelLaden(url) {
        wikipediaGruppe.clearLayers();


        console.log("Lade", url);


        const response = await fetch(url)
        const jsonData = await response.json();

        console.log(jsonData);
        for (let artikel of jsonData.geonames) {
            const wikipediamarker = L.marker([artikel.lat, artikel.lng], {
                icon: L.icon({
                    iconUrl: "icons/icons8-wikipedia-26.png",
                    iconSize: [22, 22]
                })

            }).addTo(wikipediaGruppe);


            wikipediamarker.bindPopup(`
        <h3>${artikel.titel}</h3>
        <p>${artikel.summary}</p>
        <hr>
        <footer><a target="_blank" href="https://${artikel.wikipediaUrl}"Weblink</a></footer>
        `);
        }
    }

    let ausschnitt = {
        n: karte.getBounds().getNorth(),
        s: karte.getBounds().getSouth(),
        o: karte.getBounds().getEast(),
        w: karte.getBounds().getWest()
    }
    console.log(ausschnitt);
    const geonamesUrl = `http://api.geonames.org/wikipediaBoundingBoxJSON?formatted=true&north=${ausschnitt.n}&south=${ausschnitt.s}&east=${ausschnitt.o}&west=${ausschnitt.w}&username=webmapping&style=full&maxRows=50&lang=de`;
    console.log(geonamesUrl);

    if (geonamesUrl != letzteGeonamesUrl) {
        //JSON-Artikel Laden
        wikipediaArtikelLaden(geonamesUrl);
        letzteGeonamesUrl = geonamesUrl;
    }
});


karte.setView(
    [47.80814, 11.04209], 8);
const url = 'https://www.salzburg.gv.at/ogd/294de677-b02d-4a74-b189-cc04fa820d96/Schipisten_WGS84.json'

function schimakemarker(feature, latlng) {
    const icon = L.icon({
        iconUrl: 'http://www.data.wien.gv.at/icons/sehenswuerdigogd.svg',
        iconSize: [16, 16]
    });
    const schimarker = L.marker(latlng, {
        icon: icon
    });

    schimarker.bindPopup(`
        <h3>${feature.properties.NAME}</h3>
        <p> ${feature.properties.BEMERKUNG}<p>
        <hr>
        <footer><a href="${feature.properties.WEITERE_INF}" target = "Wienfenster" >Weblink</a></footer>
        `);
    return schimarker
}
async function loadSchi(url) {
    const clusterGruppe = L.markerClusterGroup();
    const response = await fetch(url);
    const schiData = await response.json();
    const geoJson = L.geoJson(schiData, {
        pointToLayer: schimakemarker
    });
    clusterGruppe.addLayer(geoJson);
    karte.addLayer(clusterGruppe);
    layerControl.addOverlay(clusterGruppe, "SchiPisten");


    karte.addControl(new L.Control.Fullscreen());

    const scale = L.control.scale({
        imperial: false,
        metric: true,
    });
    karte.addControl(scale);

    const suchFeld = new L.Control.Search({
        layer: clusterGruppe,
        propertyName: "NAME",
        zoom: 17,
        initial: false
    });
    karte.addControl(suchFeld);}