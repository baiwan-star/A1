// extract_batch.js - 提取剩余提示词并写入批量文本
const fs = require('fs');

const text = fs.readFileSync('D:\\OpenClaw专属文件夹\\A1\\A1《白穹纪元：机械永生录》\\待生成\\纯白素材提示词\\01-角色.md', 'utf-8');
const lines = text.split('\n');
let entries = [], current = null, inCode = false, promptText = '';

for (const line of lines) {
  const m = line.match(/^####\s+【角色】(\d+)\.\s+(.+)/);
  if (m) {
    if (current && promptText) { current.fullPrompt = promptText.trim(); entries.push(current); }
    current = { id: parseInt(m[1]), name: m[2].trim(), fullPrompt: '' };
    promptText = ''; inCode = false; continue;
  }
  if (line.trim().startsWith('```')) { inCode = !inCode; continue; }
  if (inCode && current) promptText += line + '\n';
}
if (current && promptText) { current.fullPrompt = promptText.trim(); entries.push(current); }

// IDs 7-50 (remaining)
const pending = entries.filter(e => e.id >= 7 && e.id <= 50);
console.log('Remaining prompts: ' + pending.length);

let batch = '# 白穹纪元角色素材 - 批量生成\n\n请为以下每个角色生成一张图片：\n\n';
for (const e of pending) {
  const lines = e.fullPrompt.split('\n');
  const pos = lines.filter(l => !l.startsWith('Negative:')).join(' ').trim();
  const neg = lines.filter(l => l.startsWith('Negative:')).join('');
  batch += '## ' + e.id + '. ' + e.name + '\n';
  batch += pos + '\n';
  batch += neg + '\n\n';
}

fs.writeFileSync('batch_prompts.txt', batch, 'utf-8');
console.log('Wrote ' + batch.length + ' chars to batch_prompts.txt');
console.log('First 100 chars:', batch.substring(0, 100));
