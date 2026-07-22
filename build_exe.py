"""
Build script to package CFO Storybook as a single .exe

Usage:
    python build_exe.py

This script:
1. Copies the pre-built frontend (frontend/dist/) into backend/frontend_dist/
2. Runs PyInstaller to produce dist/CFO_Storybook.exe
"""

import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.join(ROOT, "backend")
FRONTEND = os.path.join(ROOT, "frontend")
FRONTEND_DIST = os.path.join(FRONTEND, "dist")
BUNDLED_DIST = os.path.join(BACKEND, "frontend_dist")


def step(msg):
    print(f"\n{'='*60}\n  {msg}\n{'='*60}")


def main():
    # ── 1. Build the React frontend ──────────────────────────────
    step("Building React frontend ...")
    if not os.path.isfile(os.path.join(FRONTEND, "package.json")):
        print("ERROR: frontend/package.json not found. Aborting.")
        sys.exit(1)

    subprocess.run(["npm", "run", "build"], cwd=FRONTEND, check=True, shell=True)

    if not os.path.isdir(FRONTEND_DIST):
        print("ERROR: frontend/dist/ was not created by 'npm run build'. Aborting.")
        sys.exit(1)

    # ── 2. Copy dist → backend/frontend_dist ─────────────────────
    step("Copying frontend build into backend/frontend_dist/ ...")
    if os.path.isdir(BUNDLED_DIST):
        shutil.rmtree(BUNDLED_DIST)
    shutil.copytree(FRONTEND_DIST, BUNDLED_DIST)
    print(f"  Copied {FRONTEND_DIST} -> {BUNDLED_DIST}")

    # ── 3. Run PyInstaller ───────────────────────────────────────
    step("Running PyInstaller ...")

    pyinstaller_args = [
        sys.executable, "-m", "PyInstaller",
        "--onefile",
        "--name", "CFO_Storybook",
        "--noconfirm",
        "--clean",
        # Bundle the frontend build as data
        "--add-data", f"{BUNDLED_DIST};frontend_dist",
        # Hidden imports that PyInstaller can't auto-detect
        "--hidden-import", "uvicorn.logging",
        "--hidden-import", "uvicorn.loops",
        "--hidden-import", "uvicorn.loops.auto",
        "--hidden-import", "uvicorn.protocols",
        "--hidden-import", "uvicorn.protocols.http",
        "--hidden-import", "uvicorn.protocols.http.auto",
        "--hidden-import", "uvicorn.protocols.websockets",
        "--hidden-import", "uvicorn.protocols.websockets.auto",
        "--hidden-import", "uvicorn.lifespan",
        "--hidden-import", "uvicorn.lifespan.on",
        "--hidden-import", "uvicorn.lifespan.off",
        "--hidden-import", "uvicorn",
        "--hidden-import", "fastapi",
        "--hidden-import", "starlette",
        "--hidden-import", "starlette.responses",
        "--hidden-import", "starlette.routing",
        "--hidden-import", "starlette.staticfiles",
        "--hidden-import", "starlette.middleware",
        "--hidden-import", "starlette.middleware.cors",
        "--hidden-import", "pydantic",
        "--hidden-import", "psycopg2",
        "--hidden-import", "story_data",
        "--hidden-import", "db",
        "--hidden-import", "offline_db",
        "--hidden-import", "pandas",
        "--hidden-import", "openpyxl",
        # Collect all submodules for these packages
        "--collect-submodules", "uvicorn",
        "--collect-submodules", "fastapi",
        "--collect-submodules", "starlette",
        "--collect-submodules", "pandas",
        "--collect-submodules", "openpyxl",
        # Console mode so we can see errors if something goes wrong
        "--console",
        # Entry point
        "app.py",
    ]

    subprocess.run(pyinstaller_args, cwd=BACKEND, check=True)

    # ── 4. Report result ─────────────────────────────────────────
    exe_path = os.path.join(BACKEND, "dist", "CFO_Storybook.exe")
    if os.path.isfile(exe_path):
        size_mb = os.path.getsize(exe_path) / (1024 * 1024)
        step(f"SUCCESS!  ->  {exe_path}  ({size_mb:.1f} MB)")
        print("  Double-click the .exe to launch the CFO Storybook dashboard.")
        print("  It will open your browser automatically.")
    else:
        step("ERROR: .exe was not created. Check the PyInstaller output above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
