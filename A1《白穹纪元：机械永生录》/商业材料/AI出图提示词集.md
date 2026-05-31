# 白穹纪元 · AI 出图提示词集

> 目标模型：Flux.1-dev / SDXL
> 推荐尺寸：角色 3:4（768×1024），场景 16:9（1344×768）
> ComfyUI 参数参考：Steps 20-30, CFG 3.5-5, DPM++ 2M Karras

---

## 一、核心风格提示词（所有图前面都加这个）

### Flux 版（推荐）
```
vacuum tube electronic cyberpunk, exposed brass gears and hydraulic tubes,
CRT monitors with green scanlines, steam pipes and riveted metal panels,
dieselpunk machinery, industrial wasteland, retro futuristic technology,
photorealistic, cinematic lighting, volumetric fog, highly detailed,
texture of oxidized copper and tarnished brass, warm amber and cool steel
```

### SDXL 版
```
mechanical cyberpunk, vacuum tube aesthetic, brass and copper machinery,
steampunk industrial, CRT screens, hydraulic pistons, exposed gears,
rusty metal texture, cinematic lighting, photorealistic, 8k,
retro futuristic, intricate mechanical details, oxidized metal surface
```

### 🚫 通用 Negative Prompt
```
biopunk, nanopunk, sleek minimalist, neon glow, hologram, 
cyberpunk 2077 style, night city, mirrorshades, leather trenchcoat,
wireless technology, smooth plastic surfaces, LED strips, 
futuristic minimalist, alien, organic growth, slime, bone,
glowing blue energy, energy shield, laser weapon, magic, fantasy
```

---

## 二、角色提示词

### 1. 洛安（数据审核员 / 主角）
```
a middle-aged man in gray standard-issue office uniform with a gear-shaped
badge on left chest, short neat hair, clean-shaven, thin lips, neutral
expression, deep brown eyes with a calm scrutinizing gaze, standing in
a cramped standardized apartment, CRT terminal on desk with green text display,
left wrist wearing a titanium alloy bracelet terminal, dim fluorescent
ceiling lights, beige metal walls with exposed pipe conduits,
vacuum tube electronic cyberpunk, photorealistic, cinematic portrait加亚洲面孔，全身像
```

### 2. 韩序（被流放的同事）
```
a man in slightly disheveled gray uniform, late 30s, short hair with a
few strands out of place, thoughtful expression with a hint of stubbornness,
standing in a dimly lit apartment with books scattered on a metal desk,
open book on old world civilization, CRT terminal displaying news broadcast,
tired but alert eyes, warm ambient light from monitor glow,
vacuum tube electronic cyberpunk, photorealistic portrait加亚洲面孔，全身像
```

### 3. 韩执（神经接驳者 / 韩序的哥哥）
```
a man in his late 40s with gray-streaked short hair, shaved head with
dozens of exposed brass neural interface ports on the back and temples,
brass data cables connecting to a portable CRT terminal on his back,
thin face with deep eye creases from long-term neural connection,
wearing a gray maintenance engineer uniform, sitting in a cramped
terminal room with a round porthole window showing gray sky,
green data stream reflecting in his pupils, dim industrial lighting,
vacuum tube electronic cyberpunk, photorealistic portrait, intimate加亚洲面孔，全身像
```

### 4. 铁砧（废铁机械师）
```
a rugged middle-aged man with 70% mechanical body replacement,
visible brass and steel prosthetics with welding scars and rust stains,
one eye replaced by a small CRT display showing schematics,
face scarred from years of welding and metal work, wearing a heavy
leather apron covered in oil and burn marks, tool belt around waist
with wrenches and pliers, standing in a dimly lit workshop filled with
scrap metal and machinery, blue arc welding light casting dramatic shadows,
vacuum tube electronic cyberpunk, gritty photorealistic portrait
```

### 5. 灰羽（锈网行者 / 黑客）
```
a slender figure in black work overalls with embedded copper mesh shielding,
anonymous CRT electronic mask covering face displaying green cryptic text,
fingers replaced with universal data interface ports, portable CRT terminal
hanging from neck, sitting in a hidden underground den filled with radio
equipment and tangled wires, multiple CRT screens displaying data streams,
dim emergency lighting, cluttered space with spare electronic parts,
vacuum tube electronic cyberpunk, mysterious atmosphere, photorealistic
```

### 6. 炎（觉醒者）
```
a severely thin woman in a white institutional hospital gown, barefoot,
early 30s but appearing older, pale skin with electroshock scars and
surgery marks on arms and neck, hollow but determined eyes showing both
trauma and unwavering will, short unkempt hair, frail body posture but
standing upright, dim industrial background with metal walls and pipes,
cold fluorescent light casting harsh shadows, clinical atmosphere,
vacuum tube electronic cyberpunk, haunting photorealistic portrait
```

### 7. 白袍（统合部改革派领袖）
```
a dignified middle-aged man in immaculate pure white uniform with gold
gear insignia, no mechanical implants visible, clean-shaven, composed
and thoughtful expression with tired eyes, silver-gray hair neatly combed,
standing in a stark white titanium office with panoramic window showing
CRT signal towers at sunset, warm amber light streaming through blinds,
minimalist but powerful atmosphere, political gravity,
vacuum tube electronic cyberpunk, cinematic photorealistic portrait
```

