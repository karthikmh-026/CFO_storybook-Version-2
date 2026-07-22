import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect
from story_data import parse_val

conn = connect()
cur = conn.cursor()

def safe_float(v):
    if v is None: return 0.0
    return parse_val(str(v))

print("=== TB_1000_2025 Distinct Classifications ===")
cur.execute("""
    SELECT "Classification", COUNT(*)
    FROM "TB"."TB_1000_2025"
    GROUP BY "Classification" ORDER BY "Classification"
""")
rows = cur.fetchall()
for r in rows:
    cls = str(r[0])
    count = r[1]
    
    cur.execute(f'SELECT "Credit Balance Reporting Per.", "Accumulated Balance" FROM "TB"."TB_1000_2025" WHERE "Classification" = %s', (r[0],))
    vals = cur.fetchall()
    cr_sum = sum(safe_float(x[0]) for x in vals)
    accum_sum = sum(safe_float(x[1]) for x in vals)
    
    print(f"Classification: {cls:35s} | count={count:3d} | cr_sum={cr_sum/10000000:.4f} Cr | accum_sum={accum_sum/10000000:.4f} Cr")

cur.close()
conn.close()
