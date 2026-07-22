"""Direct SUM of Accumulated Balance (float column) for revenue GLs."""
import sys
sys.path.insert(0, '.')
from db import connect

conn = connect()
rev_classes = ('Income from operations', 'Other Income', 'Revenue from Operations')

for entity, tables in [("1000", ["TB_1000_2025"]), ("4000", ["TB_4000_2025", "TB_4000_2026"])]:
    total = 0.0
    print(f"\n=== Entity {entity} ===")
    with conn.cursor() as cur:
        for table in tables:
            cur.execute(f"""
                SELECT SUM("Accumulated Balance")
                FROM "TB"."{table}"
                WHERE "Classification" IN %s
            """, (rev_classes,))
            s = cur.fetchone()[0]
            val = float(s or 0)
            total += val
            print(f"  {table}: SUM(Accumulated Balance) = {val:,.0f}  -> {abs(val)/10000000:.2f} Cr")
    print(f"  TOTAL {entity}: {total:,.0f}  -> {abs(total)/10000000:.2f} Cr")

conn.close()
print(f"\nTarget 1000 = -16,455,281,387 -> 1645.53 Cr")
print(f"Target 4000 = -3,201,933,803 -> 320.19 Cr")
