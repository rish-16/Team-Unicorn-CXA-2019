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

    const DBref = firebase.database().ref()

    const sentGrid = document.getElementById('sent-grid')
    sentGrid.style.display = 'none';
    function viewWall() {
        sentGrid.style.display = 'flex'
        DBref.child('tweets').on('value', (snapshot) => {
            snapshot.forEach(child => {
                var cur = child.val()
                var newCell = document.createElement('div')
                newCell.classList += 'grid-cell'
                var newCellP = document.createElement('p')
                newCellP.classList += 'grid-cell-content'
                
                var colours = ['#feca57', '#ff6b6b', '#00b894', '#54a0ff', '#feca57', '#ff6b6b', '#00b894', '#54a0ff', '#feca57', '#ff6b6b', '#00b894', '#54a0ff']
                newCell.style.backgroundColor = colours[Math.floor(Math.random()*colours.length)];

                newCell.appendChild(newCellP)
                sentGrid.appendChild(newCell)
    
                var typewriter = new Typewriter(newCellP, {
                    loop: true
                });
    
                var randomPause = Math.floor((Math.random() * 2000) + 500);
                
                typewriter.pauseFor(randomPause)
                    .typeString(cur['content'])
                    .pauseFor(randomPause)
                    .deleteAll()
                    .pauseFor(randomPause)
                    .start();
            })
        })   
    }
    viewWall();

    // var tweets = []
    // for (var i = 0; i < 16; i++) {
    //     tweets.push('hello. this is a tweet ' + i)
    // }
    // for (var i = 0; i < tweets.length - 1; i++) {
    //     var cur = tweets[i]
    //     var newCell = document.createElement('div')
    //     newCell.classList += 'grid-cell'
    //     var newCellP = document.createElement('p')
    //     newCellP.classList += 'grid-cell-content'

    //     sentGrid.appendChild(newCell)

    //     newCell.appendChild(newCellP)

    //     var typewriter = new Typewriter(newCellP, {
    //         loop: true
    //     });

    //     var randomPause = Math.floor((Math.random() * 2000) + 500);
        
    //     typewriter.pauseFor(randomPause)
    //         .typeString(cur)
    //         .pauseFor(randomPause)
    //         .deleteAll()
    //         .pauseFor(randomPause)
    //         .start();
    // }
});