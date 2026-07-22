"""Find which column and which tables produce the exact sums the user showed."""
import sys
sys.path.insert(0, '.')
from story_data import parse_val
from db import connect

conn = connect()

TARGET_1000 = 16455281387
TARGET_4000 = 3201933803

print("Checking all columns in TB_1000_2025 for revenue GLs...")
with conn.cursor() as cur:
    cur.execute("""
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'TB' AND table_name = 'TB_1000_2025'
        ORDER BY ordinal_position
    """)
    cols = [r[0] for r in cur.fetchall()]
    print(f"Columns: {cols}")
    
    # Try each numeric column
    for col in cols:
        try:
            cur.execute(f"""
                SELECT SUM(CAST(REPLACE(REPLACE("{col}", ',', ''), ' ', '') AS NUMERIC))
                FROM "TB"."TB_1000_2025"
                WHERE "Classification" ILIKE '%revenue%' 
                   OR "Classification" ILIKE '%income from operation%'
                   OR "Classification" ILIKE '%other income%'
            """)
            total = cur.fetchone()[0]
            if total is not None:
                print(f"  {col}: SUM={total:,.0f}  abs={abs(total):,.0f}  match_1000={abs(int(total))==TARGET_1000}")
        except Exception as e:
            print(f"  {col}: error - {e}")

conn.close()
