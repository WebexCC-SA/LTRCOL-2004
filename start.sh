#!/bin/bash
# Quick launcher for MkDocs with auto-reload

cd "$(dirname "$0")"
source venv/bin/activate
python serve-with-watch.py

