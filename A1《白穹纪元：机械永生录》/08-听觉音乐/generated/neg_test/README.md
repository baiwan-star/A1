# Negative Prompt 测试报告
时间: 2026-06-03 00:36:13
模型: medium
Prompt: heavy metal door creaking open, rusty industrial hinge, deep resonant metallic groan, factory echo, close mic recording, foley sound effect
Steps: 25 | CFG: 5.0 | Duration: 8s

## 各方案负向词

### N1 (对照组)
music, melody, singing, speech, voice, harmonic, rhythmic

### N2 (加噪声)
music, melody, singing, noise, static, hiss, crackle, electrical hum, buzz, low quality recording, distortion, clipping

### N3 (全面)
music, melody, singing, speech, voice, beat, rhythm, harmony, noise, static, hiss, crackle, electrical noise, hum, buzz, distortion, clipping, low quality, muffled, excessive reverb, long echo, wind noise, compression artifact, digital artifact, aliasing

### N4 (精益)
music, song, melody, harmony, rhythm, beat, drum, bass, singing, vocal, speech, talking, whisper, voice, noise, static, hiss, crackle, pop, click, electrical noise, ground loop hum, 60hz hum, high frequency hiss, white noise, pink noise, distortion, overdrive, clipping, low quality audio, muffled sound, distant, far away, excessive reverb, long reverb tail, echo, wind, wind noise, background ambience, room tone, compression artifact, digital artifact, bitcrush, aliasing, encoding noise, telephone quality, radio static, broken speaker

### N5 (精简直接)
noise, static, crackle, hiss, hum, buzz, distortion, low quality, muffled, music, singing, voice
