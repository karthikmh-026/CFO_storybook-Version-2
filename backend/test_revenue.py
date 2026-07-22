"""Quick test to verify actual revenue from DB for 1000 and 4000."""
import sys
sys.path.insert(0, '.')
from story_data import _get_live_kpis, get_hero

print("=== Testing revenue computation ===\n")

for code in ["1000", "4000", "ALL", None]:
    pl, _ = _get_live_kpis(code)
    rev = pl["revenue"]["ytd"]
    other = pl["other_income"]["ytd"]
    label = code or "ALL(None)"
    print(f"{label:10s}  revenue_ytd = {rev:10.4f} Cr   other_income_ytd = {other:8.4f} Cr   TOTAL = {rev+other:.4f} Cr")

print("\n=== Hero payload ===")
h = get_hero()
print(f"revenueYtdCr = {h['revenueYtdCr']}")

print("\n=== Individual sums ===")
pl1, _ = _get_live_kpis("1000")
pl4, _ = _get_live_kpis("4000")
total = pl1["revenue"]["ytd"] + pl4["revenue"]["ytd"]
print(f"1000 revenue: {pl1['revenue']['ytd']:.4f} Cr")
print(f"4000 revenue: {pl4['revenue']['ytd']:.4f} Cr")
print(f"Sum:          {total:.4f} Cr")
