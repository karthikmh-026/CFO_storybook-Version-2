import subprocess

def main():
    res = subprocess.run(
        ["git", "diff", "backend/story_data.py"],
        cwd="c:/Users/ajala/Downloads/CFO PITTI/cfo_storybook",
        capture_output=True,
        text=True
    )
    lines = res.stdout.splitlines()
    print("Total diff lines:", len(lines))
    
    # Print lines that contain "-" or "+" around "get_deep_dive_cash"
    in_cash = False
    for line in lines:
        if "def get_deep_dive_cash" in line:
            in_cash = True
        if in_cash and line.startswith("def get_deep_dive_ratios"):
            in_cash = False
            
        if in_cash:
            print(line)

if __name__ == '__main__':
    main()
