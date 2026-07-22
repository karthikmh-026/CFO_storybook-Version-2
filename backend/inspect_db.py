import psycopg2
from db import connect

def main():
    conn = connect()
    cur = conn.cursor()
    cur.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name;
    """)
    tables = cur.fetchall()
    print("TABLES:")
    for schema, name in tables:
        print(f" - {schema}.{name}")
        
    # Search for tables that might contain "lineage" or similar
    cur.execute("""
        SELECT table_schema, table_name, column_name 
        FROM information_schema.columns 
        WHERE column_name LIKE '%component%' OR column_name LIKE '%fields%' OR column_name LIKE '%logic%'
    """)
    cols = cur.fetchall()
    print("\nCOLUMNS MATCHING 'component/fields/logic':")
    for s, t, c in cols:
        print(f" - {s}.{t}.{c}")

if __name__ == '__main__':
    main()
