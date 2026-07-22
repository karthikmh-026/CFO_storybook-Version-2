import urllib.request
import json

endpoints = [
    ("ALL", "http://127.0.0.1:8000/api/story?entity=ALL"),
    ("1000", "http://127.0.0.1:8000/api/story?entity=1000"),
    ("4000", "http://127.0.0.1:8000/api/story?entity=4000")
]

for entity, url in endpoints:
    print(f"\nQuerying: {entity} via {url}")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            data = json.loads(res_body)
            print("Successfully fetched!")
            hero = data.get("hero", {})
            # Safely print ASCII string representing the hero dict
            hero_str = str(hero).encode('ascii', errors='replace').decode('ascii')
            print("  Hero:", hero_str)
            summary = data.get("execSummary", {})
            if summary:
                rev_str = str(summary.get("revenue")).encode('ascii', errors='replace').decode('ascii')
                print("  Revenue MTD/QTD/YTD:", rev_str)
    except Exception as e:
        print("  Error fetching:", e)
