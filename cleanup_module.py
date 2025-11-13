#!/usr/bin/env python3
"""
Clean up pandoc-mangled markdown files.
Removes link wrappers, span tags, and fixes structure.
"""
import re
import sys

def clean_markdown(content):
    """Clean up the markdown content."""
    
    # Remove [text](#Mod...) link wrappers
    content = re.sub(r'\[([^\]]+)\]\(#Mod[0-9]_[^\)]*\)', r'\1', content)
    
    # Remove <span> tags
    content = re.sub(r'<span[^>]*>', '', content)
    content = re.sub(r'</span>', '', content)
    
    # Fix image paths - change ./docs/media_temp2/media/ to ./media/
    content = re.sub(r'\./docs/media_temp2/media/', './media/', content)
    
    # Fix image paths - change ./media/media/ to ./media/
    content = re.sub(r'\./media/media/', './media/', content)
    
    # Remove link wrappers around images: [![](image.png)](#...) → ![](image.png)
    content = re.sub(r'\[!\[([^\]]*)\]\(([^\)]+)\)\]\([^\)]*\)', r'![\1](\2)', content)
    
    # Fix double numbered lists: "1. 1. " → "1. "
    content = re.sub(r'^(\d+)\.\s+\1\.\s+', r'\1. ', content, flags=re.MULTILINE)
    
    # Fix HTML img tags to markdown - basic conversion
    content = re.sub(r'<img src="([^"]+)"[^>]*/?>', r'![](\1)', content)
    
    return content

def main():
    """Read, clean, and write markdown file."""
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'module2_from_obsidian.md'
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'module2_cleaned_final.md'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    cleaned = clean_markdown(content)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(cleaned)
    
    print(f"✅ Cleaned {input_file} → {output_file}")
    print(f"   Original: {len(content)} chars")
    print(f"   Cleaned:  {len(cleaned)} chars")

if __name__ == "__main__":
    main()

