# syntax=docker/dockerfile:1
FROM python:3.7-alpine
COPY ./scripts .
COPY ./data .
RUN pip3 install -r requirements.txt
RUN pip3 install Flask
CMD ["python3", "flask_main.py"]