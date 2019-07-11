from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


file = open("reviews_data.csv","r").readlines()

flag = True
count = 0
review = []
flag_save = False
flag_review = False
reviews = []
for i in file:
    if flag:
        flag = False
        continue
    i = i.strip("\n")
    i = i.split(",")

    for j in i:
        if "2019" in j:
            flag_review = True
        elif "Next pageâ†" in j:
            count += 1
            flag_review = False
            flag_save = True
            break
        elif flag_review:
            review.append(j)
    if flag_save:
        temp = ""
        for sent in review[:-1]:
            temp += sent
        reviews.append(temp)
        review = []
        flag_save = False


analyser = SentimentIntensityAnalyzer()

def label(score):
    if score >= 0.05:
        return 1
    elif score <= -0.05:
        return -1
    else:
        return 0

scores = []

for i in reviews:
    score = analyser.polarity_scores(i)
    scores.append(label(score['compound']))

import pyrebase

config = {
    "apiKey": "AIzaSyBY8H2AtuzMXVX7IevYyn0Wr8PdiYaIrGU",
    "authDomain": "test-a1287.firebaseapp.com",
    "databaseURL": "https://test-a1287.firebaseio.com",
    "projectId": "test-a1287",
    "storageBucket": "test-a1287.appspot.com",
    "messagingSenderId": "494992214705",
    "appId": "1:494992214705:web:ace9e12c8d31ca48"
  }

firebase = pyrebase.initialize_app(config)

db = firebase.database()

for i in range(len(reviews)):
    db.child("amazon-reviews").child("review").push({"content":reviews[i],
                                                     "score":scores[i]})
    
