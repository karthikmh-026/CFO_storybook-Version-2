"""Find ALL tables in TB schema and check which ones have 4000 data."""
import sys
sys.path.insert(0, '.')
from story_data import TABLE_MAPPING, parse_val
from db import connect

conn = connect()
print("Current TABLE_MAPPING:")
for k, v in TABLE_MAPPING.items():
    print(f"  {k}: {v}")

print("\n\nAll tables in TB schema:")
with conn.cursor() as cur:
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'TB'
        ORDER BY table_name;
    """)
    all_tables = [r[0] for r in cur.fetchall()]
    for t in all_tables:
        print(f"  {t}")

print("\n\nChecking each table for entity code 4000:")
with conn.cursor() as cur:
    for table in all_tables:
        try:
            cur.execute(f'SELECT "CoCd" FROM "TB"."{table}" LIMIT 1')
            row = cur.fetchone()
            if row:
                print(f"  {table}: CoCd sample = {row[0]}")
        except Exception as e:
            print(f"  {table}: no CoCd column or error")

conn.close()
