import sys
sys.path.append(r"c:\Users\ajala\Downloads\CFO PITTI\cfo_storybook\backend")
from story_data import _get_live_kpis

entities = ["1000", "2000", "3000", "4000", "5000"]
items = []

for e in entities:
    pl, bs = _get_live_kpis(e)
    for cat in pl:
        for p in ["mtd", "qtd", "ytd"]:
            items.append((f"{e}_{cat}_{p}", pl[cat][p]))

print(f"Total detailed items to check: {len(items)}")

# Let's search for subsets that sum to exactly 1965.44
# Since checking all 2^120 combinations is impossible, let's look for combinations of:
# YTD values only! 5 entities * 8 categories = 40 items.
ytd_items = [x for x in items if x[0].endswith("_ytd")]
print(f"YTD items: {len(ytd_items)}")

# We can search combinations of YTD items
import itertools
target = 1965.44
found = False

# We can do a quick search using dynamic programming or subset sum or search up to size 8
for r in range(1, 15):
    print(f"Checking size {r}...")
    for subset in itertools.combinations(ytd_items, r):
        s = sum(x[1] for x in subset)
        if abs(s - target) < 0.01:
            print("FOUND COMBINATION:")
            for name, val in subset:
                print(f"  {name}: {val:.4f}")
            print(f"Total: {s:.4f}")
            found = True
            break
    if found:
        break
