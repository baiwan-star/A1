$ErrorActionPreference = 'Stop'
$root = 'D:\OpenClaw专属文件夹\A1\A1《白穹纪元：机械永生录》'
$exclude = '\\node_modules\\|\\.git\\|\\.obsidian\\|\\15-文档备份-暂时无用\\|\\16-审查报告\\|\\11-待生成\\|\\12-已生成\\'
$patterns = @(
    '白穹纪元107年',
    '237个月',
    '七十年前的伊甸核心',
    '第四次伊甸核心全域清理行动',
    '甲号|乙号|丙号|丁号',
    '中枢安全人工智能|AI合成声音|虚拟数据实体|强制传送',
    '所有白穹城公民出生',
    '铁则形成于 50 年前|50年前刚入行',
    '活不过 40 岁|活不过40岁',
    '坐了十五年|认识了三十二年',
    '240个月满分|连续240个月满分',
    '14个子系统已全部完成|14个游戏子系统全部设计|10-20万的概念视觉化',
    '统合币票据|纸币形式'
)
$issues = @()
foreach ($pattern in $patterns) {
    $matches = Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
        $_.Extension -in '.md','.txt' -and $_.FullName -notmatch $exclude -and $_.FullName -notmatch '00-唯一真源口径.md'
    } | Select-String -Pattern $pattern -SimpleMatch:$false
    if ($matches) {
        $issues += $matches
    }
}
if ($issues.Count -gt 0) {
    $issues | ForEach-Object { Write-Host "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }
    Write-Host "CONSISTENCY FAIL: $($issues.Count) issue(s)"
    exit 1
}
Write-Host "CONSISTENCY OK"