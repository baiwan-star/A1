// doubao_batch_v6.js - 最终简化版：用 type() 快速输入（1ms延迟），等40-60秒
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CDP_PORT = 18800;
const OUTPUT_DIR = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\doubao_output';
const PROMPT_FILE = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\纯白素材提示词\\01-角色.md';
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'progress.json');

function parsePrompts(text) {
  const entries = [];
  const lines = text.split('\n');
  let current = null, inCode = false, promptText = '';
  for (const line of lines) {
    const m = line.match(/^####\s+【角色】(\d+)\.\s+(.+)/);
    if (m) {
      if (current && promptText) { current.fullPrompt = promptText.trim(); entries.push(current); }
      current = { id: parseInt(m[1]), name: m[2].trim(), fullPrompt: '' }; promptText = ''; inCode = false; continue;
    }
    if (line.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (inCode && current) promptText += line + '\n';
  }
  if (current && promptText) { current.fullPrompt = promptText.trim(); entries.push(current); }
  return entries;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.doubao.com/' }, timeout: 30000 }, (res) => {
      if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => { try { fs.unlinkSync(filepath); } catch(ex) {} reject(e); });
  });
}

async function main() {
  const allEntries = parsePrompts(fs.readFileSync(PROMPT_FILE, 'utf-8'));
  let progress = { completed: [1,2,3,4,5,6] };
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) {}
  const done = new Set(progress.completed);
  const pending = allEntries.filter(e => !done.has(e.id)).sort((a,b) => a.id - b.id);
  
  console.log(`待处理: ${pending.length} 条\n`);
  if (!pending.length) { console.log('全部完成！'); return; }
  
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${CDP_PORT}` });
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('doubao.com/chat') && !p.url().includes('worker'));
  if (!page) { page = await browser.newPage(); await page.goto('https://www.doubao.com/chat/', { waitUntil: 'networkidle0' }); }
  await page.bringToFront(); await sleep(2000);
  
  const startTime = Date.now();
  
  for (let i = 0; i < pending.length; i++) {
    const e = pending[i];
    const waitMs = 40000 + Math.floor(Math.random() * 20001);
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    
    console.log(`[${i+1}/${pending.length}] ID ${e.id}: ${e.name.substring(0,30)} (${elapsed}min)`);
    
    try {
      // 聚焦并清空输入框
      await page.focus('[contenteditable], textarea');
      await sleep(200);
      await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
      await sleep(100);
      await page.keyboard.press('Delete');
      await sleep(300);
      
      // 快速输入提示词 (1ms延迟 ≈ 300ms 打完)
      await page.keyboard.type(e.fullPrompt, { delay: 1 });
      console.log(`  ✅ 输入完成`);
      
      await sleep(500);
      await page.keyboard.press('Enter');
      console.log(`  ✅ 已发送 ⏱ ${Math.round(waitMs/1000)}s`);
      
      await sleep(waitMs);
      
      // 提取图片
      let urls = await page.evaluate(() => 
        Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s.includes('byteimg') || s.includes('imagex'))
      );
      
      if (urls.length === 0) {
        console.log(`  ⏳ 再等20s...`);
        await sleep(20000);
        urls = await page.evaluate(() => 
          Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s.includes('byteimg') || s.includes('imagex'))
        );
        if (!urls.length) { console.log(`  ❌ 无图, 跳过`); continue; }
      }
      
      console.log(`  🖼 ${urls.length}张`);
      
      const dir = path.join(OUTPUT_DIR, String(e.id).padStart(3, '0'));
      fs.mkdirSync(dir, { recursive: true });
      
      let ok = 0;
      for (let v = 0; v < urls.length; v++) {
        const name = e.name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
        const fp = path.join(dir, `${String(e.id).padStart(3,'0')}_${name}_v${v+1}.jpg`);
        try { await downloadImage(urls[v], fp); ok++; } catch(ex) { console.log(`  ❌ v${v+1}`); }
      }
      
      if (!progress.completed.includes(e.id)) progress.completed.push(e.id);
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));
      console.log(`  ✅ ${ok}/${urls.length}`);
      
    } catch(err) {
      console.log(`  ❌ ${err.message}`);
    }
    console.log();
  }
  
  await browser.disconnect();
  console.log(`=== 完成！${Math.round((Date.now()-startTime)/60000)}min ===`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
main().catch(e => { console.error('FATAL:', e); process.exit(1); });
