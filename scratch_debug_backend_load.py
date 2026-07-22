import time
import sys
import os

sys.path.insert(0, os.path.abspath("backend"))

print("Importing story_data...")
start = time.time()
import story_data
print(f"story_data imported in {time.time() - start:.2f} seconds.")

print("Calling get_deep_dive('exec')...")
start = time.time()
try:
    res = story_data.get_deep_dive('exec')
    print(f"get_deep_dive finished in {time.time() - start:.2f} seconds.")
    print("Keys in result:", res.keys() if res else "None")
except Exception as e:
    print("Error calling get_deep_dive:", e)
