#!/bin/bash
# Generate PDF from MkDocs print page
# Make sure the MkDocs server is running first: ./serve-with-watch.py

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="${1:-LTRCOL-2004_Lab_Guide.pdf}"

echo "📄 Generating PDF: $OUTPUT_FILE"
echo "   (Make sure MkDocs server is running on http://127.0.0.1:8000)"

"$SCRIPT_DIR/venv/bin/weasyprint" "http://127.0.0.1:8000/print_page/" "$SCRIPT_DIR/$OUTPUT_FILE"

if [ -f "$SCRIPT_DIR/$OUTPUT_FILE" ]; then
    SIZE=$(ls -lh "$SCRIPT_DIR/$OUTPUT_FILE" | awk '{print $5}')
    echo "✅ PDF generated: $OUTPUT_FILE ($SIZE)"
else
    echo "❌ Failed to generate PDF"
fi
