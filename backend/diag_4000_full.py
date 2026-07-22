"""Check 4000 Credit Balance column - all revenue GLs including non-3xxx."""
import sys
sys.path.insert(0, '.')
from story_data import parse_val
from db import connect

conn = connect()

def safe_float(v):
    if v is None: return 0.0
    if isinstance(v, (int, float)): return float(v)
    return parse_val(str(v))

# Check if 4000 has any revenue GL accounts outside 3xxxxx range
print("=== All GL accounts in TB_4000_2025 with revenue-related classifications ===")
with conn.cursor() as cur:
    cur.execute("""
        SELECT "G/L Acct", "Short Text", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification"
        FROM "TB"."TB_4000_2025"
        ORDER BY "G/L Acct"
    """)
    all_rows = cur.fetchall()
    print(f"Total rows: {len(all_rows)}")
    
    total_cr = 0.0
    total_accum = 0.0
    for r in all_rows:
        cls = (r[4] or "").lower()
        cr = safe_float(r[2])
        accum = safe_float(r[3])
        if "income" in cls or "revenue" in cls or "operation" in cls:
            total_cr += cr
            total_accum += accum
            print(f"  GL={r[0]:8} | {str(r[4]):30s} | cr={cr:>14,.0f} | accum={accum:>14,.0f}")
    
    print(f"\nAll income/revenue GLs: cr_total={total_cr:,.0f} ({total_cr/10000000:.2f} Cr)  accum_total={total_accum:,.0f} ({abs(total_accum)/10000000:.2f} Cr)")

# Now check if "Credit Balance Reporting Per." sums to exactly the target if we ignore the GL range filter
print("\n=== Sum of Credit Balance Reporting Per. for ALL 4000 rows (no filter) ===")
with conn.cursor() as cur:
    for tbl in ["TB_4000_2025", "TB_4000_2026"]:
        cur.execute(f'SELECT COUNT(*), "G/L Acct", "Short Text", "Classification", "Credit Balance Reporting Per." FROM "TB"."{tbl}" ORDER BY "G/L Acct"')
        rows = cur.fetchall()
        total = sum(safe_float(r[4]) for r in rows)
        print(f"  {tbl}: {len(rows)} rows, total_cr={total:,.0f} ({abs(total)/10000000:.2f} Cr)")

# Does the Credit Balance col for ALL classification types in 4000 include something different?
print("\n=== All distinct classifications in TB_4000_2025 ===")
with conn.cursor() as cur:
    cur.execute("""
        SELECT "Classification", COUNT(*), 
        SUM("Credit Balance Reporting Per."), SUM("Accumulated Balance")
        FROM "TB"."TB_4000_2025"
        GROUP BY "Classification" ORDER BY "Classification"
    """)
    for r in cur.fetchall():
        cr = safe_float(r[2])
        accum = safe_float(r[3])
        print(f"  {str(r[0]):40s} count={r[1]:3d} | cr={cr:>16,.0f} ({abs(cr)/10000000:.2f} Cr) | accum={accum:>16,.0f} ({abs(accum)/10000000:.2f} Cr)")

conn.close()
print(f"\nTarget 4000: 3,201,933,803 -> 320.19 Cr")
