import MySQLdb
import json
import datetime, time
from collections import defaultdict


db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="",         # your username
                     passwd="",  # your password
                     db="")        # name of the data base

cur = db.cursor()

cur.execute("SELECT * FROM pokemon")

pokes = defaultdict(list)

for row in cur.fetchall():
    poke = {
      'p':row[2],
      'x': row[3],
      'y': row[4],
      'd': int(time.mktime(row[5].timetuple()))
    }
    pokes[poke['p']].append(poke)


for key in pokes:
    with open("pokelocations/" + str(key) + ".json", 'wb') as outfile:
        json.dump(pokes[key], outfile)
