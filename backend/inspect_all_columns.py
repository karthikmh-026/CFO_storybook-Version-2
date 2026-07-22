from db import connect

def main():
    conn = connect()
    cur = conn.cursor()
    
    # Get all tables in SAP_Output
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'SAP_Output'
        ORDER BY table_name;
    """)
    tables = [r[0] for r in cur.fetchall()]
    
    for table in tables:
        cur.execute(f'SELECT * FROM "SAP_Output"."{table}" LIMIT 1;')
        cols = [d[0] for d in cur.description]
        print(f"Table SAP_Output.{table} columns: {cols}")
        
    conn.close()

if __name__ == '__main__':
    main()
