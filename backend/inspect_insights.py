import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect

conn = connect()
cur = conn.cursor()

print("--- Pitti_Insights Columns ---")
cur.execute('SELECT * FROM "SAP_Output"."Pitti_Insights" LIMIT 1;')
cols = [d[0] for d in cur.description]
print(cols)

print("\n--- Pitti_Insights Content ---")
cur.execute('SELECT * FROM "SAP_Output"."Pitti_Insights";')
rows = cur.fetchall()
for r in rows:
    print(r)

cur.close()
conn.close()
