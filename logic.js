// Creating map object
var myMap = L.map("mapid", {
    center: [36.7128, -100.0059],
    zoom: 5
  });

var apiKey = "pk.eyJ1IjoiZXJpbnBpc3RlcnMiLCJhIjoiY2p2OW14aTNoMGVsNzRmbm14MzFpZGh1eiJ9.aU9-n2kNitmkxSsxlrXozQ";  

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: apiKey
}).addTo(myMap);
 

//Connect to the data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

//loop through data and assign colors to mag ranges
  function mColor(mag){
    mag = +mag;
    var color = "white";
    if (mag>5){
      color = "red";
    }
    else if (mag >=4){
      color = "orangeRed";
    }
    else if (mag >= 3){
      color ="orange";
    }
    else if (mag >=2){
      color="yellow";
    }
    else{
      color="green";
    }
    return color;

  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },   
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  //place legend on map
  var legend = L.control({
    position: "topright"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "green",
      "yellowgreen",
      "yellow",
      "orange",
      "orangeRed",
      "red"
    ];

//labels for the legend 
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  legend.addTo(myMap);
});
