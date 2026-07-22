"""Check TB_4000_2026 revenue rows."""
import sys
sys.path.insert(0, '.')
from story_data import parse_val
from db import connect

conn = connect()
with conn.cursor() as cur:
    cur.execute('SELECT "G/L Acct", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification" FROM "TB"."TB_4000_2026"')
    rows = cur.fetchall()
    
    is_closed = True
    for r in rows:
        cls = (r[3] or "").lower().strip()
        accum = parse_val(r[2])
        if ("revenue" in cls or "operation" in cls) and accum != 0.0:
            is_closed = False
            break
    print(f"TB_4000_2026 is_closed = {is_closed}")
    
    total_accum = 0.0
    total_cr = 0.0
    for r in rows:
        cls = (r[3] or "").lower().strip()
        if "revenue from operations" in cls or "income from operation" in cls or "income from operations" in cls or "other income" in cls:
            cr = parse_val(r[1])
            accum = parse_val(r[2])
            total_accum += accum
            total_cr += cr
            print(f"  GL={r[0]:10s} cls='{r[3]}' cr_bal={cr:>15,.0f}  accum={accum:>15,.0f}")
    
    print(f"\nTB_4000_2026 Total CR bal  = {total_cr:>15,.0f} -> {total_cr/10000000:.2f} Cr")
    print(f"TB_4000_2026 Total Accum   = {total_accum:>15,.0f} -> {abs(total_accum)/10000000:.2f} Cr")

conn.close()
