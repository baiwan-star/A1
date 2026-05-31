#!/usr/bin/env node
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = '柏万';
pres.title = '白穹纪元：机械永生录 — 路演';

const C = {
  bg:       '1A1A1A',
  amber:    'D4A040',
  green:    '4CAF50',
  text:     'E8E0D4',
  textMute: '888888',
  accent:   'CC6633',
  card:     '222222',
};

function addSlideNum(slide, num) {
  slide.addText(String(num), {
    x: 9.2, y: 5.2, w: 0.6, h: 0.35,
    fontSize: 10, color: C.textMute, align: 'right', fontFace: 'Courier New'
  });
}

// SLIDE 1: 封面
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.5, w: 9, h: 4.625, line: { color: C.amber, width: 1.5 }, fill: { color: C.bg } });
  s.addText('白穹纪元', { x: 0.5, y: 1.5, w: 9, h: 0.6, fontSize: 14, color: C.green, fontFace: 'Courier New', charSpacing: 6, align: 'center' });
  s.addText('机械永生录', { x: 0.5, y: 2.0, w: 9, h: 1.0, fontSize: 42, color: C.amber, fontFace: 'Arial', bold: true, align: 'center' });
  s.addText('真空管电子机械赛博朋克 · 叙事驱动型 RPG', { x: 0.5, y: 3.0, w: 9, h: 0.5, fontSize: 14, color: C.text, fontFace: 'Arial', align: 'center' });
  s.addShape(pres.shapes.LINE, { x: 2, y: 4.5, w: 6, h: 0, line: { color: C.green, width: 0.5 } });
  s.addText('[ 概念图待补充 ]', { x: 3, y: 4.8, w: 4, h: 0.3, fontSize: 8, color: C.textMute, fontFace: 'Courier New', align: 'center' });
}

// SLIDE 2: 一句话简介
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('在精密运转的永恒秩序下目睹个体被无声碾碎的无力感', { x: 0.8, y: 1.2, w: 8.4, h: 1.2, fontSize: 22, color: C.text, fontFace: 'Arial', align: 'center', italic: true });
  s.addText('永生只是谎言，自由只是幻觉，反抗的尽头是空壳。', { x: 0.8, y: 2.6, w: 8.4, h: 1.0, fontSize: 18, color: C.amber, fontFace: 'Arial', align: 'center' });
  s.addShape(pres.shapes.LINE, { x: 3, y: 4.2, w: 4, h: 0, line: { color: C.textMute, width: 0.5 } });
  addSlideNum(s, 2);
}

// SLIDE 3: 为什么是现在
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('WHY NOW', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('赛博朋克市场正处在一个同质化的疲劳期', { x: 0.5, y: 0.8, w: 9, h: 0.6, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const items = [
    ['品类验证', '赛博朋克2077 3000万份销量，品类已主流化'],
    ['审美窗口', '霓虹灯+纳米义体统治70年，市场渴望新视觉语言'],
    ['叙事需求', '极乐迪斯科500万份，叙事型游戏需求持续上升'],
    ['市场空白', '真空管电子机械美学，全球游戏市场零竞品'],
  ];
  items.forEach((item, i) => {
    const y = 1.7 + i * 0.85;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: y, w: 0.08, h: 0.6, fill: { color: C.amber } });
    s.addText(item[0], { x: 0.8, y: y, w: 2.5, h: 0.35, fontSize: 13, color: C.amber, fontFace: 'Arial', bold: true });
    s.addText(item[1], { x: 0.8, y: y + 0.3, w: 8, h: 0.3, fontSize: 11, color: C.text, fontFace: 'Arial' });
  });
  addSlideNum(s, 3);
}

// SLIDE 4: 世界观
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('WORLD', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('一个自洽、封闭、令人窒息的反乌托邦', { x: 0.5, y: 0.8, w: 9, h: 0.6, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const zones = [
    ['白穹城', '12亿人口', '极致秩序下的思想筛选工厂。积分制度驱动全民内卷'],
    ['铁锈带', '80亿人口', '残酷自由里的垃圾场与血汗工厂。帮派割据'],
    ['伊甸核心', '5000万空壳', '谎言包裹下的永生收容所与定期屠宰场'],
  ];
  zones.forEach((z, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x: x, y: 1.7, w: 2.9, h: 3.2, fill: { color: C.card }, line: { color: C.amber, width: 0.5 } });
    s.addText(z[0], { x: x + 0.2, y: 1.9, w: 2.5, h: 0.4, fontSize: 16, color: C.amber, fontFace: 'Arial', bold: true });
    s.addText(z[1], { x: x + 0.2, y: 2.3, w: 2.5, h: 0.3, fontSize: 10, color: C.green, fontFace: 'Courier New' });
    s.addText(z[2], { x: x + 0.2, y: 2.7, w: 2.5, h: 1.0, fontSize: 11, color: C.text, fontFace: 'Arial' });
    s.addText('[ 概念图待补充 ]', { x: x + 0.2, y: 3.8, w: 2.5, h: 0.9, fontSize: 8, color: C.textMute, fontFace: 'Courier New', align: 'center', valign: 'middle' });
  });
  addSlideNum(s, 4);
}

