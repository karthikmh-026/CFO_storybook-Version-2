"""Diagnose 4000 table revenue classification."""
import sys
sys.path.insert(0, '.')
from story_data import TABLE_MAPPING, parse_val
from db import connect

conn = connect()
tables_4000 = TABLE_MAPPING.get("4000", [])
print(f"Tables for 4000: {tables_4000}\n")

with conn.cursor() as cur:
    for table in tables_4000:
        print(f"\n=== Table: {table} ===")
        cur.execute(f'SELECT "G/L Acct", "Debit Blnce of Reportng Period", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification" FROM "TB"."{table}"')
        rows = cur.fetchall()
        
        # Check is_closed
        is_closed = True
        for r in rows:
            cls = (r[4] or "").lower().strip()
            accum = parse_val(r[3])
            if ("revenue" in cls or "operation" in cls) and accum != 0.0:
                is_closed = False
                break
        print(f"  is_closed = {is_closed}")
        
        rev_total_accum = 0.0
        rev_total_cr = 0.0
        for r in rows:
            cls = (r[4] or "").lower().strip()
            if "revenue from operations" in cls or "income from operation" in cls or "income from operations" in cls or "other income" in cls:
                cr_val = parse_val(r[2])
                accum = parse_val(r[3])
                rev_total_cr += cr_val
                rev_total_accum += accum
                print(f"  GL={r[0]} cls='{r[4]}' cr_bal={cr_val:,.0f} accum={accum:,.0f}")
        
        print(f"  TOTAL Credit Balance Reporting = {rev_total_cr:,.0f} -> {rev_total_cr/10000000:.4f} Cr")
        print(f"  TOTAL Accumulated Balance       = {rev_total_accum:,.0f} -> {abs(rev_total_accum)/10000000:.4f} Cr")

conn.close()
