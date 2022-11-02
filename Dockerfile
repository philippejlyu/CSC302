# syntax=docker/dockerfile:1
FROM python:3.9-bullseye
WORKDIR /usr/app
COPY ./scripts .
COPY ./data .
COPY crime_database .
RUN pip3 install -r ./requirements.txt
RUN pip3 install Flask
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN npm install
RUN npm run build
CMD ["python3", "flask_main.py"]