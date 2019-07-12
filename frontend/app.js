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
    console.log('App loaded')
    const CSVupload = document.getElementById('inv-upload');
    const fileBtn = document.getElementById('inv-file');

    const spreadsheetContent = document.getElementById('spreadsheet-cells')
    const DBref = firebase.database().ref().child('Inventory')

    const understocked = []

    function uploadInv() {
        spreadsheetContent.innerHTML = ''
        DBref.on('value', (snapshot) => {
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
                DBref.set({})
                DBref.set(data)
                spreadsheetContent.innerHTML = ''
                DBref.on('value', (snapshot) => {
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
        })
    }

    CSVupload.addEventListener('click', () => {
        fileBtn.click();
        fileBtn.addEventListener('change', handleFile, false);
    });
});