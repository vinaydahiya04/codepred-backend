# CodePred
CodePred is a Codeforces problems recommendation engine that recommends you Codeforces problems to solve considering your current rating and problems succesfully submitted till date on Codeforces.
CodePred suggests you the kind of problems which will be helpful in improving your Codeforces rating.

# Site Url
The website is hosted at https://code-pred.netlify.app/
You are required to signup using your email id and Codeforces handle to access the recommendation system.
Incase you are too lazy to make an account and just want to check out the features you can login using the following credentials:
Email: 
Password: 

# Frontend Code
The frontend code for CodePred is available at  https://github.com/vinaydahiya04/CodePred_Frontend

# Aim/Inspiration
The idea behind this recommendation system was to save the enormous amounts of time coders spend on finding the right problems to solve on codeforces.

# Explaination
## Intuition
Coders have different likes/dislikes or strengths/weaknesses in competitive programming and we cant specify which topics/areas of competitve programming are necessary as well as sufficient to excel in this field.
## Theory
My idea was to find n similar coders all rated one level above the user in codeforces (for eg if the user is a specialist then i try to find n similar expert ranked coders) and find a similarity score using user - user collaborative filtering and then use this similarity score to calculate the ratings of problems of various categories that the user should solve.
Coders one level higher than the User were considered so that the User can improve while at the same time not find the problems suggested too difficult.

## Feature Vector
The feature vector was a 9*1 vector with the following Codeforces problem categories as features:

1. dp
2. binary search
3. graphs
4. greedy
5. math
6. trees
7. strings
8. brute force
9. two pointers

### Each value in the feature vector represents the average rating of problems succesfully submitted on Codeforces by the user for that corresponding tag
#### For example:
![Picture 1](/assets/img1.png "Feature Vector")

PS. I do plan to add more features later on
## Observation
A key observation to make over here is that normal user-user collaborative filtering using cosine similarity will give wrong results because the theta is not the accurate representation of similarity between two coders. The following examples explain the observation

![Picture 2](/assets/img2.png "Observation")
![Picture 3](/assets/img3.png "cosine Similarity Formula")

#### If we use normal cosine similarity then it will suggest that vector v1 is more similar to vector v3 than vector v2 and hence the user 1 should solve problems rated similar to those solved by user 3 which here is wrong as even though the theta is 0 or the similarity is 1 but it will be very difficult for user 1 to solve such high rated problems directly considering his own level whereas even though the similarity between user 2 and user 1 is less than between user 1 and user 3 still it will be easier and beneficial for user 1 to solve problems rated similar to those solved by user 2.

## Workaround

To overcome the above discussed problem I try to penalise the two vectors heavily while calculating similarity if there is a large difference between their amplitudes so as to avoid the above problem.
Hence the formula for calculating similarity was slightly varied :

![Picture 4](/assets/formula.png "Changed Formula")

This heavily penalizes the similarity score of two vectors for having high differences in amplitudes.

## Suggesting Problems to the User
After getting the rating values of which the user should solve problems for the particular tags I used a pre saved JSON data of problems corresponding to various tags and ratings and then sent those problems to the frontend for displaying to the user.

# Tech Stack
The following libraries/ frameworks were used for the frontend developement of this website:
* NodeJS
* ExpressJS
* MongoDB

# Features and their implementation
### The following packages were used for the given features
* Authentication : bcryptjs, jsonwebtoken,
* Sending Emails for reset password: nodemailer and mailgen
* User Profile Graphs: React Chartjs2
* Background: Particlejs


# Future work

* Increase the number of features in the feature vector
* Add multiple tags in feature vector as well for eg. "graphs-dp"
* Improve the frontend 
* Extend the algorithm to users ranked above master as well

# Hosted Backend Link:
"https://codepred.herokuapp.com/"

# To check the ratings of various tags that a user should solve:
"https://codepred.herokuapp.com/api/prediction/data?handle=" + {Your CodeForces Handle}