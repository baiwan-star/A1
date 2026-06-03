// doubao_batch_v9.js - 最终版：create-image页面直接innerHTML设置+Enter发送
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CDP_PORT = 18800;
const OUT = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\doubao_output';
const PROMPT_FILE = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\纯白素材提示词\\01-角色.md';
const PROGRESS = path.join(OUT, 'progress.json');
const CREATE_IMAGE = 'https://www.doubao.com/chat/create-image';

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

// 在create-image页面设置输入框内容
async function setInputText(page, text) {
  return await page.evaluate((t) => {
    // 找contenteditable输入框
    for (const el of document.querySelectorAll('[contenteditable]')) {
      if (el.offsetParent === null) continue;
      el.focus();
      el.innerHTML = '';
      el.innerHTML = t;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }, text);
}

async function getImages(page) {
  return await page.evaluate(() =>
    Array.from(document.querySelectorAll('img'))
      .map(i => i.src).filter(s => s.includes('byteimg') || s.includes('imagex'))
  );
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
  
  // 获取已有页面或新建
  let page = (await browser.pages()).find(p => p.url().includes('doubao.com'));
  if (!page) page = await browser.newPage();
  
  const start = Date.now();
  
  for (let i = 0; i < pending.length; i++) {
    const e = pending[i];
    const wait = 40000 + Math.floor(Math.random() * 20001);
    const elapsed = Math.round((Date.now() - start) / 60000);
    
    console.log(`[${i+1}/${pending.length}] ID ${e.id}: ${e.name.substring(0,30)} (${elapsed}min)`);
    
    try {
      // 导航到create-image页面（确保在图像生成模式）
      await page.goto(CREATE_IMAGE, { waitUntil: 'networkidle0', timeout: 15000 });
      await sleep(2000);
      
      // 设置提示词（直接innerHTML，一次到位，不分段）
      const ok = await setInputText(page, e.fullPrompt);
      if (!ok) { console.log(`  ❌ 找不到输入框`); continue; }
      console.log(`  ✅ 已设置 (${e.fullPrompt.length} chars)`);
      
      await sleep(1000);
      
      // Enter发送
      await page.keyboard.press('Enter');
      console.log(`  ✅ 已发送 ⏱ ${Math.round(wait/1000)}s`);
      
      await sleep(wait);
      
      // 图片提取
      let urls = await getImages(page);
      
      if (!urls.length) {
        console.log(`  ⏳ 再等20s...`);
        await sleep(20000);
        urls = await getImages(page);
        if (!urls.length) { console.log(`  ❌ 无图`); continue; }
      }
      
      console.log(`  🖼 ${urls.length}张`);
      
      const dir = path.join(OUT, String(e.id).padStart(3, '0'));
      fs.mkdirSync(dir, { recursive: true });
      
      let okCount = 0;
      for (let v = 0; v < urls.length; v++) {
        const n = e.name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
        const fp = path.join(dir, `${String(e.id).padStart(3,'0')}_${n}_v${v+1}.jpg`);
        try { await dl(urls[v], fp); okCount++; } catch(ex) { console.log(`  ❌ v${v+1}`); }
      }
      
      if (!prog.completed.includes(e.id)) prog.completed.push(e.id);
      fs.writeFileSync(PROGRESS, JSON.stringify(prog));
      console.log(`  ✅ ${okCount}/${urls.length}`);
      
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
