#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Convert business documents to PDF with Chinese font support."""

import os, re
from fpdf import FPDF

BIZ_DIR = r"D:\OpenClaw专属文件夹\A1\商业材料"
PROJ_DIR = r"D:\OpenClaw专属文件夹\A1\A1《白穹纪元：机械永生录》"
FONT_PATH = r"C:\Windows\Fonts\msyh.ttc"
FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"

class DocPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=20)
        self.add_font('CN', '', FONT_PATH, uni=True)
        self.add_font('CN', 'B', FONT_BOLD, uni=True)

    def header(self):
        if self.page_no() > 1:
            self.set_font('CN', '', 8)
            self.set_text_color(128,128,128)
            self.cell(0, 8, '白穹纪元：机械永生录', 0, 0, 'L')
            self.cell(0, 8, str(self.page_no()), 0, 1, 'R')
            self.line(10, 14, 200, 14)
            self.ln(5)

    def ftitle(self, title):
        self.set_font('CN', 'B', 16)
        self.set_text_color(180, 140, 60)
        self.ln(5)
        self.multi_cell(0, 10, title)
        self.ln(3)
        self.set_draw_color(180, 140, 60)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def h2(self, title):
        self.set_font('CN', 'B', 13)
        self.set_text_color(80, 80, 80)
        self.ln(3)
        self.multi_cell(0, 7, title)
        self.ln(2)

    def h3(self, title):
        self.set_font('CN', 'B', 11)
        self.set_text_color(60, 60, 60)
        self.ln(2)
        self.multi_cell(0, 6, title)
        self.ln(1)

    def p(self, text):
        self.set_font('CN', '', 9.5)
        self.set_text_color(40, 40, 40)
        # Handle tables: if text contains | table syntax, format differently
        if text.count('|') >= 3 and '---' not in text:
            self.set_font('CN', '', 8)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font('CN', '', 9.5)
        self.set_text_color(40, 40, 40)
        self.cell(6, 5.5, '', 0, 0)
        self.multi_cell(0, 5.5, '- ' + text)
        self.ln(1)

def md_to_pdf(md_path, pdf_path, title):
    pdf = DocPDF()
    pdf.add_page()
    pdf.ftitle(title)

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    in_table = False
    in_code = False
    code_text = []

    for raw in lines:
        s = raw.strip()

        # Skip front matter
        if s == '---' and not in_code:
            continue

        # Code block
        if s.startswith('```'):
            if in_code:
                in_code = False
                continue
            in_code = True
            continue
        if in_code:
            continue

        # Horizontal rule
        if re.match(r'^-{3,}$', s) and not in_code:
            pdf.set_draw_color(180, 180, 180)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(3)
            continue

        # Empty line
        if not s:
            pdf.ln(2)
            continue

        # Headers
        if s.startswith('### '):
            pdf.h3(s[4:])
        elif s.startswith('## '):
            pdf.h2(s[3:])
        elif s.startswith('# '):
            pdf.ftitle(s[2:])
        elif s.startswith('- ') or s.startswith('* '):
            pdf.bullet(s[2:])
        else:
            pdf.p(s)

    pdf.output(pdf_path)
    print(f'OK: {os.path.basename(pdf_path)}')

# ===== MAIN =====
files = [
    (os.path.join(BIZ_DIR, '商业计划书.md'), '商业计划书'),
    (os.path.join(BIZ_DIR, '竞品与市场分析.md'), '竞品与市场分析'),
    (os.path.join(BIZ_DIR, '投资人话术.md'), '投资人沟通话术'),
    (os.path.join(BIZ_DIR, '面试话术.md'), '面试沟通话术'),
    (os.path.join(PROJ_DIR, 'GDD-完整整合版.md'), '完整游戏策划案GDD'),
]

for md_path, title in files:
    if os.path.exists(md_path):
        pdf_name = title.replace(' ', '_').replace('(', '').replace(')', '') + '.pdf'
        pdf_path = os.path.join(BIZ_DIR, pdf_name)
        md_to_pdf(md_path, pdf_path, title)
    else:
        print(f'SKIP (not found): {os.path.basename(md_path)}')

print('\nAll PDFs generated!')
