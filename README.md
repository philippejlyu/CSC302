# Introduction

To find our **meeting notes**, please see the meeting notes folder<br />
To find our project development plan and tech stack description, please see **CSC302 A1.pdf**<br />
To find our data, please see the **data** folder<br />
To find our scripts, please see the **scripts** folder<br />

This application involves the **Python** language and the **datasette** and **sqlite-utils** packages. Please ensure you have **Python 3** and **Git** installed on your computer before proceeding.

## Structure

The application constitutes a **front end**, which is a React app, found in the `crime-database` folder, and a **back end**, which is simply a Python Flask application found in `scripts`.

To run the application correctly, the front end must be run first, before the back end.

# Uploading new datasets
Please ensure datasets that you upload are small in size. There is a **rate limit of 1 per second** for our geocoding api. Large datasets will take hours to process

Data prerequisites
community name is formatted as no spaces. Instead of spaces, have a capital letter denoting the space ending with the city type. For example, Los Angeles would be LosAngelescity 

community name needs to be a valid city that can be searchable by open street map
commuinty name needs to be a valid city with grographical boundaries regonzied by open street map

**Temporary restrictions**
City needs to be within the united states and have a state associated with it
Territories such as Puerto Rico, Guam etc will not work

# Cloning
Run the following command in your terminal to clone the repository.
```
git clone https://github.com/philippejlyu/CSC302.git
```

# Running on Docker
Navigate to the root directory of the cloned repository locally (folder named `CSC302`) and execute the following command in your terminal to run the application in a browser window. The pip packages will be installed by this shell file in addition to running the webserver.

Precondition: Docker must be installed on your computer. You may need to use sudo if you are running on Linux. The Docker image will be at least 2GB in total, and 1493 npm packages are utilized. There are six high security vulnerabilities.

```
docker build .
docker run -p 3000:3000 <image SHA>
```

An example run should look like (the SHA is `8bdd7b654d8f`)

```
$ sudo docker build .
Successfully built 8bdd7b654d8f
mulliganaceous@mulliganaceous2-x:$ sudo docker run -p 3000:3000 8bdd7b654d8f
 * Serving Flask app 'flask_main'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:3000
 * Running on http://172.17.0.2:3000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 102-204-238
```

The application can be found at `localhost:3000`

# Feature delivery
As per our Assignment 1 deliverable, we planned to have the following functionality completed by Assignemnt 3

1. Method to import data into the SQLite database
2. Have a react frontend
3. Create a backend that serves the frontend and its associated data
4. Support different types of visualizations
5. Allow users to import similarly formatted datasets

Goal 1-4 have been met according to the following acceptance criteria
1. Input the dataset from kaggle and be able to run SQL commands on it
2. Have a basic website that displays our dataset
3. Have a backend that serves valid data to the frontend
4. Have 2 or more kinds of visualizations. Map view, my datasets view, map popup view

Goal 5 partially met what we desired.
For goal 5, our goal was to allow the user to input a dataset with the same column names, but allow them to be missing a few non-important columns. As of now, this is not possible, however we do allow the user to input identically formatted datsets.

# Testing
## JS tests
When compiling the docker container, our js compilation test runs to ensure that our frontend can be successfully copiled

## Python tests
To run unit tests, cd to the scripts directory and run the following command
Follow instructions to build docker container
```
docker run -it <container sha> bash
py.test
```
## Code linting
A code linter runs to ensure that our code meets industry standards

## Automated testing
Automated testing is handled by github actions. Whenever a pull request is made, the aforementioned unit tests will run automatically.