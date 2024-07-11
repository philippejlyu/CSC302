import pytest
import sqlite3
# from flask_main import *


def test_sql_query():
    con = sqlite3.connect("./db/crime.db")
    cur = con.cursor()
    res = cur.execute("SELECT count(*) FROM locations WHERE isState = 1")

    assert res.fetchone()[0] == 48

def test_sql_query2():
    con = sqlite3.connect("./db/crime.db")
    cur = con.cursor()
    res = cur.execute("SELECT count(*) FROM locations WHERE state = 'CA'")
    assert res.fetchone()[0] == 279

def test_sql_query3():
    con = sqlite3.connect("./db/crime.db")
    cur = con.cursor()
    res = cur.execute("SELECT count(*) FROM locations WHERE state = 'CA' AND communityName = 'Los Angeles'")
    assert res.fetchone()[0] == 1

# def test_query_map_data():
#     print(flask_main)
#     res = flask_main.query_map_data("sample.db", False)
#     assert len(res) == 279

#     stateRes = flask_main.queryMapData("sample.db", True)
#     assert len(stateRes) == 48

# @pytest.fixture()
# def app():
#     app = testApp()

if __name__ == '__main__':
    pytest.main()