// Create a map object
var myMap = L.map("map", {
    center: [40.71, -74.01],
    zoom: 5
});
  
// Add a tile layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

//defining colors for the scale used later
var scale_color = ["#00ff00","#b3ffb3","#ccff66","#ffcc66","#ff661a","#ff1a1a"];

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
    function getColor(depth){
        if(depth < 10){
            return scale_color[0];
        }else if(depth < 30){
            return scale_color[1];
        }else if(depth < 50){
            return scale_color[2];
        }else if(depth < 70){
            return scale_color[3];
        }else if(depth < 90){
            return scale_color[4];
        }else{
            return scale_color[5];
        }
    }
    function getRadius(magnitude){
        if (magnitude === 0){
            return 1;
        }
        return magnitude*3;
    }
    function styleMarker(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.7
        };
    }

    //GeoJson Layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        style: styleMarker,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

    //legend
    var legend = L.control({
        position: "bottomright" 
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["< 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"];
        var labels = [];
    
        // Add min & max
        var legendInfo = "<h1>Depth (km)</h1>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + scale_color[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        console.log(div);
        return div;
      };

    //add legend to map
    legend.addTo(myMap);
});






