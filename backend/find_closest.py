import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect
from story_data import parse_val

conn = connect()
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'TB' ORDER BY table_name;")
tables = [r[0] for r in cur.fetchall()]

CRORE = 10_000_000.0

table_totals = {}
for table in tables:
    cur.execute(f'SELECT "Debit Blnce of Reportng Period", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification" FROM "TB"."{table}"')
    rows = cur.fetchall()
    
    is_closed = True
    for r in rows:
        cls = (r[3] or "").lower().strip()
        accum = parse_val(r[2])
        if ("revenue" in cls or "operation" in cls) and accum != 0.0:
            is_closed = False
            break
            
    rev_sum = 0.0
    oth_sum = 0.0
    for r in rows:
        db_val = parse_val(r[0])
        cr_val = parse_val(r[1])
        accum = parse_val(r[2])
        cls_lower = (r[3] or "").lower().strip()
        is_credit = False
        cat = None
        if "revenue from operations" in cls_lower or "income from operation" in cls_lower or "income from operations" in cls_lower:
            is_credit = True
            cat = "revenue"
        elif "other income" in cls_lower:
            is_credit = True
            cat = "other_income"
        if cat:
            ytd_raw = cr_val if is_closed else -accum
            if cat == "revenue":
                rev_sum += ytd_raw
            else:
                oth_sum += ytd_raw
    table_totals[table] = (rev_sum + oth_sum) / CRORE

import itertools

print("=== Close to 1856.82 ===")
for r in range(1, len(tables)+1):
    for subset in itertools.combinations(tables, r):
        s = sum(table_totals[t] for t in subset)
        if abs(s - 1856.82) < 150.0:
            print(f"  {subset} = {s:.4f} Cr (diff: {s - 1856.82:.4f})")

print("\n=== Close to 1965.44 ===")
for r in range(1, len(tables)+1):
    for subset in itertools.combinations(tables, r):
        s = sum(table_totals[t] for t in subset)
        if abs(s - 1965.44) < 150.0:
            print(f"  {subset} = {s:.4f} Cr (diff: {s - 1965.44:.4f})")

cur.close()
conn.close()
