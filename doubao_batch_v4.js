// doubao_batch_v4.js - 一次性粘贴+发送，等40-60秒，每张都是一次完整的粘贴-发送循环
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
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.doubao.com/' }, timeout: 30000 }, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(filepath); });
    });
    req.on('error', (e) => { try { fs.unlinkSync(filepath); } catch(ex) {} reject(e); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const text = fs.readFileSync(PROMPT_FILE, 'utf-8');
  const allEntries = parsePrompts(text);

  let progress = { completed: [1,2,3,4,5,6] };
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) {}
  const done = new Set(progress.completed);
  const pending = allEntries.filter(e => !done.has(e.id)).sort((a,b) => a.id - b.id);
  
  console.log(`待处理: ${pending.length} 条`);
  
  if (!pending.length) { console.log('全部完成！'); return; }
  
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${CDP_PORT}` });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('doubao.com'));
  await page.bringToFront();
  await sleep(2000);
  
  // 确保在图像生成模式
  await page.evaluate(() => {
    // 点击"图像生成"按钮确保模式正确
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.includes('图像生成') && b.offsetParent !== null) { b.click(); break; }
    }
  });
  await sleep(2000);
  
  const startTime = Date.now();
  
  for (let i = 0; i < pending.length; i++) {
    const e = pending[i];
    const waitMs = 40000 + Math.floor(Math.random() * 20001); // 40-60秒
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    
    console.log(`\n[${i+1}/${pending.length}] ID ${e.id} ${e.name.substring(0,30)} (已过${elapsed}min)`);
    
    try {
      // 直接粘贴所有内容到输入框（瞬间完成）
      const result = await page.evaluate((promptText) => {
        // 查找图像生成输入框
        const candidates = document.querySelectorAll('[contenteditable], textarea');
        let target = null;
        for (const el of candidates) {
          if (el.offsetParent !== null) {
            target = el;
            break;
          }
        }
        if (!target) return 'no input found';
        
        target.focus();
        
        if (target.isContentEditable) {
          target.innerHTML = '';
          target.textContent = promptText;
          target.dispatchEvent(new Event('input', { bubbles: true }));
          target.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
          setter.call(target, promptText);
          target.dispatchEvent(new Event('input', { bubbles: true }));
          target.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return 'ok';
      }, e.fullPrompt);
      
      console.log(`  粘贴: ${result}`);
      await sleep(500);
      await page.keyboard.press('Enter');
      console.log(`  已发送 ✓ ⏱ ${Math.round(waitMs/1000)}s`);
      
      await sleep(waitMs);
      
      // 提取图片
      const imageUrls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .map(img => img.src || img.getAttribute('data-src') || '')
          .filter(src => src.includes('byteimg') || src.includes('imagex'));
      });
      
      if (imageUrls.length === 0) {
        console.log(`  再等20s...`);
        await sleep(20000);
        const retryUrls = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img'))
            .map(img => img.src || img.getAttribute('data-src') || '')
            .filter(src => src.includes('byteimg') || src.includes('imagex'));
        });
        if (retryUrls.length === 0) { console.log(`  ❌ 无图`); continue; }
        imageUrls.push(...retryUrls);
      }
      
      console.log(`  🖼 ${imageUrls.length}张`);
      
      const outDir = path.join(OUTPUT_DIR, String(e.id).padStart(3, '0'));
      fs.mkdirSync(outDir, { recursive: true });
      
      let dlCount = 0;
      for (let vi = 0; vi < imageUrls.length; vi++) {
        const safeName = e.name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
        const fp = path.join(outDir, `${String(e.id).padStart(3, '0')}_${safeName}_v${vi+1}.jpg`);
        try {
          await downloadImage(imageUrls[vi], fp);
          const kb = Math.round(fs.statSync(fp).size / 1024);
          console.log(`  ✅ v${vi+1} (${kb}KB)`);
          dlCount++;
        } catch(err) { console.log(`  ❌ v${vi+1}: ${err.message}`); }
      }
      
      if (!progress.completed.includes(e.id)) progress.completed.push(e.id);
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
      console.log(`  ✅ ${dlCount}/${imageUrls.length}`);
      
    } catch(err) {
      console.log(`  ❌ 错误: ${err.message}`);
    }
  }
  
  await browser.disconnect();
  console.log(`\n=== 完成！总耗时 ${Math.round((Date.now()-startTime)/60000)} 分钟 ===`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
