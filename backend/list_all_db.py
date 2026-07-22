import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect

conn = connect()
cur = conn.cursor()

# List schemas
print("--- Schemas ---")
cur.execute("SELECT schema_name FROM information_schema.schemata;")
for r in cur.fetchall():
    print(r[0])

# List all tables in all schemas
print("\n--- Tables in all schemas ---")
cur.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema') ORDER BY table_schema, table_name;")
for r in cur.fetchall():
    print(f"{r[0]}.{r[1]}")

cur.close()
conn.close()
