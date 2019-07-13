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
    var searchRes = document.getElementById('search-results'); 
    
    var catList = ['Malaysian Agricultural Suppliers', 'Malaysian Chemical Suppliers', 'Malaysian Electric Suppliers', 'Malaysian Rubber and Plastic Suppliers', 'Malaysian Textile and Leather Suppliers']

    var plotPoints = []; //list of geojson object for map plotting
    var pointsList = []; //list containing all data from database 

    for(var i = 0; i < catList.length; i++){
        var catPlotPoints = []; //category wise list of geojson object for map plotting
        var catPointList = []; //category wise list containing all data from database 
        var catRef = firebase.database().ref(catList[i]).child('Company'); 
        //console.log(catList[i]); 
        catRef.on('value', snapshot => {
            catPlotPoints.length = 0; 
            catPointList.length = 0; 
            snapshot.forEach(element => {
                cur = element.val()
                catPointList.push([cur.name, cur.info, cur.tel, cur.lon, cur.lat])
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
                catPlotPoints.push(newPoint)
            });
            plotPoints.push(catPlotPoints.slice())
            pointsList.push(catPointList.slice()) 
            //console.log(pointsList) 
        });
    };

    mapboxgl.accessToken = 'pk.eyJ1IjoibC15IiwiYSI6ImNqeHNjajVpejBpZjAzaHFveHQ2bGdocGYifQ.rqNTiie-ua4VjuyDYNH6JA'; // replace this with your access token
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [101.6129, 3.1568], //centre of singapore
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

    var catListMatch = catList.slice(); 
    var pointsListMatch = []; 
    function updateResult(query) {
        searchRes.innerHTML = ''; 
        pointsListMatch.length = 0; 
        if(query.length == 0) {catListMatch = catList.slice();};
        catListMatch.map(function(catName){
            query.toString().split(" ").map(function(word){
                console.log(catListMatch)
                //console.log(catName.toString().toLowerCase().indexOf(word[word.length-1].toLowerCase()))
                /*
                if(catListMatch.length == 0) {
                    catListMatch = catList.slice();
                };
                */
                if(word.length == 0 && catListMatch.length == 0) {
                    catListMatch = catList.slice(); 
                    return; 
                } 
                else if(word.length > 0 && word[word.length-1] != ' ' && catName.toString().toLowerCase().indexOf(word[word.length-1].toLowerCase()) == -1) {
                    //console.log('index') 
                    //console.log(catListMatch.indexOf(catName))
                    console.log(catName.toString().toLowerCase())
                    catListMatch.splice(catListMatch.indexOf(catName), 1); 
                    //console.log(catListMatch)
                    //console.log(catName)
                };
                catListMatch.map(function(catNameMatch) {
                    pointsList[catList.indexOf(catNameMatch)].map(function (algo){
                        pointsListMatch.push(algo)
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
                        //console.log(newCell)
                    });
                });
            });
        });
    };

    map.on('load', function() {
        map.addSource('trafficSource', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-traffic-v1'
        });

        addTraffic()

        searchBar.addEventListener('input', function(e) {
            //console.log(e.target.value)
            updateResult(e.target.value);
        });
        
    });

    var mkrList = [];
    var layerFlag = false; 

    var searchButton = document.getElementById('search-button')
    searchButton.addEventListener("click", function refreshMap() {
        var catListMatchMap = catListMatch.slice();
        var pointsListMatchMap = pointsListMatch.slice();  
        //console.log(catListMatchMap.length); 
        //console.log(pointsListMatchMap.length); 

        var plotPointsMatchMap = [];
        //console.log(plotPoints)
        for(var i = 0; i < catListMatchMap.length; i++){ 
            for(var j = 0; j < plotPoints[catList.indexOf(catListMatchMap[i])].length; j++) {
                var point = plotPoints[catList.indexOf(catListMatchMap[i])][j]; 
                plotPointsMatchMap.push(point); 
            };
        };
        //console.log(plotPointsMatchMap); 
        if (layerFlag) {
            map.removeLayer('points'); 
            map.removeSource('points'); 
        }; 

        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": plotPointsMatchMap
                }
            },
            "layout": {
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
            "properties": {
                'marker-color': '#3bb2d0',
                'marker-size': 'large',
                'marker-symbol': 'rocket'
            }
        });
        layerFlag = true; 

        for(var i = 0; i < mkrList.length; i++) {
            mkrList[i].remove()
        }; 
        mkrList.length = 0; 
        /*
        for(var i = 0; i < pointsListMatchMap.length; i++) {
            var cur_loc = pointsListMatchMap[i].slice();
            console.log(cur_loc)
            var mkr = new mapboxgl.Marker().setLngLat([cur_loc[3], cur_loc[4]])
            .addTo(map);
            mkrList.push(mkr)
        };
        */
       for(var i = 0; i < plotPointsMatchMap.length; i++) {
            var cur_loc = plotPointsMatchMap[i].geometry.coordinates; 
            //console.log(cur_loc);
            var mkr = new mapboxgl.Marker().setLngLat(cur_loc)
            .addTo(map);
            mkrList.push(mkr)
       }
        
            
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
        //console.log(feature.geometry.coordinates)
    });    


    
})