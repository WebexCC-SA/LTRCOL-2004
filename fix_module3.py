#!/usr/bin/env python3
"""
Fix Module 3 structure - manual cleanup of pandoc issues.
"""

# Read the Obsidian source
with open('/Users/sckiewer/Documents/Obsidian/Cisco Live/LAB2651_Webex_Security_Lab_Guide.md', 'r') as f:
    lines = f.readlines()

# Extract Module 3 (lines 3521-4358, using 0-based indexing: 3520-4357)
module3_lines = lines[3520:4357]

# Join and clean
content = ''.join(module3_lines)

import re

# Remove ALL link wrappers [text](#...)
content = re.sub(r'\[([^\]]+)\]\(#[^\)]*\)', r'\1', content)

# Remove span tags
content = re.sub(r'<span[^>]*>', '', content)
content = re.sub(r'</span>', '', content)

# Fix image paths
content = re.sub(r'\./media/media/', './media/', content)

# Remove link wrappers around images
content = re.sub(r'\[!\[([^\]]*)\]\(([^\)]+)\)\]\([^\)]*\)', r'![\1](\2)', content)

# Fix double numbered lists
content = re.sub(r'^(\d+)\.\s+\1\.\s+', r'\1. ', content, flags=re.MULTILINE)

# Fix HTML img tags
content = re.sub(r'<img src="([^"]+)"[^>]*/?>', r'![](\1)', content)

# Fix the concatenated TOC sections  
toc_section = """
i. [Generating User Data for Compliance in Meetings](#generating-user-data-for-compliance-in-meetings)

ii. [Provision users and enable recording for Webex Calling for data compliance](#provision-users-and-enable-recording-for-webex-calling-for-data-compliance)

iii. [Explore Compliance Options for Webex Meetings in Theta Lake](#explore-compliance-options-for-webex-meetings-in-theta-lake)

iv. [Explore Compliance Options for Webex Calling in Theta Lake](#explore-compliance-options-for-webex-calling-in-theta-lake)

v. [Schedule an End-to-End Encrypted Meeting](#schedule-an-end-to-end-encrypted-meeting)

vi. [Features in an End-to-End Encrypted Meeting](#features-in-an-end-to-end-encrypted-meeting)

vii. [Audio and Visual Watermarking and Watermark Analysis](#audio-and-visual-watermarking-and-watermark-analysis)
"""

# Replace the mangled TOC
content = re.sub(
    r'i\.\s+\nii\.\s+\niii\.\s+\niv\.\s+\nv\.\s+\nvi\.\s+\nvii\.\s+\n\n.*?(?=\n## )',
    toc_section + '\n',
    content,
    flags=re.DOTALL
)

# Write output
with open('docs/module2_zero_trust_encryption.md', 'w') as f:
    f.write(content)

print("✅ Module 3 cleaned and saved to docs/module2_zero_trust_encryption.md")
print(f"   {len(content)} characters written")

