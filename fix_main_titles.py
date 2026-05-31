#!/usr/bin/env python3
"""Fix chapter title formatting in 主线"""
import os, re

root = r'D:\OpenClaw专属文件夹\A1\A1《白穹纪元：机械永生录》\03-小说正文\主线'

for f in sorted(os.listdir(root)):
    if not f.endswith('.md') or '章' not in f:
        continue
    
    path = os.path.join(root, f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Extract chapter number and title from filename
    # Format: 第XX章-标题名.md
    m = re.match(r'第(\d+)章-(.+)\.md', f)
    if not m:
        continue
    ch_num = m.group(1)
    ch_title = m.group(2)
    
    # Current: 白穹纪元：机械永生录第XX章标题名正文内容...
    # Target: 白穹纪元：机械永生录\n\n第XX章 标题名\n\n正文内容...
    
    # Find where the chapter header ends and body begins
    pattern1 = r'白穹纪元：机械永生录第{}章\s*{}?\s*'.format(ch_num, re.escape(ch_title))
    m2 = re.search(pattern1, content)
    
    if m2:
        # Found the compressed header
        header_end = m2.end()
        body_start = header_end
        new_header = '白穹纪元：机械永生录\n\n第{}章 {}\n\n'.format(ch_num, ch_title)
        body = content[body_start:]
        new_content = new_header + body
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        print('Fixed: {} → 第{}章 {}'.format(f, ch_num, ch_title))
    else:
        print('SKIP: {} - pattern not found'.format(f))

print('Done')
