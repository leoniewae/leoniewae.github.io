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
            Relative Feuchte (%): ${layer.feature.properties.RH ? layer.feature.properties.RH:"keine Daten"} <br>
            Windgeschwindigkeit: ${layer.feature.properties.WG ? layer.feature.properties.WG + 'km/h' : 'keine Daten'}
    Datum: ${date.toLocaleDateString("de-AT")} ${date.toLocaleTimeString("de-At")}; <hr>


    <footer>Quelle: Land Tirol - <a href= "https://data.tirol.gv.at "> data.tirol.gv.at </a></footer></hr>`;
        })
        .addTo(awsTirol);
    //awsTirol.addTo(karte);

    karte.fitBounds(awsTirol.getBounds());
    layerControl.addOverlay(awsTirol, "Weterstationen Tirol");

    //windrichtung anzeigen
    const windlayer = L.featureGroup();
    const windPalette = [
        [3.60, "#05B603"], //<3
        [8.23, "#0ECE24"], //3-4
        [11.32, "#73D36F"], //4-5
        [14.40, "#FBD8D3"], //6
        [17.49, "#FFB4B3"], //7
        [21.09, "#FF9F9D"], //8
        [24.69, "#FF8281"], //9
        [28.81, "#FE5F61"], //10
        [32.96, "#FE4341"], //11
        [999, "#FF1F0E"], //>11
    ];

    L.geoJson(stations, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.WR) {
                let color = 'black';
                if (feature.properties.WG > 20) {
                    color = 'red';
                    for (let i = 0; i < windPalette.length; i++) {
                        console.log(windPalette[i], feature.properties.LT);
                        if (feature.properties.LT < windPalette[i][0]) {
                            color = windPalette[i][1];
                            break;
                        }
                        return L.marker(latlng, {
                            icon: L.divIcon({
                                html: `<i style= "color: ${color}; transform: rotate(${feature.properties.WG}deg)" class="fas fa-arrow-circle-up fa-3x"></i>`
                            })
                        });
                    }
                }
            }
        }
    }).addTo(windlayer);
    layerControl.addOverlay(windlayer, "Windrichtung");
    //windlayer.addTo(karte);

    //Temperatur anzeigen
    const temperaturlayer = L.featureGroup();
    const temperaturPalette = [
        [-20, "#6B655F"], //<-20
        [-10, "#732E75"], //-20 bis -10
        [0, "#3701DA"], //-10 bis 0
        [10, "#007800"], //0 bis 10
        [20, "#FCFE05"], //10 bis 20
        [30, "#F77700"], //20 bis 30
        [40, "#F20205"], //30 bis 40        
        [99, "730405"], //>40
    ];

    L.geoJson(stations, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.LT) {
                let color = 'red';
                for (let i = 0; i < temperaturPalette.length; i++) {
                    console.log(temperaturPalette[i], feature.properties.LT);
                    if (feature.properties.LT < temperaturPalette[i][0]) {
                        color = temperaturPalette[i][1];
                        break;
                    }
                }

                //let color = 'blue';
                //if (feature.properties.LT > 0) {
                //color = 'red';}

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

const feuchteLayer = L.featureGroup();
const feuchtePalette = [
    [30, "#F0EEF2"],
    [40, "#DBDEDB"],
    [50, "#C4C9C8"],
    [60, "#BCBDBE"],
    [70, "#ABA9D1"],
    [80, "#9D95DE"],
    [90, "#8B85EC"],
    [999, "#7677E4"],
];

L.geoJson(stations, {
    pointToLayer: function (feature, latlng) {
        if (feature.properties.RH) {
            let color = feuchtePalette[feuchtePalette.length - 1][1];
            for (let i = 0; i < feuchtePalette.length; i++) {
                if (feature.properties.RH < feuchtePalette[i][0]) {
                    color = feuchtePalette[i][1];
                    break;
                } else {}
            }
            return L.marker(latlng, {
                icon: L.divIcon({
                    html: `<div class="feuchteLabel" style="background-color:${color}">${feature.properties.RH}</div>`
                })
            });
        }
    }
}).addTo(feuchteLayer);
layerControl.addOverlay(feuchteLayer, "Relative Feuchte");


loadStations();