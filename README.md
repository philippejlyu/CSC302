# Introduction

To find our meeting notes, please see the meeting notes folder
To find our project development plan and tech stack description, please see CSC302 A1.pdf

# Building
This application involves **datasette** and **Docker**.

## Python3 and Datasette
```
pip3 install datasette sqlite-utils
python3 main.py
```

## Docker script
```
ADD . /scripts
[22:34]F-16Falcon: WORKDIR scripts
[22:34]F-16Falcon: EXPOSE 80 8000
[22:35]F-16Falcon: CMD ['python', 'manage.py', 'runserver', '0.0.0.0:80']
```

## Running
After running the Python pip script and adding the requisite Docker files, perform

```
./run.sh
```
