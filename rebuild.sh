#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate
mkdocs build
echo "✅ Site rebuilt! Refresh your browser at http://127.0.0.1:8000"

