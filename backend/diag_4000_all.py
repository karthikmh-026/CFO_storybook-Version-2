"""Check ALL tables for 4000 entity data with GL 3xxxxx."""
import sys
sys.path.insert(0, '.')
from db import connect

conn = connect()

with conn.cursor() as cur:
    # Get all tables in TB schema
    cur.execute("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'TB' ORDER BY table_name
    """)
    all_tables = [r[0] for r in cur.fetchall()]

print("Checking ALL TB tables for 4000 entity, GL 3xxxxx range:\n")
grand_total = 0.0
for table in all_tables:
    try:
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT COUNT(*), SUM("Accumulated Balance")
                FROM "TB"."{table}"
                WHERE "CoCd"::TEXT = '4000'
                  AND "G/L Acct"::TEXT LIKE '3%'
            """)
            row = cur.fetchone()
            count = row[0] or 0
            total = float(row[1] or 0)
            if count > 0:
                grand_total += total
                print(f"  {table}: count={count}, accum={total:>18,.0f} -> {abs(total)/10000000:.2f} Cr")
    except Exception as e:
        conn.rollback()
        print(f"  {table}: ERROR {e}")

print(f"\nGrand total 4000 revenue: {grand_total:>18,.0f} -> {abs(grand_total)/10000000:.2f} Cr")
print(f"Target 4000: -3,201,933,803 -> 320.19 Cr")
conn.close()
