from db import connect

def main():
    conn = connect()
    cur = conn.cursor()
    
    # Get all text columns in all tables, excluding SAP_Input
    cur.execute("""
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'SAP_Input')
          AND data_type IN ('character varying', 'text', 'character')
    """)
    cols = cur.fetchall()
    print(f"Checking {len(cols)} columns for 'Cash & bank balances'...")
    
    for schema, table, col in cols:
        try:
            cur.execute(f'SELECT "{col}" FROM "{schema}"."{table}" WHERE "{col}" ILIKE %s LIMIT 1', ('%Cash & bank balances%',))
            res = cur.fetchone()
            if res:
                print(f"FOUND IN: {schema}.{table}.{col} -> {res[0]}")
        except Exception as e:
            conn.rollback()
            cur = conn.cursor()
            
    conn.close()

if __name__ == '__main__':
    main()
