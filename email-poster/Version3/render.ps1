# Re-renders orchestrator-poster-v3.png / .pdf from orchestrator-poster-v3.html.
#
#   powershell -ExecutionPolicy Bypass -File render.ps1
#
# The locally installed Chrome is managed by corporate policy and never reaches
# a headless screenshot, so this provisions Puppeteer's Chrome-for-Testing build
# in %TEMP% (once, ~200 MB) and renders with that instead.

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $here "orchestrator-poster-v3.html"
$work = Join-Path $env:TEMP "poster-shot"

if (-not (Test-Path (Join-Path $work "node_modules\puppeteer"))) {
  Write-Host "Provisioning Puppeteer + Chrome for Testing in $work ..."
  New-Item -ItemType Directory -Path $work -Force | Out-Null
  '{ "name": "poster-shot", "private": true, "type": "module" }' |
    Out-File -FilePath (Join-Path $work "package.json") -Encoding utf8
  Push-Location $work
  try {
    & npm install puppeteer --no-audit --no-fund --silent 2>&1 | Out-Null
    & npx puppeteer browsers install chrome 2>&1 | Select-Object -Last 1
  } finally { Pop-Location }
}

Copy-Item (Join-Path $here "render.mjs") (Join-Path $work "render.mjs") -Force

Push-Location $work
try {
  & node "render.mjs" $source
} finally { Pop-Location }

# Single-file copy: fonts and logo inlined, so it can be forwarded on its own.
$standalone = Join-Path $here "orchestrator-poster-v3-standalone.html"
$html = [IO.File]::ReadAllText($source, [Text.UTF8Encoding]::new($false))
$fontCss = [IO.File]::ReadAllText((Join-Path $here "fonts.css"), [Text.UTF8Encoding]::new($false))
$contentJs = [IO.File]::ReadAllText((Join-Path $here "orchestrator-poster-v3-content.js"), [Text.UTF8Encoding]::new($false))
$logo = "data:image/png;base64," + [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $here "stc-logo-white.png")))
$html = $html.Replace('<link rel="stylesheet" href="fonts.css" />', "<style>`n$fontCss`n</style>")
$html = $html.Replace('<script src="orchestrator-poster-v3-content.js"></script>', "<script>`n$contentJs`n</script>")
$html = $html.Replace('src="stc-logo-white.png"', "src=`"$logo`"")
[IO.File]::WriteAllText($standalone, $html, [Text.UTF8Encoding]::new($false))

Add-Type -AssemblyName System.Drawing
foreach ($name in @("orchestrator-poster-v3.png", "orchestrator-poster-v3-email.png", "orchestrator-poster-v3.pdf", "orchestrator-poster-v3-standalone.html")) {
  $file = Join-Path $here $name
  if (-not (Test-Path $file)) { continue }
  $kb = [math]::Round((Get-Item $file).Length / 1KB)
  if ($name.EndsWith(".png")) {
    $img = [System.Drawing.Image]::FromFile($file)
    Write-Host ("{0,-28} {1} x {2} px   {3} KB" -f $name, $img.Width, $img.Height, $kb)
    $img.Dispose()
  } else {
    Write-Host ("{0,-28} {1} KB" -f $name, $kb)
  }
}

