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


karte.setView(
    [47.80949, 13.05501], 10);

const url = 'https://www.salzburg.gv.at/ogd/28c9e877-36e7-4ced-896e-6bead8f9e190/Liftanlagen.json'

function Liftmakemarker(geometry, latlng) {
    const icon = L.icon({
        iconUrl: "icons/icon_ski_alpin_schwarz_auf_weiss_250px.png",
        iconSize: [16, 16]
    });
    const Liftmarker = L.marker(latlng, {
        icon: icon
    });

    Liftmarker.bindPopup(`
        <h3>${geometry.Name}</h3>
        <p> ${geometry.Name.attributes.Anlagenart.Saison.Status}<p>
        <hr>
        <footer><a href="${geometry.Name.attributes.Anlagenart.Saison.Status}" target = "Lifte" >Weblink</a></footer>
        `);
    return Liftmarker
}
async function loadLift(url) {
    const clusterGruppe = L.markerClusterGroup();
    const response = await fetch(url);
    const LiftData = await response.json();
    const geoJson = L.geoJson(LiftData, {
        pointToLayer: Liftmakemarker
    });
    clusterGruppe.addLayer(geoJson);
    karte.addLayer(clusterGruppe);
    layerControl.addOverlay(clusterGruppe, "Liftanlagen");

    const suchFeld = new L.Control.Search({
        layer: clusterGruppe,
        propertyName: "Name",
        zoom: 17,
        initial: false
    });
    karte.addControl(suchFeld);
}
loadLift(url);


//PlugIns Fullscreen, Maßstab, Minimap, Suchfeld

karte.addControl(new L.Control.Fullscreen());

var coords = new L.Control.Coordinates();
coords.addTo(karte);
karte.on('click', function (e) {
    coords.setCoordinates(e);
});

const scale = L.control.scale({
    imperial: false,
    metric: true,
});
karte.addControl(scale);

new L.Control.MiniMap(

    L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
    }), {
        zoomLevelOffset: -4,
        toggleDisplay: true
    }

).addTo(karte);

