import os
from time import sleep
import webbrowser
from threading import Thread

def launch_datasette():
    if not os.path.isfile('crime.db'):
        os.system("sqlite-utils insert crime.db locations ../data/clean.csv --csv -d")
    os.system("datasette crime.db")
def launch_browser():
    sleep(3)
    webbrowser.open("http://127.0.0.1:80/crime/locations")

Thread(target=launch_datasette).start()
Thread(target=launch_browser).start()