### 8. 审查官维拉（思想安全局）
```
a sharp-faced woman in her 40s, dark gray fitted uniform with strict
cut, no makeup, hair pulled back tightly, cold professional expression,
piercing analytical eyes, standing in a white-walled government corridor,
carrying a data folder, fluorescent strip lights casting flat even
light, no decoration on walls, institutional atmosphere, intimidating
but not villainous, competent and focused demeanor,
vacuum tube electronic cyberpunk, photorealistic portrait
```

---

## 三、场景提示词

### 1. 白穹城天际线（P0）
```
wide panoramic view of a sprawling industrial city under a gray overcast sky,
hundreds of identical gray modular apartment buildings stretching to horizon,
twelve massive CRT transmission towers with red blinking lights rising
above the skyline, the Central Unified Zone pyramid complex in the distance,
steam plumes rising from countless vents and smokestacks, uniform street
grid with empty symmetrical avenues, warm amber street lights just beginning
to glow, exposed pipe corridors running between buildings, oppressive
geometric precision, industrial scale, vacuum tube electronic cyberpunk,
cinematic wide shot, moody atmospheric perspective, photorealistic
```

### 2. 铁锈带废土（P0）
```
vast industrial wasteland under a brownish-red polluted sky, mountains of
scrap metal and industrial waste stretching to the horizon, abandoned
factory skeletons with rusted steel frames, silicon crystal grass glowing
faintly in the foreground, a distant steam train moving along rusted tracks,
pipes leaking steam and chemical runoff, toxic haze in the air, defunct
gears and machinery half-buried in waste, warm rust and amber color palette,
bleak atmosphere of decay and resilience, vacuum tube electronic cyberpunk,
cinematic establishing shot, atmospheric, photorealistic
```

### 3. 伊甸核心收容区（P1）
```
long white corridor lined with identical doors on both sides, sterile
clinical atmosphere, rows of life-support capsules containing motionless
human forms wearing plain white gowns, dim green emergency lighting,
the only sound implied by silence, overhead fluorescent tubes flickering
occasionally, condensation on metal surfaces, a lone figure in white
standing at the far end with empty eyes, oppressive sense of quiet dread,
cold blue-green color palette, vacuum tube electronic cyberpunk,
haunting cinematic shot, photorealistic
```

### 4. 铁砧工坊（P1）
```
cluttered mechanical workshop lit by blue welding arc, walls covered in
hanging tools and scrap parts, a large workbench with an engine block
disassembled, chains hanging from ceiling, hydraulic press in corner,
oil-stained concrete floor covered in metal shavings, shelves of salvaged
components, steam pipes running along ceiling, warm glow from a furnace
in the background, a half-finished mechanical arm on the bench,
organized chaos of a working-class mechanic, gritty industrial atmosphere,
vacuum tube electronic cyberpunk, dramatic lighting, photorealistic
```

### 5. 中立区（P2）
```
a makeshift settlement built from salvaged materials at the edge of the wasteland,
patchwork buildings with corrugated metal roofs weighed down by stones,
a central square with a hand-painted wooden sign reading FIRST CANTEEN,
lanterns hanging from wires strung between buildings, small vegetable
plots behind houses, a water collection tower cobbled from old pipes,
people in worn clothing going about daily life, no uniform color scheme,
organic messy architecture, hopeful but fragile atmosphere, golden hour
warm light, photorealistic, vacuum tube electronic cyberpunk
```

---

## 四、道具提示词

### 积分终端（CRT腕表 - P1）
```
extreme close-up of a titanium wristband terminal with a miniature CRT
display screen, green glowing digits showing 98500, brass rivets on strap,
wear marks from years of use, the screen has visible scanlines and slight
phosphor burn-in, cold fluorescent lighting reflected on glass surface,
photorealistic macro shot, vacuum tube electronic cyberpunk, detailed metal， pure white background, overall display, rendergraph
```  

### 黄铜数据芯片（P1）
```
extreme close-up of a brass data chip on a wooden workbench, rectangular
casing with visible circuit traces etched into the metal surface, warm
amber light reflecting off polished brass, connector pins at one end,
tiny screws at each corner, scratch marks on casing from handling,
photorealistic macro shot, shallow depth of field, vintage technology
```

---

## 五、ComfyUI 工作流提示

### 对于 Flux 模型：
```
采样器：euler
调度器：normal
Steps: 20-25
CFG: 3.5
分辨率：先低后高（建议512×768先看构图，再放大）
放大：用 4x-UltraSharp + upscale ×2
```

### 对于 SDXL 模型：
```
采样器：DPM++ 2M Karras
Steps: 25-30
CFG: 5-7
Refiner: 开启，在 0.8 步进时切换
放大：4x-UltraSharp + upscale ×2
```

### 统一风格技巧
1. 用 IP-Adapter 挂一张最满意的图当"风格锚点"，后续所有生成都引用它
2. 所有角色在同一光照条件下生成（暖光=铁锈带，冷光=白穹城）
3. 每张图跑 4 个变体，挑最好的 → img2img 精修 → upscale
