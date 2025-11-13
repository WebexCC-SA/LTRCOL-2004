#!/usr/bin/env python3
"""
Combined MkDocs server and file watcher that works with atomic writes.
"""
import os
import sys
import time
import subprocess
import threading
from pathlib import Path
from datetime import datetime

DOCS_DIR = Path(__file__).parent / "docs"
LAST_MOD_TIMES = {}
CHECK_INTERVAL = 2  # Check every 2 seconds (more reliable on macOS)
server_process = None

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

def restart_server():
    """Restart the MkDocs server."""
    global server_process
    
    print(f"\n[{timestamp()}] 🔄 Change detected! Restarting server...")
    
    # Kill old server
    if server_process:
        try:
            server_process.terminate()
            server_process.wait(timeout=3)
        except:
            server_process.kill()
    
    # Start new server
    try:
        server_process = subprocess.Popen(
            ["mkdocs", "serve", "--dev-addr", "127.0.0.1:8000"],
            cwd=Path(__file__).parent,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        time.sleep(2)  # Give server time to start
        print(f"[{timestamp()}] ✅ Server restarted! Refresh your browser.")
    except Exception as e:
        print(f"[{timestamp()}] ❌ Error restarting server: {e}")

def watch_files():
    """Watch for file changes."""
    global LAST_MOD_TIMES
    
    # Initialize modification times
    for filepath in get_all_md_files():
        LAST_MOD_TIMES[str(filepath)] = get_mod_time(filepath)
    
    while True:
        time.sleep(CHECK_INTERVAL)
        changed = False
        
        # Check existing files for changes
        for filepath in get_all_md_files():
            filepath_str = str(filepath)
            current_mod_time = get_mod_time(filepath)
            
            if filepath_str not in LAST_MOD_TIMES:
                # New file
                print(f"[{timestamp()}] 📄 New file: {filepath.name}")
                LAST_MOD_TIMES[filepath_str] = current_mod_time
                changed = True
            elif current_mod_time and current_mod_time != LAST_MOD_TIMES.get(filepath_str):
                # Modified file
                print(f"[{timestamp()}] 📝 Changed: {filepath.name}")
                LAST_MOD_TIMES[filepath_str] = current_mod_time
                changed = True
        
        if changed:
            restart_server()

def main():
    """Start server and file watcher."""
    print(f"[{timestamp()}] 🚀 Starting MkDocs server with live reload...")
    print("📍 Server: http://127.0.0.1:8000")
    print("👀 Watching: docs/ directory")
    print("⚡ Checking for changes every 2 seconds (optimized for macOS)")
    print("\nPress Ctrl+C to stop\n")
    
    # Start initial server
    restart_server()
    
    # Start watching in main thread
    try:
        watch_files()
    except KeyboardInterrupt:
        print(f"\n[{timestamp()}] 👋 Shutting down...")
        if server_process:
            server_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()

