from db import connect
from story_data import TABLE_MAPPING, parse_val, _get_live_kpis

def main():
    pl, bs = _get_live_kpis()
    print("BS Borrowings KPI:", bs["borrowings"])
    
    # Now let's calculate our breakdown
    conn = connect()
    cur = conn.cursor()
    
    cc_total = 0.0
    tl_total = 0.0
    ecb_total = 0.0
    lease_total = 0.0
    
    # Use the same tables as consolidated _get_live_kpis
    for code in ["1000", "2000", "3000", "4000", "5000"]:
        tables = TABLE_MAPPING.get(code, [])
        for table in tables:
            # check if table exists
            cur.execute(f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'TB' AND table_name = '{table}')")
            if not cur.fetchone()[0]:
                continue
            cur.execute(f'SELECT "G/L Acct", "Short Text", "Accumulated Balance", "Classification" FROM "TB"."{table}"')
            for r in cur.fetchall():
                text = (r[1] or '').lower().strip()
                val = parse_val(r[2])
                cls = (r[3] or '').lower().strip()
                
                if 'borrowings' in cls or 'lease liability' in cls:
                    is_ecb = 'ecb' in text
                    is_lease = 'lease' in text or 'lease liability' in cls
                    
                    if is_ecb:
                        ecb_total += -val
                    elif is_lease:
                        lease_total += -val
                    else:
                        tl_total += -val
                        
    print("Breakdown sum:", (tl_total + ecb_total + lease_total)/10000000.0)
    print(" - Term Loans:", tl_total/10000000.0)
    print(" - ECB / Buyer's Credit:", ecb_total/10000000.0)
    print(" - Lease Liabilities:", lease_total/10000000.0)
    conn.close()

if __name__ == '__main__':
    main()
