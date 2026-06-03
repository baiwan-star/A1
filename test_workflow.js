// test_workflow.js - 测试完整工作流
const p = require('puppeteer-core');

(async () => {
  const b = await p.connect({ browserURL: 'http://127.0.0.1:18800' });
  let page = (await b.pages()).find(pg => pg.url().includes('doubao.com'));
  if (!page) page = await b.newPage();

  // 去chat主页
  await page.goto('https://www.doubao.com/chat/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // 点击"图像生成"按钮
  const clicked = await page.evaluate(() => {
    for (const b of document.querySelectorAll('button'))
      if (b.textContent.includes('图像生成') && b.offsetParent !== null) { b.click(); return true; }
    return false;
  });
  console.log('图像生成按钮:', clicked);
  await new Promise(r => setTimeout(r, 3000));

  // 查看界面状态
  const state = await page.evaluate(() => {
    const info = { inputType: null, inputText: null, buttons: [] };
    for (const el of document.querySelectorAll('[contenteditable], textarea')) {
      if (el.offsetParent !== null) {
        info.inputType = el.tagName + ' contenteditable=' + el.isContentEditable;
        info.inputText = (el.textContent || el.value || '').substring(0, 80);
        break;
      }
    }
    // 找"生成"或发箭头按钮
    for (const b of document.querySelectorAll('button')) {
      if (!b.offsetParent) continue;
      const t = b.textContent.trim();
      if (t.includes('生成') || t === '' || t.includes('发送') || t === '↵') {
        info.buttons.push({ text: t.substring(0, 20), rect: b.getBoundingClientRect().x + ',' + b.getBoundingClientRect().y });
      }
    }
    return info;
  });
  console.log('界面状态:', JSON.stringify(state, null, 2));

  // 设置输入内容
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[contenteditable]')) {
      if (el.offsetParent === null) continue;
      el.focus();
      el.innerHTML = '';
      el.innerHTML = 'test robot arm on white background steampunk product photography 8k';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      break;
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  // 检查是否出现发送按钮
  const state2 = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
      .filter(b => b.offsetParent !== null)
      .map(b => b.textContent.trim().substring(0, 30));
    return btns;
  });
  console.log('输入后按钮:', JSON.stringify(state2));

  // 按Enter
  console.log('发送...');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 3000));
  console.log('URL:', page.url());

  await b.disconnect();
})().catch(e => console.log('Error:', e.message));
