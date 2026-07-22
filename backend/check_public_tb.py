import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from db import connect

conn = connect()
cur = conn.cursor()

try:
    cur.execute("SELECT COUNT(*) FROM public.trial_balance;")
    cnt = cur.fetchone()[0]
    print(f"Total rows in public.trial_balance: {cnt}")
    if cnt > 0:
        cur.execute("SELECT * FROM public.trial_balance LIMIT 5;")
        cols = [d[0] for d in cur.description]
        for r in cur.fetchall():
            print(dict(zip(cols, r)))
except Exception as e:
    print("Error checking public.trial_balance:", e)

cur.close()
conn.close()
