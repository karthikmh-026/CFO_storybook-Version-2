"""Check all GL accounts in revenue range for 1000 and 4000."""
import sys
sys.path.insert(0, '.')
from db import connect

conn = connect()

# Revenue GLs are typically 3xxxxx range in Indian SAP
# Check all classifications present in tables
for entity, tables in [("1000", ["TB_1000_2025"]), ("4000", ["TB_4000_2025"])]:
    print(f"\n=== Entity {entity} ALL classifications in revenue GL range ===")
    with conn.cursor() as cur:
        for table in tables:
            # Get all distinct classifications
            cur.execute(f"""
                SELECT "Classification", COUNT(*), SUM("Accumulated Balance")
                FROM "TB"."{table}"
                WHERE "G/L Acct"::TEXT LIKE '3%'
                GROUP BY "Classification"
                ORDER BY "Classification"
            """)
            rows = cur.fetchall()
            total_accum = 0.0
            for r in rows:
                accum = float(r[2] or 0)
                total_accum += accum
                print(f"  cls='{r[0]}' count={r[1]} accum={accum:>18,.0f} -> {abs(accum)/10000000:.2f} Cr")
            print(f"  TOTAL accum for 3xxxx GLs: {total_accum:>18,.0f} -> {abs(total_accum)/10000000:.2f} Cr")

conn.close()
print(f"\nTarget 1000 (29 rows): -16,455,281,387 -> 1645.53 Cr")
print(f"Target 4000 (16 rows): -3,201,933,803 -> 320.19 Cr")
