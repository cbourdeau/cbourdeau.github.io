var file = "processed_data/co2_map.csv"
var years = [1960, 1970, 1980, 1990, 2000, 2010, 2017]

// Create first tile layer
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var outdoorsemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

var baseMaps = {
    Satellite: satelitemap,
    Street: streetmap,
    Outdoors: outdoorsemap
  };

// Create Map Object
var map = L.map("map", {
    center: [0, 0],
    zoom: 2
});

// Add our tilelayers to the map 
streetmap.addTo(map);
outdoorsemap.addTo(map);
satelitemap.addTo(map);

L.control.layers(baseMaps, null).addTo(map);

// Create a legend to display information about our map
var legend = L.control({
    position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML =
      "<p class='legend brown'> CO2 > 600 </p> <p class='legend orange'> CO2 > 400 </p> <p class='legend yellow'> CO2 > 200 </p> <p class='legend green'> CO2 < 200 </p>";
    return div;
};
// Add the info legend to the map
legend.addTo(map);

d3.csv(file, function (co2Data){
    var filtered = co2Data.filter(d => d.year == `1/1/2010`);
    console.log(filtered)
    filtered.forEach(function (d) {
        circleMarkers = [];
        var name = d.country
        var lat = d.lat; 
        var lng = d.lng;
        var value = +d.co2;
        var pop = +d.pop;
        if (value > 600){
            var color= "brown";
        } else if (value >400) {
            var color= "orange"
        } else if (value > 100){
            var color = "yellow"
        } else {
            var color= "green"
        }
        // Change the values of these options to change the symbol's appearance
        let options = {
          radius: pop/10000000,
          color: color,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.3,
        }
        L.circleMarker([lat,lng], options).bindPopup(`<h1> ${name} </h1> <hr> <h3> CO2 Emissions: ${value} </h3> <h3> Population: ${pop}</h3>`).addTo(map);
    })
});