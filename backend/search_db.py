from db import connect

def search_db():
    conn = connect()
    cur = conn.cursor()
    cur.execute("""
        SELECT table_schema, table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
          AND data_type IN ('character varying', 'text', 'character')
    """)
    cols = cur.fetchall()
    print(f"Searching {len(cols)} text columns...")
    
    for schema, table, col, dtype in cols:
        try:
            # Query if value exists
            query = f'SELECT "{col}" FROM "{schema}"."{table}" WHERE "{col}" LIKE %s LIMIT 1'
            cur.execute(query, ('%BSEG-HKONT%',))
            res = cur.fetchone()
            if res:
                print(f"FOUND IN: {schema}.{table}.{col} -> {res[0]}")
        except Exception as e:
            # Print error or pass
            conn.rollback()
            cur = conn.cursor()

if __name__ == '__main__':
    search_db()
