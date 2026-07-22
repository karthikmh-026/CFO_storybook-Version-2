import os
import sys
import threading
import webbrowser

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from story_data import get_company_codes, get_deep_dive, get_full_story, get_violation_detail


def _get_base_dir():
    """Return the base directory — handles both normal and PyInstaller-frozen modes."""
    if getattr(sys, "frozen", False):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))


BASE_DIR = _get_base_dir()
STATIC_DIR = os.path.join(BASE_DIR, "frontend_dist")

app = FastAPI(title="CFO Storybook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/story")
def story(entity: str = "ALL"):
    return get_full_story(entity)


@app.get("/api/companies")
def companies():
    return get_company_codes()


@app.get("/api/violation/{violation_id}")
def violation_detail(violation_id: int):
    detail = get_violation_detail(violation_id)
    if detail is None:
        raise HTTPException(status_code=404, detail="Violation not found")
    return detail


@app.get("/api/deepdive/{chapter}")
def deep_dive(chapter: str):
    detail = get_deep_dive(chapter)
    if detail is None:
        raise HTTPException(status_code=404, detail="Deep dive not found")
    return detail


# --- Serve the built React frontend ---
if os.path.isdir(STATIC_DIR):
    # Serve static assets (JS, CSS, images) under /assets
    assets_dir = os.path.join(STATIC_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Serve files in the public/ root (favicon, SVGs, etc.)
    app.mount("/static_root", StaticFiles(directory=STATIC_DIR), name="static_root")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Catch-all: serve index.html for any non-API route (React Router support)."""
        file_path = os.path.join(STATIC_DIR, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))


def _open_browser(port: int):
    """Open the dashboard after confirming the server is accepting requests."""
    import time
    import urllib.request
    url = f"http://127.0.0.1:{port}/api/companies"
    for _ in range(60):  # try for up to 30 seconds
        try:
            urllib.request.urlopen(url, timeout=2)
            break
        except Exception:
            time.sleep(0.5)
    webbrowser.open(f"http://127.0.0.1:{port}")


if __name__ == "__main__":
    port = int(os.environ.get("CFO_BACKEND_PORT", 8000))
    is_frozen = getattr(sys, "frozen", False)

    # Auto-open browser when running as an exe
    if is_frozen:
        threading.Thread(target=_open_browser, args=(port,), daemon=True).start()

    uvicorn.run(
        "app:app" if not is_frozen else app,
        host="127.0.0.1",
        port=port,
        reload=not is_frozen,
    )
