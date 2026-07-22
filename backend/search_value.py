import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect
from story_data import parse_val

conn = connect()
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'TB' ORDER BY table_name;")
tables = [r[0] for r in cur.fetchall()]

for table in tables:
    cur.execute(f'SELECT * FROM "TB"."{table}"')
    rows = cur.fetchall()
    cols = [d[0] for d in cur.description]
    for r_idx, row in enumerate(rows, 1):
        for col, val in zip(cols, row):
            if val is not None:
                num = parse_val(str(val))
                # Check if value is close to 3,199,119,000 or 319.91 Cr or 3,201,933,803
                if abs(num - 3199119000) < 5000000 or abs(num - 3201933803) < 5000000:
                    print(f"Table={table} | Row={r_idx} | Col={col} | Value={val}")

cur.close()
conn.close()
