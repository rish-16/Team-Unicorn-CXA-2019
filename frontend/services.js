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

document.addEventListener('DOMContentLoaded', function() {
    const spreadsheetContent = document.getElementById('spreadsheet-cells')
    const CSVupload = document.getElementById('inv-upload');
    const fileBtn = document.getElementById('inv-file');

    const DBref = firebase.database().ref()

    const understocked = []

    const estimate = document.getElementById('estimate')
    const air = document.getElementById('air')
    const land = document.getElementById('land')
    const ship = document.getElementById('ship')
    const weightSelect = document.getElementById('weight-select')
    const locate = document.getElementById('locate-loc')
    const curLoc = document.getElementById('cur-loc')
    const finalEst = document.getElementById('final-est')

    var modeOfT = null
    var weight = null

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            curLoc.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    
    function showPosition(position) {
        curLoc.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude; 
    }

    locate.onclick = () => {
        getLocation()
    }

    weightSelect.onchange = (e) => {
        var el = e.target
        weight = el.selectedIndex.toInt()
    }

    air.onclick = () => {
        modeOfT = 'air'
    }
    land.onclick = () => {
        modeOfT = 'land'
    }
    ship.onclick = () => {
        modeOfT = 'ship'
    }


    function uploadInv() {
        spreadsheetContent.innerHTML = ''
        DBref.child('Inventory').on('value', (snapshot) => {
            snapshot.forEach(element => {
                var row = document.createElement('div')
                row.classList += 'ss-row'

                element.forEach(cell => {
                    var newCell = document.createElement('ss-cell')
                    var newCellTitle = document.createElement('p')
                    newCell.classList += 'cell'
                    newCellTitle.innerText = cell.val()
                    newCellTitle.classList += 'cell-title'
                    newCell.appendChild(newCellTitle)
                    row.appendChild(newCell)
                });

                if (element.val()[1] < element.val()[2]) {
                    var statusCell = document.createElement('div')
                    statusCell.classList += 'cell'
                    var status = document.createElement('div')
                    status.classList += 'cell-status'
                    status.style.backgroundColor = '#ff6b6b'
                    statusCell.appendChild(status)
                    row.appendChild(statusCell)
                    understocked.push(element.val()[0])
                    console.log(understocked)
                } else {
                    var statusCell = document.createElement('div')
                    statusCell.classList += 'cell'
                    var status = document.createElement('div')
                    status.classList += 'cell-status'
                    status.style.backgroundColor = '#1dd1a1'
                    statusCell.appendChild(status)
                    row.appendChild(statusCell)
                }

                spreadsheetContent.appendChild(row)
            });
        })
    }

    uploadInv()

    function handleFile() {
        const fileList = this.files;
        Papa.parse(fileList[0], {
            complete: function(res) {
                var data = res.data;
                data = data.splice(1);

                // Send to Firebase if new one is chosen
                DBref.child('Inventory').set({})
                DBref.child('Inventory').set(data)
                spreadsheetContent.innerHTML = ''
                DBref.child('Inventory').on('value', (snapshot) => {
                    snapshot.forEach(element => {
                        var row = document.createElement('div')
                        row.classList += 'ss-row'
                  
                        element.forEach(cell => {
                            var newCell = document.createElement('ss-cell')
                            var newCellTitle = document.createElement('p')
                            newCell.classList += 'cell'
                            newCellTitle.innerText = cell.val()
                            newCellTitle.classList += 'cell-title'
                            newCell.appendChild(newCellTitle)
                            row.appendChild(newCell)
                        });
        
                        if (element.val()[1] < element.val()[2]) {
                            var statusCell = document.createElement('div')
                            statusCell.classList += 'cell'
                            var status = document.createElement('div')
                            status.classList += 'cell-status'
                            status.style.backgroundColor = '#ff6b6b'
                            statusCell.appendChild(status)
                            row.appendChild(statusCell)

                            console.log("hii")
                            new Noty({
                               type: 'error',
                               layout: 'topRight',
                               theme: 'nest',
                               text: 'You are running low on ' + element.val()[0] + ". You can order it under the Resources tab.",
                               timeout: '6000',
                               progressBar: false,
                               closeWith: ['click'],
                               killer: true,
                            }).show();

                             } 
                            else {
                            var statusCell = document.createElement('div')
                            statusCell.classList += 'cell'
                            var status = document.createElement('div')
                            status.classList += 'cell-status'
                            status.style.backgroundColor = '#1dd1a1'
                            statusCell.appendChild(status)
                            row.appendChild(statusCell)
                        }
        
                        spreadsheetContent.appendChild(row)
                    });
                })
            }
        })
    }

    CSVupload.addEventListener('click', () => {
        fileBtn.click();
        fileBtn.addEventListener('change', handleFile, false);
    });

    estimate.onclick = () => {
        console.log('iucben')
        if (modeOfT == 'air') {
            var randomcost = (Math.random()*1000).toFixed(2)
            finalEst.innerHTML = randomcost
        } else if (modeOfT == 'land') {
            var randomcost = (Math.random()*100).toFixed(2)
            finalEst.innerHTML = randomcost
        } else if (modeOfT == 'ship') {
            var randomcost = (Math.random()*500).toFixed(2)
            finalEst.innerHTML = randomcost
        }
    }


    let log = document.getElementById('noti');
});