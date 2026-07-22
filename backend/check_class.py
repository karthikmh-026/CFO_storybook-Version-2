import psycopg2
conn = psycopg2.connect(host='192.168.1.53', port=5432, user='postgres', password='postgres', dbname='Pitti')
cur = conn.cursor()
tables = ["TB_1000_2025", "TB_2000_2025", "TB_4000_2025"]
for t in tables:
    try:
        cur.execute(f'SELECT DISTINCT "Classification" FROM "TB"."{t}" WHERE "Classification" ILIKE \'%sale%\' OR "Classification" ILIKE \'%scrap%\'')
        print(f'{t}:', [r[0] for r in cur.fetchall()])
    except Exception as e:
        pass
