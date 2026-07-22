import psycopg2
from itertools import product

def parse_val(val):
    if not val:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    val = val.strip().replace(",", "").replace(" ", "")
    if not val or val == "-" or val == "0.00":
        return 0.0
    try:
        return float(val)
    except:
        return 0.0

def main():
    conn = psycopg2.connect(
        host="192.168.1.53", port="5432", database="Pitti", user="postgres", password="postgres"
    )
    cur = conn.cursor()
    
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'TB' ORDER BY table_name")
    tables = [r[0] for r in cur.fetchall()]
    
    table_sums = {}
    for t in tables:
        if "5000" in t:
            continue
        cur.execute(f'SELECT "G/L Acct", "Debit Blnce of Reportng Period", "Credit Balance Reporting Per.", "Accumulated Balance", "Classification" FROM "TB"."{t}"')
        rows = cur.fetchall()
        
        rev_cr = 0.0
        rev_accum = 0.0
        oi_cr = 0.0
        oi_accum = 0.0
        
        for r in rows:
            cls = (r[4] or "").lower().strip()
            cr = parse_val(r[2])
            accum = parse_val(r[3])
            
            if "revenue from operations" in cls or "income from operation" in cls or "income from operations" in cls:
                rev_cr += cr
                rev_accum += accum
            elif "other income" in cls:
                oi_cr += cr
                oi_accum += accum
                
        table_sums[t] = {
            "rev_cr": rev_cr / 10000000.0,
            "rev_accum": abs(rev_accum) / 10000000.0,
            "oi_cr": oi_cr / 10000000.0,
            "oi_accum": abs(oi_accum) / 10000000.0,
            "rev_oi_cr": (rev_cr + oi_cr) / 10000000.0,
            "rev_oi_accum": (abs(rev_accum) + abs(oi_accum)) / 10000000.0,
            "zero": 0.0
        }
        
    target = 3736.56314375
    keys = list(table_sums.keys())
    options = ["rev_cr", "rev_accum", "oi_cr", "oi_accum", "rev_oi_cr", "rev_oi_accum", "zero"]
    
    print("Searching for exact combinations...")
    found = False
    for comb in product(options, repeat=len(keys)):
        s = 0.0
        for k, opt in zip(keys, comb):
            s += table_sums[k][opt]
            
        if abs(s - target) < 0.0001:
            print(f"\nFOUND MATCH! Sum={s:.8f} Cr")
            for k, opt in zip(keys, comb):
                val = table_sums[k][opt]
                if val > 0:
                    print(f"  {k} ({opt}): {val:.8f} Cr")
            found = True
            
    if not found:
        print("No combination found.")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
