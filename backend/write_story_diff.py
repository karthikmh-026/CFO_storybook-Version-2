import subprocess

def main():
    res = subprocess.run(
        ["git", "diff", "backend/story_data.py"],
        cwd="c:/Users/ajala/Downloads/CFO PITTI/cfo_storybook",
        capture_output=True
    )
    diff_text = res.stdout.decode('utf-8', errors='ignore')
    
    # Save it to a file
    with open("diff_story_data.txt", "w", encoding="utf-8") as f:
        f.write(diff_text)
    print("Diff saved to diff_story_data.txt")
    
    # Print lines that contain BSEG or lineage or febko or vdarl
    lines = diff_text.splitlines()
    for i, line in enumerate(lines):
        if any(term in line.lower() for term in ["bseg", "lineage", "febko", "vdarl"]):
            print(f"Line {i}: {line}")

if __name__ == '__main__':
    main()
