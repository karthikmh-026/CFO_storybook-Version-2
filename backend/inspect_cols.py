import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect

conn = connect()
cur = conn.cursor()

tables = ["TB_1000_2025", "TB_4000_2025"]
for t in tables:
    print(f"\n=== Columns of {t} ===")
    cur.execute(f'SELECT * FROM "TB"."{t}" LIMIT 1;')
    cols = [d[0] for d in cur.description]
    print(cols)
    row = cur.fetchone()
    print("Sample Row:", row)

cur.close()
conn.close()
