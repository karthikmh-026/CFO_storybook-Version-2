import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect

conn = connect()
cur = conn.cursor()
cur.execute('SELECT * FROM "TB"."TB_1000_2025" LIMIT 1 OFFSET 250;')
cols = [d[0] for d in cur.description]
row = cur.fetchone()
for c, v in zip(cols, row):
    print(f"{c}: {v}")
cur.close()
conn.close()
