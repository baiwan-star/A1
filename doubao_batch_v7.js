// doubao_batch_v7.js - 使用剪贴板粘贴（真正的一次性粘贴）+ Ctrl+V
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CDP_PORT = 18800;
const OUT = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\doubao_output';
const PROMPT_FILE = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\纯白素材提示词\\01-角色.md';
const PROGRESS = path.join(OUT, 'progress.json');

function parse(text) {
  const entries = [];
  const lines = text.split('\n');
  let cur = null, inCode = false, buf = '';
  for (const line of lines) {
    const m = line.match(/^####\s+【角色】(\d+)\.\s+(.+)/);
    if (m) {
      if (cur && buf) { cur.fullPrompt = buf.trim(); entries.push(cur); }
      cur = { id: parseInt(m[1]), name: m[2].trim(), fullPrompt: '' }; buf = ''; inCode = false; continue;
    }
    if (line.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (inCode && cur) buf += line + '\n';
  }
  if (cur && buf) { cur.fullPrompt = buf.trim(); entries.push(cur); }
  return entries;
}

function dl(url, fp) {
  return new Promise((ok, fail) => {
    const f = fs.createWriteStream(fp);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.doubao.com/' }, timeout: 30000 },
      r => { if (r.statusCode !== 200) { fail(new Error('HTTP ' + r.statusCode)); return; }
        r.pipe(f); f.on('finish', () => { f.close(); ok(); }); })
      .on('error', e => { try { fs.unlinkSync(fp); } catch(ex){} fail(e); });
  });
}

async function main() {
  const all = parse(fs.readFileSync(PROMPT_FILE, 'utf-8'));
  let prog = { completed: [1,2,3,4,5,6,7,8,9,10,11] };
  try { prog = JSON.parse(fs.readFileSync(PROGRESS, 'utf-8')); } catch(e) {}
  const done = new Set(prog.completed);
  const pending = all.filter(e => !done.has(e.id)).sort((a,b) => a.id - b.id);
  
  console.log(`待处理: ${pending.length} 条\n`);
  if (!pending.length) { console.log('全部完成！'); return; }
  
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${CDP_PORT}` });
  let page = (await browser.pages()).find(p => p.url().includes('doubao.com/chat') && !p.url().includes('worker'));
  if (!page) { page = await browser.newPage(); await page.goto('https://www.doubao.com/chat/', { waitUntil: 'networkidle0' }); }
  await page.bringToFront();
  
  // 点击图像生成按钮
  await page.evaluate(() => {
    for (const b of document.querySelectorAll('button'))
      if (b.textContent.includes('图像生成') && b.offsetParent !== null) { b.click(); return; }
  });
  await sleep(2500);
  
  const start = Date.now();
  
  for (let i = 0; i < pending.length; i++) {
    const e = pending[i];
    const wait = 40000 + Math.floor(Math.random() * 20001);
    const elapsed = Math.round((Date.now() - start) / 60000);
    
    console.log(`[${i+1}/${pending.length}] ID ${e.id}: ${e.name.substring(0,30)} (${elapsed}min)`);
    
    try {
      // 聚焦输入框
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('[contenteditable], textarea')) {
          if (el.offsetParent !== null) { el.focus(); if (el.isContentEditable) el.innerHTML = ''; return; }
        }
      });
      await sleep(300);
      
      // Ctrl+A + Delete 清空
      await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
      await sleep(100);
      await page.keyboard.press('Delete');
      await sleep(200);
      
      // 写入剪贴板
      await page.evaluate(async (t) => { await navigator.clipboard.writeText(t); }, e.fullPrompt);
      await sleep(300);
      
      // Ctrl+V 粘贴（真正的一次性粘贴，不会分段）
      await page.keyboard.down('Control'); await page.keyboard.press('V'); await page.keyboard.up('Control');
      
      console.log(`  ✅ 已粘贴 (${e.fullPrompt.length} chars)`);
      await sleep(800);
      
      // Enter发送
      await page.keyboard.press('Enter');
      console.log(`  ✅ 已发送 ⏱ ${Math.round(wait/1000)}s`);
      
      await sleep(wait);
      
      // 提取图片
      let urls = await page.evaluate(() => 
        Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s.includes('byteimg'))
      );
      
      if (!urls.length) {
        console.log(`  ⏳ 再等20s...`);
        await sleep(20000);
        urls = await page.evaluate(() => 
          Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s.includes('byteimg'))
        );
        if (!urls.length) { console.log(`  ❌ 无图, 跳过`); continue; }
      }
      
      console.log(`  🖼 ${urls.length}张`);
      
      const dir = path.join(OUT, String(e.id).padStart(3, '0'));
      fs.mkdirSync(dir, { recursive: true });
      
      let ok = 0;
      for (let v = 0; v < urls.length; v++) {
        const n = e.name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
        const fp = path.join(dir, `${String(e.id).padStart(3,'0')}_${n}_v${v+1}.jpg`);
        try { await dl(urls[v], fp); ok++; } catch(ex) { console.log(`  ❌ v${v+1}`); }
      }
      
      if (!prog.completed.includes(e.id)) prog.completed.push(e.id);
      fs.writeFileSync(PROGRESS, JSON.stringify(prog));
      console.log(`  ✅ ${ok}/${urls.length}`);
      
    } catch(err) {
      console.log(`  ❌ ${err.message}`);
    }
    console.log();
  }
  
  await browser.disconnect();
  console.log(`=== 完成！${Math.round((Date.now()-start)/60000)}min ===`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
main().catch(e => { console.error('FATAL:', e); process.exit(1); });
