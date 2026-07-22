import subprocess

def main():
    res = subprocess.run(
        ["git", "diff", "backend/story_data.py"],
        cwd="c:/Users/ajala/Downloads/CFO PITTI/cfo_storybook",
        capture_output=True,
        text=True
    )
    # Output the diff lines in batches
    lines = res.stdout.splitlines()
    print(f"Total diff lines: {len(lines)}")
    for i in range(0, len(lines), 100):
        print(f"--- BATCH {i//100 + 1} ---")
        print("\n".join(lines[i:i+100]))

if __name__ == '__main__':
    main()
