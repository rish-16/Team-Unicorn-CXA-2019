var http = require('http');
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    }).listen(1337, "127.0.0.1");
    console.log('Server running at http://127.0.0.1:1337/');
    
var firebaseConfig = {
    apiKey: "AIzaSyBY8H2AtuzMXVX7IevYyn0Wr8PdiYaIrGU",
    authDomain: "test-a1287.firebaseapp.com",
    databaseURL: "https://test-a1287.firebaseio.com",
    projectId: "test-a1287",
    storageBucket: "test-a1287.appspot.com",
    messagingSenderId: "494992214705",
    appId: "1:494992214705:web:38a77d4c9514b154"
};

const mbxClient = require('@mapbox/mapbox-sdk/');
const geocodingClient = mbxClient({ accessToken: 'pk.eyJ1IjoibC15IiwiYSI6ImNqeHNjajVpejBpZjAzaHFveHQ2bGdocGYifQ.rqNTiie-ua4VjuyDYNH6JA' });
mapboxgl.accessToken = 'pk.eyJ1IjoibC15IiwiYSI6ImNqeHNjajVpejBpZjAzaHFveHQ2bGdocGYifQ.rqNTiie-ua4VjuyDYNH6JA'; // replace this with your access token

firebase.initializeApp(firebaseConfig);
console.log(firebase)

var airButton = document.createElement("button") 
airButton.innerHTML = "Air" 
document.body.appendChild(airButton)

var landButton = document.createElement("button") 
landButton.innerHTML = "Land" 
document.body.appendChild(landButton)

var shipButton = document.createElement("button") 
shipButton.innerHTML = "Shipping" 
document.body.appendChild(shipButton)


var submitButton = document.createElement("button") 
submitButton.innerHTML = "Submit" 
document.body.appendChild(submitButton) 

var loc = geocodingClient.forwardGeocode({
    query: 'Paris, France',
    limit: 2
  })
    .send()
    .then(response => {
      const match = response.body;
    });
console.log(loc)

/*
var geocoder = new google.maps.Geocoder();
var address;

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function getDis(address1, address2) {
    var lat1, lng1, lat2, lng2; 
    geocoder.geocode( { 'address': address1}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat1 = results[0].geometry.location.lat();
            lng1 = results[0].geometry.location.lng();
            } 
        }); 

    geocoder.geocode( { 'address': address2}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat2 = results[0].geometry.location.lat();
            lng2 = results[0].geometry.location.lng();
            } 
        }); 
    return distance(lat1, lng1, lat2, lng2, 'K')
}
*/

//console.log(weight); 

var database = firebase.database(); 
var ref = database.ref('Transport'); 

airButton.onclick = function() {
    airButton.style.backgroundColor = 'grey';
    ref = ref.child('Air Companies'); 
    ref.on('value', getData, errorData); 
    //console.log(getDis('Singapore', 'Malaysia')); 
}

var fares = []; 
function getData(data) {
    //console.log(data.val())
    var companies = data.val();
    var keys = Object.keys(companies); 
    
    for(var i = 0; i < keys.length; i++) {
        var k = keys[i]
        var newCom = {
            name: companies[k].name, 
            rate: companies[k].rate 
        }
        fares.push(newCom) 
    }
}

function errorData(err) {
    console.log("Error!") 
    console.log(err)
}

submitButton.onclick = function() {
    for( var i = 0; i < fares.length; i++) {
        var para = document.createElement('P');
        var dis = 516.2; 
        var weight = document.getElementById('weight').value;
        //console.log(fares[i].rate*dis*weight);
        para.innerText = '$'+(fares[i].rate*dis*weight).toFixed(2)+' ~ $'+(fares[i].rate*dis*weight*1.1).toFixed(2); 
        document.body.appendChild(para); 
    }


    /*
    var origin = getLngLat(document.getElementById("location")); 
    var destination = getLngLat(document.getElementById("destination")); 
    console.log(origin); 
    console.log(destination); 

    var origin = 'Greenwich, England';
    var destination = 'Stockholm, Sweden';

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
        origins: origin,
        destinations: destination,
        travelMode: 'DRIVING',
        transitOptions: TransitOptions,
        drivingOptions: DrivingOptions,
        unitSystem: UnitSystem,
        avoidHighways: Boolean,
        avoidTolls: Boolean,
        }, callback);

    function callback(response, status) {
        // See Parsing the Results for
        // the basics of a callback function.
    }
    */
    
};
