from db import connect

def main():
    conn = connect()
    cur = conn.cursor()
    
    # Get all text columns in all tables
    cur.execute("""
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
          AND data_type IN ('character varying', 'text', 'character')
    """)
    cols = cur.fetchall()
    
    # Check row count first
    for schema, table, col in cols:
        try:
            cur.execute(f'SELECT count(*) FROM "{schema}"."{table}"')
            count = cur.fetchone()[0]
            if count > 10000:
                continue
            
            cur.execute(f'SELECT "{col}" FROM "{schema}"."{table}" WHERE "{col}" LIKE %s LIMIT 1', ('%BSEG-HKONT%',))
            res = cur.fetchone()
            if res:
                print(f"FOUND IN: {schema}.{table}.{col} (rows: {count}) -> {res[0]}")
        except Exception as e:
            conn.rollback()
            cur = conn.cursor()
            
    conn.close()

if __name__ == '__main__':
    main()
