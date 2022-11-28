# Introduction

To find our **meeting notes**, please see the meeting notes folder<br />
To find our project development plan and tech stack description, please see **CSC302 A1.pdf**<br />
To find our data, please see the **data** folder<br />
To find our scripts, please see the **scripts** folder<br />

This application involves the **Python** language and the **datasette** and **sqlite-utils** packages. Please ensure you have **Python 3** and **Git** installed on your computer before proceeding.

# Uploading new datasets
Please ensure datasets that you upload are small in size. There is a **rate limit of 1 per second** for our geocoding api. Large datasets will take hours to process

# Cloning
Run the following command in your terminal to clone the repository.
```
git clone https://github.com/philippejlyu/CSC302.git
```

# Running
Navigate to the root directory of the cloned repository locally (folder named `CSC302`) and execute the following command in your terminal to run the application in a browser window. The pip packages will be installed by this shell file in addition to running the webserver.

Precondition: Docker must be installed on your computer. You may need to use sudo if you are running on Linux. The Docker image will be at least 2GB in total, and 1493 npm packages are utilized. There are six high security vulnerabilities.

```
docker build .
docker run -p 3000:3000 <image SHA>
```

An example run should look like (the SHA is `8bdd7b654d8f`)

```
$ sudo docker build .
Sending build context to Docker daemon  11.77MB
Step 1/13 : FROM python:3.9-bullseye
 ---> ab0d2f900193
Step 2/13 : WORKDIR /usr/app
 ---> Using cache
 ---> f86c6a54d27c
Step 3/13 : COPY ./scripts .
 ---> Using cache
 ---> 1b1a75fa411e
Step 4/13 : COPY ./data .
 ---> Using cache
 ---> 14e72e75101a
Step 5/13 : COPY crime_database .
 ---> Using cache
 ---> 564a254e5f38
Step 6/13 : RUN pip3 install -r ./requirements.txt
 ---> Using cache
 ---> 098e33029e27
Step 7/13 : RUN pip3 install Flask
 ---> Using cache
 ---> 9c5ec7c02a8b
Step 8/13 : RUN apt-get update
 ---> Using cache
 ---> 2302869ddcce
Step 9/13 : RUN apt-get install -y nodejs
 ---> Using cache
 ---> 150fe26b51d8
Step 10/13 : RUN apt-get install -y npm
 ---> Using cache
 ---> fafe79057a86
Step 11/13 : RUN npm install
 ---> Using cache
 ---> f64b17f38b11
Step 12/13 : RUN npm run build
 ---> Using cache
 ---> 660565b561fd
Step 13/13 : CMD ["python3", "flask_main.py"]
 ---> Using cache
 ---> 8bdd7b654d8f
Successfully built 8bdd7b654d8f
mulliganaceous@mulliganaceous2-x:~/Heathencastle/4F/CSC302/Project$ ^C
mulliganaceous@mulliganaceous2-x:~/Heathencastle/4F/CSC302/Project$ sudo docker run -p 3000:3000
"docker run" requires at least 1 argument.
See 'docker run --help'.

Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Run a command in a new container
$ 8bdd7b654d8f
8bdd7b654d8f: command not found
mulliganaceous@mulliganaceous2-x:~/Heathencastle/4F/CSC302/Project$ sudo docker run -p 3000:3000 8bdd7b654d8f
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

# Testing
To test the toy application, run the following command in your terminal from the root directory of the cloned repository:
```
python3 scripts/test.py
```
