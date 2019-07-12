const firebaseConfig = {
    apiKey: "AIzaSyBY8H2AtuzMXVX7IevYyn0Wr8PdiYaIrGU",
    authDomain: "test-a1287.firebaseapp.com",
    databaseURL: "https://test-a1287.firebaseio.com",
    projectId: "test-a1287",
    storageBucket: "test-a1287.appspot.com",
    messagingSenderId: "494992214705",
    appId: "1:494992214705:web:ace9e12c8d31ca48"
};
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    
    var plotPoints = [];
    var electricPoints = [];
    var rubberAndPlastics = [];

    function getData(data) {
        var positions = data.val();
        var keys = Object.keys(positions); 
    
        for(var i = 0; i < keys.length; i++) {
            var k = keys[i]
            var newPoint = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(positions[k].lon), parseFloat(positions[k].lat)]
                },
                "properties": {
                    "title": positions[k].name,
                    "icon": "marker", 
                    "description": positions[k].info
                }
            }
            plotPoints.push(newPoint)
        }
    }

    var ref = firebase.database().ref('Malaysian Electric Suppliers').child('Company'); 
    ref.on('value', getData, errorData); 

    function errorData(err) {
        console.log("Error!") 
        console.log(err)
    }
    
    function refresh() {
        location.reload(forceGet=true)
    }
    
    mapboxgl.accessToken = 'pk.eyJ1IjoibC15IiwiYSI6ImNqeHNjajVpejBpZjAzaHFveHQ2bGdocGYifQ.rqNTiie-ua4VjuyDYNH6JA'; // replace this with your access token
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [101.6869, 3.1390], //centre of singapore
        zoom: 10
    }); 

    function addTraffic() {
        var firstPOILabel = map.getStyle().layers.filter(function(obj){ 
            return obj["source-layer"] == "poi_label";
        });

        for(var i = 0; i < trafficLayers.length; i++) {
            map.addLayer(trafficLayers[i], firstPOILabel[0].id);
        }
    }

    map.on('load', function () {
        map.addSource('trafficSource', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-traffic-v1'
        });

        addTraffic()
        console.log(plotPoints)

        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": plotPoints
                }
            },
            "layout": {
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Avenir Next"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });
    });

    function addPoint() {
        if (markerOn) {
            var pos = marker.getLngLat();
            var name = document.getElementById('name').value;
            var des = document.getElementById('description').value; 
            console.log(pos, name) 
            var point = {
                x : pos.lng, 
                y : pos.lat, 
                name : name, 
                description: des
            };
            ref.push(point); //push a new point on to the positions database
            markerOn = false;
            marker.remove();
            location.reload(forceGet=true)
        }
    }

    map.on('click', function(e){
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['points'] // replace this with the name of the layer
            });
        if (!features.length) {
            return;
        }
    
        var feature = features[0];
    
        var popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`<div style="background-color: white;border-radius:10px;text-align:center;overflow:hidden;"><p>${feature.properties.title}</p><br><p>${feature.properties.description}</p></div>`)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
        console.log(feature.geometry.coordinates)
    });    
})