// SLIDE 5: 核心冲突
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('CORE CONFLICT', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('这个世界的残酷之处不在于暴力', { x: 0.5, y: 0.8, w: 9, h: 0.6, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const points = [
    '没有绝对的施暴者与被压迫者 —— 每个人都在主动维护困住自己的规则',
    '统合部不是恶棍 —— 它是资源约束下的极端理性管理者',
    '永生者的维持成本超过新人口产出，二十年一次的配给平衡程序',
    '最具摧毁性的不是压迫，是知道了真相后，绝大多数人选择沉默',
  ];
  points.forEach((p, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7 + i * 0.75, w: 0.06, h: 0.5, fill: { color: C.accent } });
    s.addText(p, { x: 0.8, y: 1.7 + i * 0.75, w: 8.5, h: 0.5, fontSize: 13, color: C.text, fontFace: 'Arial' });
  });
  s.addText('核心主题：理解但不认同', { x: 0.5, y: 4.6, w: 9, h: 0.5, fontSize: 15, color: C.amber, fontFace: 'Arial', bold: true, align: 'center' });
  addSlideNum(s, 5);
}

// SLIDE 6: 小说
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('NOVEL', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('74章 50万字 已全部完成', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  s.addShape(pres.shapes.LINE, { x: 0.5, y: 1.7, w: 9, h: 0, line: { color: C.amber, width: 2 } });
  ['前传', '12章 韩执的故事', C.green].forEach((t, i) => {
    s.addText(t, { x: 0.6, y: i === 0 ? 2.0 : 2.3, w: 2.5, h: 0.3, fontSize: i === 0 ? 10 : 9, color: i === 0 ? C.green : C.textMute, fontFace: 'Arial', bold: i === 0 });
  });
  ['主线', '50章 洛安的故事', C.amber].forEach((t, i) => {
    s.addText(t, { x: 3.6, y: i === 0 ? 2.0 : 2.3, w: 2.5, h: 0.3, fontSize: i === 0 ? 10 : 9, color: i === 0 ? C.amber : C.textMute, fontFace: 'Arial', bold: i === 0 });
  });
  ['后传', '12章 裂缝之后', C.accent].forEach((t, i) => {
    s.addText(t, { x: 8.1, y: i === 0 ? 2.0 : 2.3, w: 2.5, h: 0.3, fontSize: i === 0 ? 10 : 9, color: i === 0 ? C.accent : C.textMute, fontFace: 'Arial', bold: i === 0 });
  });
  const story = [
    '前传：韩执发现伊甸真相，加密芯片，被出卖，飞升成空壳',
    '主线：洛安距飞升92天发现同事被流放，追查真相，四十六秒全城播片，五比四改革',
    '后传：两年后五方格局，维拉追猎，洛安谈判，教育法案4:4',
  ];
  story.forEach((t, i) => s.addText(t, { x: 0.5, y: 2.9 + i * 0.6, w: 9, h: 0.5, fontSize: 11, color: C.text, fontFace: 'Arial' }));
  addSlideNum(s, 6);
}

// SLIDE 7: 游戏系统
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('GAME SYSTEMS', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('14个子系统已全部完成设计', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const systems = [
    '战斗系统', 'PVP系统', '制造采集', '任务链', '经济交易',
    '社交公会', '家园系统', '副本系统', '成就排行', '新手引导',
    '背包仓库', '成长系统', '装备系统', '运营活动',
  ];
  systems.forEach((sys, i) => {
    const x = 0.5 + (i % 5) * 1.85;
    const y = 1.7 + Math.floor(i / 5) * 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 1.7, h: 0.9, fill: { color: C.card }, line: { color: C.amber, width: 0.5 } });
    s.addText(sys, { x: x + 0.1, y: y + 0.25, w: 1.5, h: 0.4, fontSize: 11, color: C.amber, fontFace: 'Arial', bold: true, align: 'center' });
  });
  addSlideNum(s, 7);
}

