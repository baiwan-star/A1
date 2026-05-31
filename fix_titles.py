#!/usr/bin/env python3
import os, re

base = r'D:\OpenClaw专属文件夹\A1\A1《白穹纪元：机械永生录》\03-小说正文\前传'

chapters = {
    '第01章-数据之眼.md': '01', '第02章-不该看的信号.md': '02',
    '第03章-暗流.md': '03', '第04章-白翼区的深夜.md': '04',
    '第05章-资源论的真相.md': '05', '第06章-数据盘.md': '06',
    '第07章-审查官的游戏.md': '07', '第08章-出卖.md': '08',
    '第09章-最后一条消息.md': '09', '第10章-飞升.md': '10',
    '第11章-空壳的视角.md': '11', '第12章-余波.md': '12'
}

title_names = {
    '01': '数据之眼', '02': '不该看的信号', '03': '暗流',
    '04': '白翼区的深夜', '05': '资源论的真相', '06': '数据盘',
    '07': '审查官的游戏', '08': '出卖', '09': '最后一条消息',
    '10': '飞升', '11': '空壳的视角', '12': '余波'
}

for fname, ch_num in chapters.items():
    path = os.path.join(base, fname)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()

    # Find the content after the chapter title
    # Pattern: 第{num}章 {name}\n\n
    pattern = r'第{}章\s+.+?\n\n'.format(ch_num)
    m = re.search(pattern, content)
    if m:
        # Find the correct title from the filename (before .md)
        title_from_file = fname.replace('第{}章-'.format(ch_num), '').replace('.md', '')
        
        header = '白穹纪元：机械永生录\n\n前传·神经接驳者——韩执的故事\n\n第{}章 {}\n\n'.format(ch_num, title_from_file)
        rest = content[m.end():]
        
        # Check if the header already has 白穹纪元 - if so, replace from there
        # Actually the content starts with the compressed text, so let me just
        # check what's before the 第{num}章 match
        before_chapter = content[:m.start()]
        
        new_content = header + rest
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        print('OK: {} → 第{}章 {}'.format(fname, ch_num, title_from_file))
    else:
        print('SKIP: {} - pattern not found'.format(fname))

print('Done')
