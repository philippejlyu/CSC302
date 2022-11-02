# Introduction

To find our **meeting notes**, please see the meeting notes folder<br />
To find our project development plan and tech stack description, please see **CSC302 A1.pdf**<br />
To find our data, please see the **data** folder<br />
To find our scripts, please see the **scripts** folder<br />

This application involves the **Python** language and the **datasette** and **sqlite-utils** packages. Please ensure you have **Python 3** and **Git** installed on your computer before proceeding.

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

The application can be found at `localhost:3000`

# Testing
To test the toy application, run the following command in your terminal from the root directory of the cloned repository:
```
python3 scripts/test.py
```