// SLIDE 8: 当前状态
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('STATUS', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('文字设计阶段已全部完成', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const items = [
    ['小说（74章·50万字）', '100%', C.green],
    ['世界观设定（第四版）', '100%', C.green],
    ['游戏系统设计（14子系统）', '100%', C.green],
    ['任务设计（13主线+3DLC）', '100%', C.green],
    ['美术设计文字稿（11类）', '100%', C.green],
    ['概念视觉资产', '0%（待启动）', C.accent],
    ['Demo 原型', '0%（待启动）', C.accent],
  ];
  items.forEach((item, i) => {
    s.addText(item[0], { x: 0.5, y: 1.5 + i * 0.5, w: 6, h: 0.4, fontSize: 12, color: C.text, fontFace: 'Arial' });
    s.addText(item[1], { x: 7, y: 1.5 + i * 0.5, w: 2.5, h: 0.4, fontSize: 12, color: item[2], fontFace: 'Courier New', align: 'right', bold: true });
    if (i < items.length - 1) s.addShape(pres.shapes.LINE, { x: 0.5, y: 1.92 + i * 0.5, w: 9, h: 0, line: { color: C.card, width: 0.5 } });
  });
  addSlideNum(s, 8);
}

// SLIDE 9: 竞争定位
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('POSITIONING', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('我们不是另一个赛博朋克游戏', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const headers = ['', '白穹纪元', '赛博朋克2077', '极乐迪斯科'];
  const rows = [
    ['美学', '真空管电子机械', '霓虹+纳米', '写实油画风'],
    ['叙事比重', '核心', '重要', '核心'],
    ['战斗系统', '中度（PVE为主）', '重度', '无'],
    ['核心体验', '精密窒息·无力感', '超级英雄幻想', '内心思辨'],
  ];
  headers.forEach((h, i) => s.addText(h, { x: 0.3 + i * 2.4, y: 1.5, w: 2.2, h: 0.35, fontSize: 10, color: i === 1 ? C.amber : C.text, fontFace: 'Arial', bold: true, align: 'center' }));
  rows.forEach((row, ri) => row.forEach((cell, ci) => s.addText(cell, { x: 0.3 + ci * 2.4, y: 1.9 + ri * 0.7, w: 2.2, h: 0.5, fontSize: 10, color: ci === 1 ? C.amber : C.text, fontFace: 'Arial', align: 'center', valign: 'middle' })));
  s.addText('市场上不存在与白穹纪元正面竞争的同类产品', { x: 0.5, y: 4.8, w: 9, h: 0.4, fontSize: 13, color: C.green, fontFace: 'Arial', bold: true, align: 'center' });
  addSlideNum(s, 9);
}

// SLIDE 10: 商业化
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('BUSINESS MODEL', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('买断制 + 外观内购，不逼氪不数值', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const biz = [
    ['定价模式', '买断制 ¥68（标准版）/ ¥98（豪华版）'],
    ['内购设计', '仅外观类：装备涂装、义体外壳、家园装饰'],
    ['DLC扩展', '前传/后传剧情DLC + 世界拓展包'],
    ['禁区', '无抽卡 · 无通行证 · 无限时活动 · 无数值付费'],
  ];
  biz.forEach((b, i) => {
    s.addText(b[0], { x: 0.5, y: 1.6 + i * 0.7, w: 2.5, h: 0.4, fontSize: 12, color: C.amber, fontFace: 'Arial', bold: true });
    s.addText(b[1], { x: 3.2, y: 1.6 + i * 0.7, w: 6.3, h: 0.4, fontSize: 11, color: C.text, fontFace: 'Arial' });
  });
  s.addShape(pres.shapes.LINE, { x: 0.5, y: 4.3, w: 9, h: 0, line: { color: C.card, width: 1 } });
  s.addText('收入预估（第一年）', { x: 0.5, y: 4.5, w: 9, h: 0.4, fontSize: 14, color: C.text, fontFace: 'Arial', bold: true });
  s.addText('¥68x30万 + ¥98x15万 + DLC+内购 约4500万（保守估计）', { x: 0.5, y: 4.9, w: 9, h: 0.4, fontSize: 12, color: C.amber, fontFace: 'Arial' });
  addSlideNum(s, 10);
}

// SLIDE 11: 路线图
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('ROADMAP', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('12个月从概念到可玩原型', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  const phases = [
    ['M1-2', '概念视觉化', '全部概念图+风格指南', '10-20万'],
    ['M3-6', '垂直切片', '白穹城第一天+铁锈带第一天可玩', '50-80万'],
    ['M7-9', 'Alpha', '前传+主线前半完成度', '80-120万'],
    ['M10-11', 'Beta', '全线整合+测试', '50-80万'],
    ['M12', '上线', '优化+发行', '30-50万'],
  ];
  const fillPcts = [0.17, 0.33, 0.58, 0.83, 1.0];
  phases.forEach((p, i) => {
    const y = 1.5 + i * 0.75;
    s.addText(p[0], { x: 0.3, y: y, w: 1, h: 0.5, fontSize: 11, color: C.green, fontFace: 'Courier New', bold: true });
    s.addText(p[1], { x: 1.3, y: y, w: 1.8, h: 0.3, fontSize: 12, color: C.amber, fontFace: 'Arial', bold: true });
    s.addText(p[2], { x: 1.3, y: y + 0.28, w: 5.5, h: 0.22, fontSize: 9, color: C.textMute, fontFace: 'Arial' });
    s.addText(p[3], { x: 7.5, y: y, w: 2, h: 0.5, fontSize: 11, color: C.text, fontFace: 'Arial', align: 'right' });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.3, y: y + 0.1, w: 4, h: 0.3, fill: { color: C.card } });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.3, y: y + 0.1, w: 4 * fillPcts[i], h: 0.3, fill: { color: C.amber } });
  });
  s.addText('总计预算：约 220-350万', { x: 0.5, y: 5.0, w: 9, h: 0.3, fontSize: 12, color: C.green, fontFace: 'Arial', bold: true, align: 'center' });
  addSlideNum(s, 11);
}

