// doubao_batch.js - 豆包批量出图自动化 v3（优化版）
// 直接set value + dispatchEvent，秒级输入

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
    let current = null;
    let inCodeBlock = false;
    let promptText = '';
    
    for (const line of lines) {
        const headerMatch = line.match(/^####\s+【角色】(\d+)\.\s+(.+)/);
        if (headerMatch) {
            if (current && promptText) {
                current.fullPrompt = promptText.trim();
                entries.push(current);
            }
            current = { id: parseInt(headerMatch[1]), name: headerMatch[2].trim(), fullPrompt: '' };
            promptText = '';
            inCodeBlock = false;
            continue;
        }
        if (line.trim().startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
        if (inCodeBlock && current) promptText += line + '\n';
    }
    if (current && promptText) { current.fullPrompt = promptText.trim(); entries.push(current); }
    return entries;
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const req = https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.doubao.com/' },
            timeout: 30000
        }, (res) => {
            if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(filepath); });
        });
        req.on('error', (e) => { try { fs.unlinkSync(filepath); } catch(ex) {} reject(e); });
    });
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function inputPrompt(page, text) {
    // 直接通过 CDP 设置输入框内容 + 触发事件，瞬间完成
    await page.evaluate((t) => {
        // 查找可见的输入框
        const selectors = [
            '[contenteditable="true"]',
            'textarea',
            'div[contenteditable]',
            '[class*="input"] div[contenteditable]',
            '[class*="editor"]'
        ];
        let el = null;
        for (const sel of selectors) {
            const found = document.querySelector(sel);
            if (found && found.offsetParent !== null) { el = found; break; }
        }
        if (!el) {
            // 遍历所有元素找 contenteditable
            const all = document.querySelectorAll('*');
            for (const e of all) {
                if (e.isContentEditable && e.offsetParent !== null) { el = e; break; }
                if (e.tagName === 'TEXTAREA' && e.offsetParent !== null) { el = e; break; }
            }
        }
        if (el) {
            el.focus();
            // 如果是 contenteditable
            if (el.isContentEditable) {
                el.innerHTML = '';
                el.textContent = t;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                // 如果是 textarea/input
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(el, t);
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }, text);
    await sleep(500);
}

async function main() {
    const promptText = fs.readFileSync(PROMPT_FILE, 'utf-8');
    const allEntries = parsePrompts(promptText);
    console.log(`解析到 ${allEntries.length} 条`);
    
    let progress = { completed: [] };
    try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) {}
    const completedIds = new Set(progress.completed);
    const pending = allEntries.filter(e => !completedIds.has(e.id));
    
    if (pending.length === 0) { console.log('全部完成！'); return; }
    
    const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${CDP_PORT}` });
    let page = (await browser.pages()).find(p => p.url().includes('doubao.com/chat'));
    if (!page) { page = await browser.newPage(); await page.goto('https://www.doubao.com/chat/', { waitUntil: 'networkidle0' }); }
    await page.bringToFront();
    await sleep(2000);
    
    const startTime = Date.now();
    
    for (let i = 0; i < pending.length; i++) {
        const entry = pending[i];
        const waitTime = 60000 + Math.floor(Math.random() * 20001); // 60-80秒
        
        const elapsed = Math.round((Date.now() - startTime) / 60000);
        console.log(`\n[${i+1}/${pending.length}] ID ${entry.id}: ${entry.name.substring(0,30)} (已过 ${elapsed}min)`);
        
        try {
            // 秒级输入
            await inputPrompt(page, entry.fullPrompt);
            console.log(`  ✅ 已输入`);
            
            await sleep(800);
            // 按Enter发送
            await page.keyboard.press('Enter');
            console.log(`  ✅ 已发送，⏱ ${Math.round(waitTime/1000)}s...`);
            
            await sleep(waitTime);
            
            // 提取图片
            const imageUrls = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('img'))
                    .map(img => img.src || img.getAttribute('data-src') || '')
                    .filter(src => src.includes('byteimg') || src.includes('imagex'));
            });
            
            if (imageUrls.length === 0) {
                console.log(`  ⚠️ 再等20s...`);
                await sleep(20000);
                const retry = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('img'))
                        .map(img => img.src || img.getAttribute('data-src') || '')
                        .filter(src => src.includes('byteimg') || src.includes('imagex'));
                });
                if (retry.length === 0) {
                    console.log(`  ❌ 无图，跳过`);
                    continue;
                }
                imageUrls.push(...retry);
            }
            
            console.log(`  🖼 ${imageUrls.length} 张图`);
            
            const outDir = path.join(OUTPUT_DIR, String(entry.id).padStart(3, '0'));
            fs.mkdirSync(outDir, { recursive: true });
            
            let dlCount = 0;
            for (let vi = 0; vi < imageUrls.length; vi++) {
                const safeName = entry.name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
                const filepath = path.join(outDir, `${String(entry.id).padStart(3, '0')}_${safeName}_v${vi+1}.jpg`);
                try {
                    await downloadImage(imageUrls[vi], filepath);
                    const sizeKB = Math.round(fs.statSync(filepath).size / 1024);
                    console.log(`  ✅ v${vi+1} (${sizeKB}KB)`);
                    dlCount++;
                } catch(e) { console.log(`  ❌ v${vi+1}: ${e.message}`); }
            }
            
            if (!progress.completed.includes(entry.id)) progress.completed.push(entry.id);
            fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
            console.log(`  ✅ 完成 (${dlCount}/${imageUrls.length} 下载)`);
            
        } catch (err) {
            console.log(`  ❌ 错误: ${err.message}`);
        }
    }
    
    await browser.disconnect();
    const totalMin = Math.round((Date.now() - startTime) / 60000);
    console.log(`\n=== 全部完成！总耗时 ${totalMin} 分钟 ===`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
