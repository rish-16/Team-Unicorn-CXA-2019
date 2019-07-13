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

    const DBref = firebase.database().ref()

    function uploadInv(x) {
        try
        {

            var element = document.getElementById("services-db");
            element.parentNode.removeChild(element);
        }

        catch(error)
        {

        }
        

        var adiv = document.createElement('div')
        adiv.id = "services-db"
        document.getElementById("services").appendChild(adiv);
        DBref.child(x).child('Company').on('value', (snapshot) => {
           
            snapshot.forEach(element => {
                var row = document.createElement('div')
                row.className = "serv-card"
                var line = document.createElement('P') 
                line.innerText = element.val().name
                line.className = "serv-card-desc-bank"
                row.appendChild(line) 

                var line2 = document.createElement('P') 
                line2.innerText = element.val().info
                line2.className = "serv-card-desc"
                row.appendChild(line2) 

                var line3 = document.createElement('a') 
                line3.innerText = "Contact us at: " + element.val().tel
                line3.className = "serv-card-desc"
                row.appendChild(line3)

                /*
                var line3 = document.createElement('a') 
                line3.innerText = "Contact us"
                var temp = "tel: " + element.val().tel
                line3.className = "callbutton"
                var tel = line3.getAttribute("href")
                tel = temp
                row.appendChild(line3) 
                */


                var targetRow = document.getElementById("services-db") 
                targetRow.appendChild(row) 
               

            });
        })
    }


let button1 = document.getElementsByClassName("button1");
let button2 = document.getElementsByClassName("button2");

  button1[0].addEventListener("click", () => {
        console.log("Button1")
        button2[0].id = ""
        button1[0].id = "active"
        var x = "Malaysian Packing Suppliers Price"
        uploadInv(x)
        console.log(button1[0].className)
        console.log(button2[0].className)
        console.log(button1[0].id)
        console.log(button2[0].id)
  });

  
  button2[0].addEventListener("click", () => {
        console.log("Button2")
        button1[0].id = ""
        button2[0].id = "active"
        var y = "Malaysian Packing Suppliers Quality"
        uploadInv(y)
        console.log(button1[0].id)
        console.log(button2[0].id)
  });


    function onload(){
        var element = document.getElementById("services-db");
          if (!element.childNodes[0].hasChildNodes()) {

            button1[0].click();
        }

    }
    
    onload()  

  
 

  

   
});