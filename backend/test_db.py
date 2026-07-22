import psycopg2
from db import connect
conn = connect()
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'TB'")
print([row[0] for row in cur.fetchall()])
