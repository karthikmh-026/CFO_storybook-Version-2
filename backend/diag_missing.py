"""Check string-column tables for 4000 entity revenue."""
import sys
sys.path.insert(0, '.')
from story_data import parse_val
from db import connect

conn = connect()

string_tables = ["TB_1000_2024", "TB_2000_2024", "TB_2000_2025", "TB_3000_2024"]

print("Checking string-column tables for CoCd=4000, GL 3xxxxx:")
for table in string_tables:
    try:
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT "CoCd", COUNT(*), "G/L Acct", "Accumulated Balance"
                FROM "TB"."{table}"
                WHERE "CoCd"::TEXT = '4000'
                LIMIT 5
            """)
            rows = cur.fetchall()
            if rows:
                print(f"  {table}: HAS 4000 data! rows={rows[:3]}")
            else:
                # try different CoCd format
                cur.execute(f'SELECT DISTINCT "CoCd" FROM "TB"."{table}" LIMIT 5')
                cocd_vals = cur.fetchall()
                print(f"  {table}: no 4000, CoCd values = {[r[0] for r in cocd_vals]}")
    except Exception as e:
        conn.rollback()
        print(f"  {table}: ERROR {e}")

# Check if 1000 2024 table has CoCd=4000 rows (for intercompany)
print("\nChecking TB_1000_2024 for GL 3xxxxx with parse_val on string accum:")
try:
    with conn.cursor() as cur:
        cur.execute(f"""
            SELECT "CoCd", COUNT(*), SUM(REPLACE("Accumulated Balance", ',', '')::NUMERIC)
            FROM "TB"."TB_1000_2024"
            WHERE "G/L Acct"::TEXT LIKE '3%'
            GROUP BY "CoCd"
        """)
        rows = cur.fetchall()
        for r in rows:
            total = float(r[2] or 0)
            print(f"  CoCd={r[0]} count={r[1]} accum_sum={total:,.0f} -> {abs(total)/10000000:.2f} Cr")
except Exception as e:
    conn.rollback()
    print(f"  ERROR: {e}")

conn.close()
print(f"\nTarget 4000 (16 rows): -3,201,933,803 -> 320.19 Cr")
print(f"Currently found: 217.25 Cr (from TB_4000_2025 + TB_4000_2026)")
print(f"Gap: 320.19 - 217.25 = 102.94 Cr missing")
