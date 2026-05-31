#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""白穹纪元 小说全线一致性扫描脚本"""
import os, re, glob
from collections import defaultdict

ROOT = r"D:\OpenClaw专属文件夹\A1\A1《白穹纪元：机械永生录》\03-小说正文"

KNOWN_PEOPLE = {
    "洛安", "韩序", "韩执", "铁砧", "灰羽", "炎", "白袍", "审查官维拉", "维拉",
    "老苗", "明", "郑副主任", "赵友根", "铁砧的学徒", "韩序的妻子", "韩序的邻居",
    "柯尔文", "赫连明", "维拉尔", "韩序妻子"
}
KNOWN_PLACES = {
    "白穹城", "铁锈带", "伊甸核心", "伊甸", "中央统合区", "积分筛选区",
    "工业配套区", "边境隔离墙带", "废弃工业带", "黑市交易枢纽", "帮派割据区",
    "中立区", "未规划保留区", "第37区", "第41区", "第22区", "F-17",
    "意识抽离中心", "无害化处理设施", "伊甸核心手术室", "空壳收容区"
}

results = []
chapter_map = {}

def check_file(path):
    rel = os.path.relpath(path, ROOT)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        results.append("[ERROR] 无法读取: %s - %s" % (rel, str(e)))
        return None, rel, None

    lines = content.split('\n')
    issues = []

    # Check empty/short
    if len(content.strip()) < 50:
        results.append("[WARN] 内容不足: %s (%d chars)" % (rel, len(content)))
        return content, rel, None

    # Chapter number
    ch_num = None
    for line in lines[:5]:
        m = re.search(r'第(\d+)章', line)
        if m:
            ch_num = int(m.group(1))
            break

    # Control chars
    weird = re.findall(r'[\u0000-\u0008\u000b\u000c\u000e-\u001f]', content)
    if weird:
        results.append("[WARN] 异常控制字符: %s (%d个)" % (rel, len(weird)))

    # Long paragraphs
    paras = [p for p in content.split('\n\n') if len(p.strip()) > 0]
    very_long = [p for p in paras if len(p) > 3000]
    if very_long:
        results.append("[INFO] 长段落: %s (%d段>3000字)" % (rel, len(very_long)))

    # Extract names
    found_ppl = [p for p in KNOWN_PEOPLE if p in content]
    found_plc = [p for p in KNOWN_PLACES if p in content]

    return content, rel, ch_num, found_ppl, found_plc

all_md = glob.glob(os.path.join(ROOT, '**', '*.md'), recursive=True)
print("找到 %d 个文件" % len(all_md))

for fp in sorted(all_md):
    result = check_file(fp)
    if result and len(result) == 5:
        _, rel, ch_num, _, _ = result
        if ch_num:
            chapter_map[ch_num] = rel

# Chapter sequence check
chapters_found = sorted(chapter_map.keys())
gaps = []
for i in range(1, max(chapters_found) + 1):
    if i not in chapter_map:
        gaps.append(i)

if gaps:
    results.append("[WARN] 章节缺失: 以下编号未找到 - %s" % str(gaps))

print("\n" + "="*60)
print("小说全线扫描结果")
print("="*60)

for r in results:
    print("  %s" % r)

print("\n" + "="*60)
print("扫描完成: %d 个文件" % len(all_md))
warn_count = len([r for r in results if '[WARN]' in r or '[ERROR]' in r])
print("发现问题: %d 个" % warn_count)
