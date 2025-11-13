#!/usr/bin/env python3
"""
Custom file watcher for MkDocs that works with atomic writes on macOS.
This script monitors file modification times and triggers rebuilds.
"""
import os
import time
import subprocess
import sys
from pathlib import Path
from datetime import datetime

DOCS_DIR = Path(__file__).parent / "docs"
LAST_MOD_TIMES = {}
CHECK_INTERVAL = 1  # Check every 1 second

def timestamp():
    """Get current timestamp string."""
    return datetime.now().strftime("%H:%M:%S")

def get_all_md_files():
    """Get all markdown files in docs directory."""
    return list(DOCS_DIR.rglob("*.md"))

def get_mod_time(filepath):
    """Get modification time of a file."""
    try:
        return os.path.getmtime(filepath)
    except:
        return None

def rebuild_site():
    """Rebuild the MkDocs site."""
    print(f"\n[{timestamp()}] 🔄 Change detected! Rebuilding site...")
    try:
        result = subprocess.run(
            ["mkdocs", "build"],
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print(f"[{timestamp()}] ✅ Site rebuilt successfully!")
        else:
            print(f"[{timestamp()}] ❌ Build failed: {result.stderr}")
    except Exception as e:
        print(f"[{timestamp()}] ❌ Error rebuilding: {e}")

def watch():
    """Watch for file changes and rebuild."""
    print(f"[{timestamp()}] 👀 Watching for changes in docs/ directory...")
    print(f"   Checking every {CHECK_INTERVAL} second(s)")
    print("   Press Ctrl+C to stop\n")
    
    # Initialize modification times
    for filepath in get_all_md_files():
        LAST_MOD_TIMES[str(filepath)] = get_mod_time(filepath)
    
    try:
        while True:
            time.sleep(CHECK_INTERVAL)
            changed = False
            
            # Check existing files for changes
            for filepath in get_all_md_files():
                filepath_str = str(filepath)
                current_mod_time = get_mod_time(filepath)
                
                if filepath_str not in LAST_MOD_TIMES:
                    # New file
                    print(f"[{timestamp()}] 📄 New file detected: {filepath.name}")
                    LAST_MOD_TIMES[filepath_str] = current_mod_time
                    changed = True
                elif current_mod_time != LAST_MOD_TIMES[filepath_str]:
                    # Modified file
                    print(f"[{timestamp()}] 📝 File changed: {filepath.name}")
                    LAST_MOD_TIMES[filepath_str] = current_mod_time
                    changed = True
            
            if changed:
                rebuild_site()
                
    except KeyboardInterrupt:
        print(f"\n[{timestamp()}] 👋 Stopped watching for changes")
        sys.exit(0)

if __name__ == "__main__":
    # Activate virtual environment and watch
    watch()

