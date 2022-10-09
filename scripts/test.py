import unittest
import sqlite3

class TestStringMethods(unittest.TestCase):
    def test_sql_query(self):
        con = sqlite3.connect("crime.db")
        cur = con.cursor()
        res = cur.execute("SELECT count(*) FROM locations")
        self.assertEqual(res.fetchone()[0], 359)

if __name__ == '__main__':
    unittest.main()