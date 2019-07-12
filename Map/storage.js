//var xCoord;
//var yCoord; 

var firebaseConfig = {
    apiKey: "AIzaSyBqzYAoXOcFoJ9Ihgx7ufrjHHr85umFmq4",
    authDomain: "mapbox-cxa.firebaseapp.com",
    databaseURL: "https://mapbox-cxa.firebaseio.com",
    projectId: "mapbox-cxa",
    storageBucket: "mapbox-cxa.appspot.com", 
    messagingSenderId: "744392302337",
    appId: "1:744392302337:web:fbbda17b7d71f325"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase)

var database = firebase.database(); 
var ref = database.ref('rawMaterial'); 
ref.on('value', getData, errorData); 
var storage = firebase.storage();
 
var plotPoints = [];
function getData(data) {
    //console.log(data.val())
    var positions = data.val();
    var keys = Object.keys(positions); 
    
    /*
    // Create a reference to the file we want to download
    var markerImgRef = storage.ref().child('marker-editor.svg');
    // Get the download URL
    markerImgRef.getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'
        map.loadImage(url, function(error, image) {
            if (error) throw error;
            map.addImage('icon-marker', image);
        });
    });
    */
    
    for(var i = 0; i < keys.length; i++) {
        var k = keys[i]
        var newPoint = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [positions[k].x, positions[k].y]
            },
            "properties": {
                "title": positions[k].name,
                "icon": "marker"
            }
        }
        plotPoints.push(newPoint)
    }
}

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
    center: [103.808053, 1.351616], //centre of singapore
    zoom: 10
}); 

map.on('load', function () {
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
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });
});

var coordinates = document.getElementById('coordinates');

var markerOn = false; 
var marker = undefined;
function addDragMarker() {
    markerOn = true; 
    marker = new mapboxgl.Marker({
        draggable: true
    })
    .setLngLat([103.808053, 1.351616])
    .addTo(map);
        
    function onDragEnd() {
        var lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
    }
    
    marker.on('dragend', onDragEnd);
}

function addPoint() { 
    if (markerOn) {
        var pos = marker.getLngLat();
        var name = document.getElementById('name').value;
        console.log(pos, name) 
        var point = {
            x : pos.lng, 
            y : pos.lat, 
            name : name
        };
        ref.push(point); //push a new point on to the positions database
        markerOn = false;
        marker.remove();
        location.reload(forceGet=true)
    }
}

/*
#to displace the details of the place when click on the marker (not done yet)
map.on('click', function(e){
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['features-parks'] // replace this with the name of the layer
        });
});
*/

