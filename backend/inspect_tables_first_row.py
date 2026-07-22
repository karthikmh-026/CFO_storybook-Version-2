from db import connect

def main():
    conn = connect()
    cur = conn.cursor()
    
    # Get all tables in non-SAP_Input schemas
    cur.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'SAP_Input')
        ORDER BY table_schema, table_name;
    """)
    tables = cur.fetchall()
    print(f"Inspecting {len(tables)} tables...")
    
    for schema, table in tables:
        try:
            cur.execute(f'SELECT * FROM "{schema}"."{table}" LIMIT 1;')
            row = cur.fetchone()
            if row:
                # Print table name and first row (truncated)
                row_str = str(row)[:120]
                print(f" - {schema}.{table}: {row_str}")
            else:
                print(f" - {schema}.{table}: EMPTY")
        except Exception as e:
            print(f" - {schema}.{table}: ERROR ({e})")
            conn.rollback()
            cur = conn.cursor()
            
    conn.close()

if __name__ == '__main__':
    main()
