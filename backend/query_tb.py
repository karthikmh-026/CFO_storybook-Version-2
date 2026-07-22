from db import connect
from story_data import parse_val

def main():
    conn = connect()
    cur = conn.cursor()
    
    years = ["2024", "2025", "2026"]
    entities = ["1000", "2000", "3000", "4000", "5000"]
    
    for year in years:
        cash_sum = 0.0
        borrow_sum = 0.0
        
        for code in entities:
            table = f"TB_{code}_{year}"
            # Check if table exists
            cur.execute(f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'TB' AND table_name = '{table}')")
            if not cur.fetchone()[0]:
                continue
                
            cur.execute(f'SELECT "G/L Acct", "Short Text", "Accumulated Balance", "Classification" FROM "TB"."{table}"')
            for r in cur.fetchall():
                text = (r[1] or '').lower().strip()
                val = parse_val(r[2])
                cls = (r[3] or '').lower().strip()
                
                # Use same classification rules as _fetch_entity_tb_balances
                if "cash" in cls or "bank" in cls or "cash" in text or "bank" in text:
                    if "charges" not in text and "interest" not in text:
                        cash_sum += val
                elif "borrowings" in cls or "borrowing" in cls or "lease liability" in cls:
                    borrow_sum += -val
                    
        print(f"FY{year[-2:]}: Cash={cash_sum/10000000.0:.1f} Cr, Borrowings={borrow_sum/10000000.0:.1f} Cr, Net Debt={(borrow_sum-cash_sum)/10000000.0:.1f} Cr")
        
    conn.close()

if __name__ == '__main__':
    main()
