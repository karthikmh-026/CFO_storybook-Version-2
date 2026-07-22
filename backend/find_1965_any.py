import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect
from story_data import parse_val

conn = connect()
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'TB' ORDER BY table_name;")
tables = [r[0] for r in cur.fetchall()]

CRORE = 10_000_000.0

# For each table, we have two possible values: one using accum, one using credit balance
table_values = {}
for table in tables:
    cur.execute(f'SELECT "Debit Blnce of Reportng Period", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification" FROM "TB"."{table}"')
    rows = cur.fetchall()
    
    # is_closed logic
    is_closed = True
    for r in rows:
        cls = (r[3] or "").lower().strip()
        accum = parse_val(r[2])
        if ("revenue" in cls or "operation" in cls) and accum != 0.0:
            is_closed = False
            break
            
    # Calculate both ways
    # 1. Standard (which uses is_closed)
    rev_std = 0.0
    oth_std = 0.0
    # 2. Force Closed (uses cr_val / db_val)
    rev_closed = 0.0
    oth_closed = 0.0
    # 3. Force Open (uses accum)
    rev_open = 0.0
    oth_open = 0.0
    
    for r in rows:
        db_val = parse_val(r[0])
        cr_val = parse_val(r[1])
        accum = parse_val(r[2])
        cls_lower = (r[3] or "").lower().strip()
        is_credit = False
        cat = None
        if "revenue from operations" in cls_lower or "income from operation" in cls_lower or "income from operations" in cls_lower:
            is_credit = True
            cat = "revenue"
        elif "other income" in cls_lower:
            is_credit = True
            cat = "other_income"
            
        if cat:
            # Standard
            val_std = cr_val if is_closed else -accum
            if cat == "revenue":
                rev_std += val_std
            else:
                oth_std += val_std
                
            # Force Closed
            val_closed = cr_val if is_credit else db_val
            if cat == "revenue":
                rev_closed += val_closed
            else:
                oth_closed += val_closed
                
            # Force Open
            val_open = -accum if is_credit else accum
            if cat == "revenue":
                rev_open += val_open
            else:
                oth_open += val_open
                
    table_values[table] = {
        'std': (rev_std + oth_std) / CRORE,
        'closed': (rev_closed + oth_closed) / CRORE,
        'open': (rev_open + oth_open) / CRORE
    }

import itertools
targets = [1965.44, 1856.82]

for target in targets:
    print(f"\n--- Searching for target: {target} ---")
    for r in range(1, len(tables)+1):
        for subset in itertools.combinations(tables, r):
            # Try all configurations of std/closed/open for the subset
            configs = list(itertools.product(['std', 'closed', 'open'], repeat=len(subset)))
            for config in configs:
                s = sum(table_values[subset[i]][config[i]] for i in range(len(subset)))
                if abs(s - target) < 0.1:
                    config_desc = ", ".join(f"{subset[i]}:{config[i]}" for i in range(len(subset)))
                    print(f"Match: {config_desc} = {s:.4f} Cr (diff: {s-target:.4f})")

cur.close()
conn.close()
