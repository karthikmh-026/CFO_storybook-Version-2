import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect
from story_data import parse_val

conn = connect()
cur = conn.cursor()

for table in ["TB_1000_2024", "TB_1000_2025", "TB_1000_2026", "TB_2000_2024", "TB_4000_2025", "TB_4000_2026"]:
    print(f"\n=== Table: {table} ===")
    try:
        cur.execute(f'SELECT "Classification", "Accumulated Balance" FROM "TB"."{table}"')
        rows = cur.fetchall()
        
        cls_sums = {}
        cls_counts = {}
        for r in rows:
            cls = r[0] or "None"
            val = parse_val(r[1])
            cls_sums[cls] = cls_sums.get(cls, 0.0) + val
            cls_counts[cls] = cls_counts.get(cls, 0) + 1
            
        for cls in sorted(cls_sums.keys()):
            total = cls_sums[cls]
            count = cls_counts[cls]
            print(f"  {cls:35s} | count={count:3d} | sum={total/10000000.0:12.4f} Cr")
    except Exception as e:
        conn.rollback()
        print(f"  Error: {e}")

cur.close()
conn.close()
