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

    const searchBar = document.getElementById('searchbar');
    const searchRes = document.getElementById('search-results');
    
    var plotPoints = [];
    var electricPoints = [];
    var rubberAndPlastics = [];
    var textiles = []
    var chemical = []
    var agriculture = []

    var elecRef = firebase.database().ref('Malaysian Electric Suppliers').child('Company'); 
    elecRef.on('value', snapshot => {
        snapshot.forEach(element => {
            cur = element.val()
            console.log(cur)
            electricPoints.push([cur.name, cur.info, cur.tel])
            //console.log(electricPoints)
            var newPoint = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [cur.lon, cur.lat]
                },
                "properties": {
                    "title": cur.name,
                    "icon": "marker", 
                    "description": cur.info
                }
            }
            plotPoints.push(newPoint)
        });
    })

    mapboxgl.accessToken = 'pk.eyJ1IjoibC15IiwiYSI6ImNqeHNjajVpejBpZjAzaHFveHQ2bGdocGYifQ.rqNTiie-ua4VjuyDYNH6JA'; // replace this with your access token
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [101.6129, 3.1568], //centre of singapore
        zoom: 12
    }); 

    function addTraffic() {
        var firstPOILabel = map.getStyle().layers.filter(function(obj){ 
            return obj["source-layer"] == "poi_label";
        });

        for(var i = 0; i < trafficLayers.length; i++) {
            map.addLayer(trafficLayers[i], firstPOILabel[0].id);
        }
    }

    function updateResult(query) {
        electricPoints.map(function(algo){
            query.toString().split(" ").map(function(word){
                if (algo.toString().toLowerCase().indexOf(word[1].toLowerCase()) != -1){
                    console.log('yes')
                    var newCell = document.createElement('div')
                    newCell.classList  = 'res-cell'
                    var newCellP = document.createElement('p')
                    newCellP.classList = 'res-cell-text'
                    var newCellD = document.createElement('p')
                    newCellD.classList = 'res-cell-desc'
                    var newCellN = document.createElement('p')
                    newCellN.classList = 'res-cell-num'
                    
                    var cur = Object(algo);
                    newCellP.innerHTML = cur[0]
                    newCellD.innerHTML = cur[1]
                    newCellN.innerHTML = '<a href="tel:' + cur[2] + '">'  + cur[2] + '</a>'
                    
                    newCell.appendChild(newCellP)
                    newCell.appendChild(newCellD)
                    newCell.appendChild(newCellN)
                    searchRes.appendChild(newCell)
                }
            })
        })
    }

    map.on('load', function() {
        map.addSource('trafficSource', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-traffic-v1'
        });

        // addTraffic()

        searchBar.addEventListener('input', function(e) {
            console.log(e.target.value)
            updateResult(e.target.value);
        });

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
            },
            properties: {
                'marker-color': '#3bb2d0',
                'marker-size': 'large',
                'marker-symbol': 'rocket'
            }
        });
        /*
        for (var i = 0; i < electricPoints.length; i++) {
            var cur_loc = electricPoints[i]
            var mkr = new mapboxgl.Marker().setLngLat([cur_loc["geometry"]["coordinates"]])
            .addTo(map);
        }
        */
    });

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
        .setHTML(`<div style="background-color: white;border-radius:10px;text-align:center;overflow:hidden;"><p style="color:black;">${feature.properties.title}</p><br><p style="color:black">${feature.properties.description}</p></div>`)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
        console.log(feature.geometry.coordinates)
    });    
})