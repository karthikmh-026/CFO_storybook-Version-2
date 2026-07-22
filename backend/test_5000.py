import sys
from story_data import get_full_story

try:
    print("Testing get_full_story('5000')...")
    data = get_full_story("5000")
    print("Successfully fetched story for 5000!")
    print("Companies in response:")
    for c in data["companies"]:
        print(f" - {c['code']}: {c['name']}")
    print("\nHero KPIs for 5000:")
    print(data["hero"])
    print("\nExec Summary KPIs for 5000:")
    print(data["execSummary"])
except Exception as e:
    import traceback
    traceback.print_exc()
    sys.exit(1)