// SLIDE 12: 团队与需求
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('TEAM & NEEDS', { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 10, color: C.green, fontFace: 'Courier New', charSpacing: 4 });
  s.addText('核心内容已由一人完成 · 等待商业驱动', { x: 0.5, y: 0.8, w: 9, h: 0.5, fontSize: 20, color: C.text, fontFace: 'Arial', bold: true });
  s.addText('已完成', { x: 0.5, y: 1.5, w: 4, h: 0.4, fontSize: 12, color: C.green, fontFace: 'Arial', bold: true });
  s.addText('正在寻找', { x: 5.5, y: 1.5, w: 4, h: 0.4, fontSize: 12, color: C.amber, fontFace: 'Arial', bold: true });
  s.addText('策划/编剧/世界主设 — 1人', { x: 0.5, y: 2.0, w: 4.5, h: 0.4, fontSize: 11, color: C.text, fontFace: 'Arial' });
  const needs = ['程序/技术合伙人', '概念美术师/AI美术协作', '音乐制作人（外包）', '种子投资（约20-30万）'];
  needs.forEach((n, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 2.0 + i * 0.5, w: 0.06, h: 0.35, fill: { color: C.accent } });
    s.addText(n, { x: 5.8, y: 2.0 + i * 0.5, w: 3.7, h: 0.35, fontSize: 12, color: C.text, fontFace: 'Arial' });
  });
  addSlideNum(s, 12);
}

// SLIDE 13: 联系方式
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
  s.addText('期待与您对话', { x: 0.5, y: 1.5, w: 9, h: 1.0, fontSize: 36, color: C.amber, fontFace: 'Arial', bold: true, align: 'center' });
  s.addText('[ 此处放联系方式 ]', { x: 0.5, y: 2.8, w: 9, h: 0.5, fontSize: 14, color: C.text, fontFace: 'Arial', align: 'center' });
  s.addShape(pres.shapes.LINE, { x: 3, y: 4.0, w: 4, h: 0, line: { color: C.green, width: 0.5 } });
  s.addText('故事已经写好了。现在，把它变成让人看得见的东西。', { x: 0.5, y: 4.3, w: 9, h: 0.5, fontSize: 11, color: C.textMute, fontFace: 'Arial', italic: true, align: 'center' });
  addSlideNum(s, 13);
}

const outPath = 'D:\\OpenClaw专属文件夹\\A1\\商业材料\\白穹纪元路演PPT.pptx';
pres.writeFile({ fileName: outPath })
  .then(() => console.log('OK: ' + outPath))
  .catch(err => console.error('ERROR:', err));
