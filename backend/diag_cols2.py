"""Find which column and tables produce exact sums matching user's DB query."""
import sys
sys.path.insert(0, '.')
from story_data import parse_val
from db import connect

conn = connect()

cols_to_check = [
    "Balance Carryforward",
    "Balance of Prior Periods", 
    "Debit Blnce of Reportng Period",
    "Credit Balance Reporting Per.",
    "Accumulated Balance",
]

rev_classes = ['Income from operations', 'Other Income', 'Revenue from Operations']

print("=== Checking column sums for 1000 revenue GLs ===")
for col in cols_to_check:
    try:
        with conn.cursor() as cur:
            placeholders = ','.join([f"'{c}'" for c in rev_classes])
            cur.execute(f"""
                SELECT SUM(REPLACE("{col}", ',', '')::NUMERIC)
                FROM "TB"."TB_1000_2025"
                WHERE "Classification" IN ({placeholders})
            """)
            total = cur.fetchone()[0]
            print(f"  TB_1000_2025 | {col:40s} | SUM={float(total or 0):>18,.0f} | Cr={abs(float(total or 0))/10000000:.2f}")
    except Exception as e:
        conn.rollback()
        print(f"  TB_1000_2025 | {col:40s} | ERROR: {e}")

print("\n=== Checking column sums for 4000 revenue GLs (both tables) ===")
for table in ["TB_4000_2025", "TB_4000_2026"]:
    for col in cols_to_check:
        try:
            with conn.cursor() as cur:
                placeholders = ','.join([f"'{c}'" for c in rev_classes])
                cur.execute(f"""
                    SELECT SUM(REPLACE("{col}", ',', '')::NUMERIC)
                    FROM "TB"."{table}"
                    WHERE "Classification" IN ({placeholders})
                """)
                total = cur.fetchone()[0]
                print(f"  {table} | {col:40s} | SUM={float(total or 0):>18,.0f} | Cr={abs(float(total or 0))/10000000:.2f}")
        except Exception as e:
            conn.rollback()
            print(f"  {table} | {col:40s} | ERROR: {e}")

conn.close()
print("\nTarget 1000 = 16455281387 -> 1645.53 Cr")
print("Target 4000 = 3201933803 -> 320.19 Cr")
