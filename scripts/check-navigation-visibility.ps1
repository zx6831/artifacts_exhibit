$ErrorActionPreference = "Stop"

$session = "navigation-visibility-$PID"
$fixture = Join-Path $PSScriptRoot "fixtures\delay-home-data.js"
$url = "http://127.0.0.1:5173/"

try {
    & agent-browser --session $session open --init-script $fixture | Out-Null
    & agent-browser --session $session set viewport 390 844 | Out-Null
    & agent-browser --session $session open $url | Out-Null
    & agent-browser --session $session click 'a[href="#about"]' | Out-Null
    & agent-browser --session $session wait 650 | Out-Null

    $probe = @'
(() => {
  const visibleRealContent = [...document.querySelectorAll("main .candidate-hero, main .section-resource__content")]
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth &&
        style.visibility !== "hidden" && Number(style.opacity) > 0.05 && element.innerText.trim().length > 0;
    });
  const result = {
    hash: location.hash,
    scrollY: Math.round(scrollY),
    visibleRealContent: visibleRealContent.length,
    visibleSkeletons: [...document.querySelectorAll("main .section-resource__skeleton")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.bottom > 0 && rect.top < innerHeight && style.visibility !== "hidden" && Number(style.opacity) > 0.05;
      }).length
  };
  if (result.visibleRealContent === 0) throw new Error(`WHITE_SCREEN ${JSON.stringify(result)}`);
  return JSON.stringify(result);
})()
'@

    $result = & agent-browser --session $session eval $probe 2>&1
    if ($LASTEXITCODE -ne 0) { throw ($result -join "`n") }
    $result
}
finally {
    & agent-browser --session $session close | Out-Null
}
