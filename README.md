# Introduction

To find our meeting notes, please see the meeting notes folder
To find our project development plan and tech stack description, please see **CSC302 A1.pdf**

# Building
This application involves **Python** and the **datasette** package. We have considered **Docker** but for the initial milestone we have put that on hold.

## Python3 and Datasette
```
pip3 install datasette sqlite-utils
python3 main.py
```

## Running
After running the Python pip script and adding the requisite Docker files, perform.

```
./run.sh
```

## Docker script
```
ADD . /scripts
WORKDIR scripts
EXPOSE 80 8000
CMD ['python', 'manage.py', 'runserver', '0.0.0.0:80']
```
