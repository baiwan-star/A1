#!/usr/bin/env python3
import re

with open('D:\\OpenClaw专属文件夹\\A1\\商业材料\\make_ppt.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all ASCII double-quote pairs inside JS strings that look like Chinese quotation marks
# Pattern: Chinese text surrounded by " " (these are inline quotes inside JS strings)
# Strategy: Use regex to find common patterns

# Replace all "Chinese text" patterns with 「Chinese text」
# This regex finds: 的"some chinese" or 的"some english"
# Or generally: non-quote char + " + chinese chars + " + non-quote char
# Be careful not to match JS string delimiters

lines = content.split('\n')
fixed_lines = []
for line in lines:
    # Find strings that start and end with a double quote that are JS delimiters
    # Then find internal double quotes that are used as Chinese quotation marks
    # Simple approach: replace known inline quotes
    
    # Replace patterns like: Chinese_char"Chinese_text"non_quote
    # This handles most cases of inline Chinese quotation marks inside JS strings
    
    # Pattern: inside a JS string literal, replace " that are preceded by a CJK char
    # and followed by CJK chars, with 「」
    
    # Actually, let's just do targeted replacements on the known problematic patterns
    
    fixed_lines.append(line)

# Actually, let me just process the entire content
# Find all instances where we have " followed by Chinese chars followed by "
# that are INSIDE a JS string (not the JS string delimiters themselves)

# Replace «配给平衡程序» style - these already use angle brackets from earlier

# The remaining issue is that some replacements didn't take effect.
# Let me check what's still there and handle each case specifically.

replacements = [
    # Core conflict slide
    (' "配给平衡程序"', '「配给平衡程序」'),
]

for old, new in replacements:
    content = content.replace(old, new)

# For anything remaining: find all "Chinese chars" patterns inside JS string context
# Replace them with 「」
# Pattern: (CJK or CJK_punctuation + " + CJK + ") or (、" + CJK + ")
# Or more generically: any " that is inside a JS string and not the string terminator

# Simple heuristic: replace "X" where X contains at least 2 CJK characters
def replace_inner_quotes(match):
    inner = match.group(1)
    return '「' + inner + '」'

# Pattern: after a CJK char, then ", then Chinese text (1-20 chars), then ", then after CJK char/punctuation
content = re.sub(
    r'([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])"([^"]{1,20})"([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef，。、；：])',
    r'\1「\2」\3',
    content
)

# Also handle patterns with spaces before the opening quote
content = re.sub(
    r'([\u4e00-\u9fff\u3000-\u303f]) "([^"]{1,20})"([\u4e00-\u9fff])',
    r'\1「\2」\3',
    content
)

with open('D:\\OpenClaw专属文件夹\\A1\\商业材料\\make_ppt.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('OK - fixed')
