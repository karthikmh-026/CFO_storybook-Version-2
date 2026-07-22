from db import connect

def main():
    conn = connect()
    cur = conn.cursor()
    try:
        cur.execute('SELECT * FROM "SAP_Output"."Pitti_Insights";')
        rows = cur.fetchall()
        print(f"Total rows in Pitti_Insights: {len(rows)}")
        for r in rows:
            print(r)
    except Exception as e:
        print("Error reading Pitti_Insights:", e)
    finally:
        conn.close()

if __name__ == '__main__':
    main()
