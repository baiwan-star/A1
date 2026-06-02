# 白穹纪元 · 音效提示词标准格式规范

> 版本：1.0 | 用途：供 batch-sfx-generator Skill 解析，也可人工阅读
> 遵循此规范的提示词文件可直接被脚本提取关键信息生成音频

---

## 一、文件头元信息

每个提示词文件开头必须包含元信息块，脚本从这里读取全局配置：

```markdown
# [文档标题]

> type: sfx
> model: small-sfx
> sample_rate: 44100
> negative: music, melody, singing, speech, voice, harmonic, rhythmic
```

| 字段 | 必填 | 说明 | 可选值 |
|:---|:---:|:---|:---|
| `type` | ✅ | 提示词类型 | `sfx` / `bgm` / `tts` |
| `model` | ✅ | 目标模型 | `small-sfx` / `small-music` / `medium` |
| `sample_rate` | ❌ | 输出采样率，默认44100 | 任意整数 |
| `negative` | ✅ | 全局Negative prompt | 英文逗号分隔 |

---

## 二、分类标题

用 `##` 二级标题标记场景分类，脚本自动将其作为输出子目录名：

```markdown
## 白穹城

（该分类下的所有条目...）

## 铁锈带

（该分类下的所有条目...）
```

**规则：**
- 一个 `##` 开始一个分类
- 分类名直接用作生成文件的子目录名
- 下一个 `##` 或文件结束表示当前分类结束

---

## 三、单条提示词模板

```markdown
### 001. 白穹城-门禁刷卡成功
**prompt:** Short metallic beep, card reader accept tone, single crisp note, electronic circuit click
**duration:** 0.5
**source:** 第03章《韩序的公寓》——"他刷卡通过门禁"
```

| 字段 | 必填 | 说明 | 格式 |
|:---|:---:|:---|:---|
| `### NNN. 中文名` | ✅ | 编号 + 输出文件名 | `### 001. 场景-事件名` |
| `**prompt:**` | ✅ | 英文提示词 | 纯英文，逗号分隔词组 |
| `**duration:**` | ✅ | 目标时长（秒） | 数字，最小0.5 |
| `**source:**` | ❌ | 出处引用 | 自由文本，记录到报告 |

**额外可选字段（脚本忽略，仅人工参考）：**
- `**style:**` — 风格标签
- `**note:**` — 备注说明

---

## 四、BGM提示词模板（type: bgm 时使用）

```markdown
### 001. 白穹城-积分筛选区晨间
**prompt:** [Atmosphere] Early morning in White Dome City, just after curfew lifts. A single deep pipe organ note sustains in C major. [Instruments] Distant steam pipe hiss, warm vacuum tube amplifier hum. [Texture] Mechanical shutters opening, uniform footsteps on concrete. [Emotion] Quiet order, uneasy peace.
**duration:** 180
**style:** ambient, dark ambient, drone, mechanical, cinematic
**source:** 音频总纲 · 白穹城积分筛选区
```

`**duration:**` 为秒数（3分钟 = 180）

---

## 五、完整文件示例

```markdown
# 白穹纪元 · 场景音效提示词

> type: sfx
> model: small-sfx
> sample_rate: 44100
> negative: music, melody, singing, speech, voice, rhythmic

---

## 白穹城

### 001. 白穹城-门禁刷卡成功
**prompt:** Short metallic beep, card reader accept tone, single crisp note
**duration:** 0.5
**source:** 第03章《韩序的公寓》

### 002. 白穹城-门禁刷卡失败
**prompt:** Rejected access tone, low buzzer beep, magnetic lock refusal
**duration:** 0.8
**source:** 第04章《标准人生》

### 003. 白穹城-管道热胀冷缩咔嗒
**prompt:** Brass pipe thermal expansion click, hollow metal pinging, echoing within wall cavity
**duration:** 1
**source:** 第03章《韩序的公寓》——"天花板上的黄铜管道以十几秒一次的频率发出轻微的咔嗒声"

---

## 铁锈带

### 070. 铁锈带-废土风声
**prompt:** Harsh wind blowing across rusted metal debris, scrap metal rattling, low atmospheric drone
**duration:** 6
**source:** 第14章《黑色通道》
```

---

## 六、解析规则（供脚本参考）

| 提取目标 | 正则 / 方法 |
|:---|:---|
| 元信息 `> key: value` | `^> (\w+):\s*(.+)$` |
| 分类标题 | `^## (.+)` |
| 条目编号+名称 | `^### (\d+)\.\s*(.+)$` |
| prompt | 匹配 `**prompt:**` 后的整行内容 |
| duration | 匹配 `**duration:**` 后的数字 |
| source | 匹配 `**source:**` 后的内容 |

**解析流程：**
1. 读文件头，提取 `type` / `model` / `negative` 等全局配置
2. 逐行扫描，遇到 `##` 切换分类
3. 遇到 `### NNN.` 开始新条目
4. 提取各字段直到遇到下一个 `###` 或 `##` 或文件结束
5. 输出结构化任务列表
