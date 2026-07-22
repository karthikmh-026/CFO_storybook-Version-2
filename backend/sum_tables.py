import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect
from story_data import parse_val, _get_live_kpis, _fetch_entity_pl

conn = connect()
cur = conn.cursor()

# Get all tables
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'TB' ORDER BY table_name;")
tables = [r[0] for r in cur.fetchall()]

CRORE = 10_000_000.0

for table in tables:
    cur.execute(f'SELECT "G/L Acct", "Debit Blnce of Reportng Period", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification" FROM "TB"."{table}"')
    rows = cur.fetchall()

    is_closed = True
    for r in rows:
        cls = (r[4] or "").lower().strip()
        accum = parse_val(r[3])
        if ("revenue" in cls or "operation" in cls) and accum != 0.0:
            is_closed = False
            break

    rev_sum = 0.0
    oth_sum = 0.0
    for r in rows:
        db_val  = parse_val(r[1])
        cr_val  = parse_val(r[2])
        accum   = parse_val(r[3])
        cls_lower = (r[4] or "").lower().strip()

        is_credit = False
        cat = None
        if "revenue from operations" in cls_lower or "income from operation" in cls_lower or "income from operations" in cls_lower:
            is_credit = True
            cat = "revenue"
        elif "other income" in cls_lower:
            is_credit = True
            cat = "other_income"

        if cat:
            if is_closed:
                ytd_raw = cr_val if is_credit else db_val
            else:
                ytd_raw = -accum if is_credit else accum
            
            if cat == "revenue":
                rev_sum += ytd_raw
            elif cat == "other_income":
                oth_sum += ytd_raw

    print(f"Table {table}: Closed={is_closed}, Revenue={rev_sum/CRORE:.4f} Cr, Other Income={oth_sum/CRORE:.4f} Cr, Total={ (rev_sum+oth_sum)/CRORE :.4f} Cr")

cur.close()
conn.close()
