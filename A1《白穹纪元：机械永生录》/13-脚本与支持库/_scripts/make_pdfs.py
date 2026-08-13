#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Convert business documents to PDF with reportlab and Chinese CID font."""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from xml.sax.saxutils import escape

pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))

BIZ_DIR = r"D:\OpenClaw专属文件夹\A1\A1《白穹纪元：机械永生录》\14-商业材料"

body = ParagraphStyle(
    'body',
    fontName='STSong-Light',
    fontSize=9.5,
    leading=14,
    alignment=0,
    spaceAfter=2,
)
title_style = ParagraphStyle(
    'title',
    fontName='STSong-Light',
    fontSize=16,
    leading=22,
    spaceAfter=8,
)
h1_style = ParagraphStyle(
    'h1',
    fontName='STSong-Light',
    fontSize=14,
    leading=20,
    spaceBefore=6,
    spaceAfter=4,
)
h2_style = ParagraphStyle(
    'h2',
    fontName='STSong-Light',
    fontSize=12,
    leading=17,
    spaceBefore=5,
    spaceAfter=3,
)
h3_style = ParagraphStyle(
    'h3',
    fontName='STSong-Light',
    fontSize=10.5,
    leading=15,
    spaceBefore=4,
    spaceAfter=2,
)
bullet = ParagraphStyle(
    'bullet',
    parent=body,
    leftIndent=8,
)

def md_to_pdf(md_path, pdf_path, title):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=18*mm,
        rightMargin=18*mm,
        topMargin=18*mm,
        bottomMargin=18*mm,
        title=title,
    )
    story = [Paragraph(title, title_style), HRFlowable(width='100%', thickness=1, color='#B48C3C')]
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')
    for raw in lines:
        s = raw.strip()
        if not s:
            story.append(Spacer(1, 3))
            continue
        if s.startswith('### '):
            story.append(Paragraph(escape(s[4:]), h3_style))
        elif s.startswith('## '):
            story.append(Paragraph(escape(s[3:]), h2_style))
        elif s.startswith('# '):
            story.append(Paragraph(escape(s[2:]), h1_style))
        elif s.startswith('- ') or s.startswith('* '):
            story.append(Paragraph('• ' + escape(s[2:]), bullet))
        else:
            story.append(Paragraph(escape(s), body))
    doc.build(story)
    print(f'OK: {os.path.basename(pdf_path)}')

files = [
    ('商业计划书.md', '商业计划书'),
    ('竞品与市场分析.md', '竞品与市场分析'),
    ('投资人话术.md', '投资人沟通话术'),
    ('面试话术.md', '面试沟通话术'),
    ('GDD-完整整合版.md', '完整游戏策划案GDD'),
]

for md_name, title in files:
    md_path = os.path.join(BIZ_DIR, md_name)
    if os.path.exists(md_path):
        pdf_path = os.path.join(BIZ_DIR, title + '.pdf')
        md_to_pdf(md_path, pdf_path, title)
    else:
        print(f'SKIP (not found): {md_name}')

print('\nAll PDFs generated!')