"""Check exact accumulated balance sums for 1000 and 4000."""
import sys
sys.path.insert(0, '.')
from story_data import TABLE_MAPPING, parse_val
from db import connect

conn = connect()

for entity in ["1000", "4000"]:
    tables = TABLE_MAPPING.get(entity, [])
    print(f"\n=== Entity {entity} ===")
    total_accum = 0.0
    total_cr_bal = 0.0
    
    with conn.cursor() as cur:
        for table in tables:
            cur.execute(f'SELECT "G/L Acct", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification" FROM "TB"."{table}"')
            rows = cur.fetchall()
            
            is_closed = True
            for r in rows:
                cls = (r[3] or "").lower().strip()
                accum = parse_val(r[2])
                if ("revenue" in cls or "operation" in cls) and accum != 0.0:
                    is_closed = False
                    break
            print(f"  Table: {table}, is_closed={is_closed}")
            
            for r in rows:
                cls = (r[3] or "").lower().strip()
                if "revenue from operations" in cls or "income from operation" in cls or "income from operations" in cls or "other income" in cls:
                    cr = parse_val(r[1])
                    accum = parse_val(r[2])
                    total_accum += accum
                    total_cr_bal += cr
    
    print(f"  Sum Credit Balance = {total_cr_bal:,.0f}  -> {total_cr_bal/10000000:.2f} Cr")
    print(f"  Sum Accum Balance  = {total_accum:,.0f}  -> {abs(total_accum)/10000000:.2f} Cr")

conn.close()
print("\nDone.")
