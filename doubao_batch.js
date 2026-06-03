// doubao_batch.js - 豆包批量出图自动化 v2
// 连接已有Chrome CDP，自动填充提示词、等待生成、下载图片

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CDP_PORT = 18800;
const OUTPUT_DIR = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\doubao_output';
const PROMPT_FILE = 'D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\纯白素材提示词\\01-角色.md';
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'progress.json');

// 解析提示词文件
function parsePrompts(text) {
    const entries = [];
    const lines = text.split('\n');
    let current = null;
    let inCodeBlock = false;
    let promptText = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 匹配条目开头: #### 【角色】001. 铁锈带拾荒者·帆布斗篷型
        const headerMatch = line.match(/^####\s+【角色】(\d+)\.\s+(.+)/);
        if (headerMatch) {
            if (current && promptText) {
                current.fullPrompt = promptText.trim();
                entries.push(current);
            }
            current = {
                id: parseInt(headerMatch[1]),
                name: headerMatch[2].trim(),
                fullPrompt: ''
            };
            promptText = '';
            inCodeBlock = false;
            continue;
        }
        
        // 检测代码块开始/结束
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        
        // 在代码块内收集提示词
        if (inCodeBlock && current) {
            promptText += line + '\n';
        }
    }
    
    // 最后一个条目
    if (current && promptText) {
        current.fullPrompt = promptText.trim();
        entries.push(current);
    }
    
    return entries;
}

// 下载图片
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const proto = url.startsWith('https') ? https : http;
        const req = proto.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.doubao.com/'
            },
            timeout: 30000
        }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(filepath); });
        });
        req.on('error', (e) => {
            try { fs.unlinkSync(filepath); } catch(ex) {}
            reject(e);
        });
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    // 读取提示词文件
    const promptText = fs.readFileSync(PROMPT_FILE, 'utf-8');
    const allEntries = parsePrompts(promptText);
    console.log(`解析到 ${allEntries.length} 条提示词`);
    allEntries.forEach(e => console.log(`  ID ${e.id}: ${e.name.substring(0,30)}`));
    
    // 读取进度
    let progress = { completed: [] };
    try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) {}
    const completedIds = new Set(progress.completed);
    
    const pending = allEntries.filter(e => !completedIds.has(e.id));
    console.log(`已完成: ${completedIds.size}, 待处理: ${pending.length}`);
    
    if (pending.length === 0) {
        console.log('全部完成！');
        return;
    }
    
    // 连接Chrome
    const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${CDP_PORT}` });
    console.log('已连接到Chrome');
    
    const pages = await browser.pages();
    let page = pages.find(p => p.url().includes('doubao.com/chat'));
    if (!page) {
        page = await browser.newPage();
        await page.goto('https://www.doubao.com/chat/create-image', { waitUntil: 'networkidle0' });
    }
    await page.bringToFront();
    await sleep(3000);
    
    for (let i = 0; i < pending.length; i++) {
        const entry = pending[i];
        const waitTime = 60000 + Math.floor(Math.random() * 20000); // 60-80秒
        
        console.log(`\n[${i+1}/${pending.length}] ID ${entry.id}: ${entry.name}`);
        console.log(`  等待: ${Math.round(waitTime/1000)}s`);
        
        try {
            // 全选+删除 输入框内容
            await page.evaluate(() => {
                // 找到输入框并聚焦
                const inputs = document.querySelectorAll('[contenteditable="true"], textarea, [class*="input"], div[class*="editor"]');
                for (const el of inputs) {
                    if (el.offsetParent !== null) { // visible
                        el.focus();
                        break;
                    }
                }
            });
            await sleep(500);
            
            // 全选删除
            await page.keyboard.down('Control');
            await page.keyboard.press('A');
            await page.keyboard.up('Control');
            await sleep(200);
            await page.keyboard.press('Delete');
            await sleep(300);
            
            // 输入提示词
            await page.keyboard.type(entry.fullPrompt, { delay: 2 });
            console.log(`  已输入提示词，准备发送`);
            await sleep(1000);
            
            // 按Enter发送
            await page.keyboard.press('Enter');
            console.log(`  已发送，等待 ${Math.round(waitTime/1000)}s...`);
            
            await sleep(waitTime);
            
            // 提取图片URL
            const imageUrls = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('img'))
                    .map(img => img.src || img.getAttribute('data-src') || '')
                    .filter(src => src.includes('byteimg') || src.includes('imagex'));
            });
            
            if (imageUrls.length === 0) {
                console.log(`  ⚠️ 未找到图片，再等20s...`);
                await sleep(20000);
                const retryUrls = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('img'))
                        .map(img => img.src || img.getAttribute('data-src') || '')
                        .filter(src => src.includes('byteimg') || src.includes('imagex'));
                });
                if (retryUrls.length === 0) {
                    console.log(`  ❌ 仍无图片，截图检查`);
                    await page.screenshot({ path: path.join(OUTPUT_DIR, `error_${entry.id}.png`) });
                    continue;
                }
                imageUrls.push(...retryUrls);
            }
            
            console.log(`  生成 ${imageUrls.length} 张图`);
            
            // 下载
            const outDir = path.join(OUTPUT_DIR, String(entry.id).padStart(3, '0'));
            fs.mkdirSync(outDir, { recursive: true });
            
            let dlCount = 0;
            for (let vi = 0; vi < imageUrls.length; vi++) {
                const url = imageUrls[vi];
                const ext = '.jpg';
                const safeName = entry.name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
                const filename = `${String(entry.id).padStart(3, '0')}_${safeName}_v${vi+1}${ext}`;
                const filepath = path.join(outDir, filename);
                
                try {
                    await downloadImage(url, filepath);
                    const sizeKB = Math.round(fs.statSync(filepath).size / 1024);
                    console.log(`  ✅ v${vi+1} (${sizeKB}KB)`);
                    dlCount++;
                } catch(e) {
                    console.log(`  ❌ v${vi+1}: ${e.message}`);
                }
            }
            
            // 记录进度
            if (!progress.completed.includes(entry.id)) progress.completed.push(entry.id);
            fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
            console.log(`  ✅ 完成 (${dlCount}/${imageUrls.length} 下载)`);
            
        } catch (err) {
            console.log(`  ❌ 错误: ${err.message}`);
            await page.screenshot({ path: path.join(OUTPUT_DIR, `crash_${entry.id}.png`) }).catch(()=>{});
        }
    }
    
    await browser.disconnect();
    console.log('\n=== 全部完成 ===');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
