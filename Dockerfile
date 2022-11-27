# syntax=docker/dockerfile:1
FROM python:3.9-bullseye
WORKDIR /usr/app
RUN pip3 install Flask
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get update
RUN apt-get install -y nodejs
RUN pip install Flask-Cors
COPY ./scripts .
COPY ./data .
COPY crime_database .
RUN npm install
RUN npm run build
RUN pip3 install -r ./requirements.txt
CMD ["python3", "flask_main.py"]