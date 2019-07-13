var firebaseConfig = {
    apiKey: "AIzaSyBY8H2AtuzMXVX7IevYyn0Wr8PdiYaIrGU",
    authDomain: "test-a1287.firebaseapp.com",
    databaseURL: "https://test-a1287.firebaseio.com",
    projectId: "test-a1287",
    storageBucket: "test-a1287.appspot.com",
    messagingSenderId: "494992214705",
    appId: "1:494992214705:web:38a77d4c9514b154"
};

firebase.initializeApp(firebaseConfig);
console.log(firebase)

var airButton = document.getElementById("button1") 
var landButton = document.getElementById("button2") 
var shipButton = document.getElementById("button3") 
var submitButton = document.getElementById("submitButton") 

/*
mapboxgl.accessToken = 'pk.eyJ1IjoibC15IiwiYSI6ImNqeHNjajVpejBpZjAzaHFveHQ2bGdocGYifQ.rqNTiie-ua4VjuyDYNH6JA'; // replace this with your access token

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
});
geocoder.on('result', function(e) {
    return e.result.geometry 
});
map.addControl(geocoder);
console.log()
*/

var database = firebase.database(); 
var ref = database.ref('Transport'); 

airButton.onclick = function() {
    airButton.style.backgroundColor = 'grey';
    ref = ref.child('Air Companies'); 
    ref.on('value', getData, errorData); 
    //console.log(getDis('Singapore', 'Malaysia')); 
}

landButton.onclick = function() {
    landButton.style.backgroundColor = 'grey';
    ref = ref.child('Land Companies'); 
    ref.on('value', getData, errorData); 
    //console.log(getDis('Singapore', 'Malaysia')); 
}

shipButton.onclick = function() {
    shipButton.style.backgroundColor = 'grey';
    ref = ref.child('Shipping Companies'); 
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

submitButton.addEventListener("click", function() {
    for( var i = 0; i < fares.length; i++) {
        var para = document.createElement('P');
        var dis = 516.2; 
        var weight = document.getElementById('weight').value;
        //console.log(fares[i].rate*dis*weight);
        para.innerText = '$'+(fares[i].rate*dis*weight).toFixed(2)+' ~ $'+(fares[i].rate*dis*weight*1.1).toFixed(2); 
        document.body.appendChild(para); 
    }
    
});
