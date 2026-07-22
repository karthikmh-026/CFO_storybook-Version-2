"""Compare TB_4000_2025 vs TB_4000_2026 row by row - use parse_val."""
import sys
sys.path.insert(0, '.')
from story_data import parse_val
from db import connect

conn = connect()

def safe_float(v):
    if v is None: return 0.0
    if isinstance(v, (int, float)): return float(v)
    return parse_val(str(v))

print("=== TB_4000_2025 ALL rows GL 3xxxxx ===")
total_cr_2025 = 0.0
total_accum_2025 = 0.0
with conn.cursor() as cur:
    cur.execute("""
        SELECT "G/L Acct", "Short Text", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification"
        FROM "TB"."TB_4000_2025"
        WHERE "G/L Acct"::TEXT LIKE '3%'
        ORDER BY "G/L Acct"
    """)
    rows_2025 = cur.fetchall()
    for r in rows_2025:
        cr = safe_float(r[2]); accum = safe_float(r[3])
        total_cr_2025 += cr; total_accum_2025 += accum
        print(f"  GL={r[0]:8} | {str(r[4]):30s} | cr={cr:>14,.0f} | accum={accum:>14,.0f}")
print(f"Total 2025: {len(rows_2025)} rows | cr={total_cr_2025:>14,.0f} ({total_cr_2025/10000000:.2f} Cr) | accum={total_accum_2025:>14,.0f} ({abs(total_accum_2025)/10000000:.2f} Cr)")

print("\n=== TB_4000_2026 ALL rows GL 3xxxxx ===")
total_cr_2026 = 0.0
total_accum_2026 = 0.0
with conn.cursor() as cur:
    cur.execute("""
        SELECT "G/L Acct", "Short Text", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification"
        FROM "TB"."TB_4000_2026"
        WHERE "G/L Acct"::TEXT LIKE '3%'
        ORDER BY "G/L Acct"
    """)
    rows_2026 = cur.fetchall()
    for r in rows_2026:
        cr = safe_float(r[2]); accum = safe_float(r[3])
        total_cr_2026 += cr; total_accum_2026 += accum
        print(f"  GL={r[0]:8} | {str(r[4]):30s} | cr={cr:>14,.0f} | accum={accum:>14,.0f}")
print(f"Total 2026: {len(rows_2026)} rows | cr={total_cr_2026:>14,.0f} ({total_cr_2026/10000000:.2f} Cr) | accum={total_accum_2026:>14,.0f} ({abs(total_accum_2026)/10000000:.2f} Cr)")

print(f"\nCombined: {len(rows_2025)+len(rows_2026)} rows | cr_total={total_cr_2025+total_cr_2026:,.0f} ({(total_cr_2025+total_cr_2026)/10000000:.2f} Cr)")
print(f"Target 4000 (16 rows): cr=-3,201,933,803 -> 320.19 Cr")
conn.close()
