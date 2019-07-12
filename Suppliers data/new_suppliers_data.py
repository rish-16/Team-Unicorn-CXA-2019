import urllib.request
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="cxa")
suppliers = []
file_op = "suppliers" + ".txt"
file_op = open(file_op,"w")


for number in range(1,7):
    print(number)
    
    try:
        url = "http://www.thegreenbook.com/products/plastic-raw-materials/page/" + str(number) + "/"
        page = urllib.request.urlopen(url)

    except:
        continue

    soup = BeautifulSoup(page)

  

    

    for i in soup.findAll("div", {"class": "companyInformation"}):
        #i = i.get_text()
        #i = i.strip()
        #i = i.split()
        for x in i.findAll("h3"):
            for y in x.findAll("a",{"class":"H4Ver2"}):
                name = y.get_text()

        for x in i.findAll("p",{"class":"address"}):
            add = x.get_text()

        name = name.strip()
        add = add.strip()
        lat = None
        lon = None
        add = add.split(" ")

        while True:
            if len(add) == 0:
                break
            temp = " "
            temp = temp.join(add)
            temp += " Singapore"
            
            try:
                location = geolocator.geocode(temp)
                lat = str(location.latitude)
                lon = str(location.longitude)
                break
            except:
                add = add[:-1]

        if lat != None and lon != None:
            suppliers.append([name,lat,lon])
            
            
        
for i in suppliers:
    temp = ","
    temp = temp.join(i) + "\n"
    file_op.write(temp)

file_op.close()
    
        
    

    
    
 
    



    

