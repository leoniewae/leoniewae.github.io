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
    bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
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
    bmapoberflaeche: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoberflaeche/grau/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    stamen_toner: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.pgn", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
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
    "Geoland Basemap Grau": kartenlayer.bmapgrau,
    "Basemap High DPI": kartenlayer.bmaphidpi,
    "Geoland Basemap Orthofoto": kartenlayer.bmaporthofoto30cm,
    "Geoland Basemap Gelände": kartenlayer.bmapgelaende,
    "Geoland Basemap Oberfläche": kartenlayer.bmapoberflaeche,
    "Stamen Toner": kartenlayer.stamen_toner,
    "Stamen Relief": kartenlayer.stamen_relief,
    "Stamen Watercolor": kartenlayer.stamen_watercolor
}).addTo(karte);



karte.setView(
    [47.267222, 11.392778], 13);

async function loadStations() {
    const response = await fetch("https://aws.openweb.cc/stations");
    const stations = await response.json();


    const awsTirol = L.featureGroup();
    L.geoJson(stations)
        .bindPopup(function (layer) {
            const date = new Date(layer.feature.properties.date);
            console.log("Datum : ", date);
            return `<h4>${layer.feature.properties.name}</h4>
            Höhe (m): ${layer.feature.geometry.coordinates [2]} m<br>
            Temperatur: ${layer.feature.properties.LT} °C <br>
            Windgeschwindigkeit: 
        ${layer.feature.properties.WG ? layer.feature.properties.WG + 'km/h' : 'keine Daten'}
    Datum: ${date.toLocaleDateString("de-AT")}
    ${date.toLocaleTimeString("de-At")};
    <hr>
    <footer>Quelle: Land Tirol - <a href= "https://data.tirol.gv.at "> data.tirol.gv.at </a></footer></hr>`;
        })
        .addTo(awsTirol);
    //awsTirol.addTo(karte);

    karte.fitBounds(awsTirol.getBounds());
    layerControl.addOverlay(awsTirol, "Weterstationen Tirol");

    //windrichtung anzeigen
    const windlayer = L.featureGroup();
    L.geoJson(stations, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.WR) {
                let color = 'black';
                if (feature.properties.WG > 20) {
                    color = 'red';
                }
                return L.marker(latlng, {
                    icon: L.divIcon({
                        html: `<i style= "color: ${color}; transform: rotate(${feature.properties.WG}deg)" class="fas fa-arrow-circle-up fa-3x"></i>`
                    })
                });
            }
        }
    }).addTo(windlayer);
    layerControl.addOverlay(windlayer, "Windrichtung");
    //windlayer.addTo(karte);

    //Temperatur anzeigen
    const temperaturlayer = L.featureGroup();
    const farbPalette=[
        [0, "blue"],
        [1, "orange"]
        [2, "red"],
    ];
    L.geoJson(stations, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.LT) {
                let color = 'red';
            for (let i=0; i<farbPalette.length; i++) {
                console.log(farbPalette[i], feature.properties.LT);
                if (feature.properties.LT < farbPalette[i][0]) {
                    color = farbPalette[i][1];
                    break;
                }
            }
            
                let color = 'blue';
                if (feature.properties.LT > 0) {
                    color = 'red';
                }
                return L.marker(latlng, {
                    icon: L.divIcon({
                        html: `<div class= "temperaturLabel" style="background-color:${color}">${feature.properties.LT}</div>`
                    })
                });
            }
        }
    }).addTo(temperaturlayer);
    layerControl.addOverlay(temperaturlayer, "Temperatur");
    temperaturlayer.addTo(karte);

}
loadStations();