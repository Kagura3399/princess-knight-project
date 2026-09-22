import json
assets = json.load(open("../assets/_assets.json"))
core_css = open("../src/_core.css").read()
screen_css = open("../src/_screen.css").read()
core_js = open("../src/_core.js").read()
data_js = open("../src/_data.js").read()
princess_state = open("../src/_princess_screens.js").read()
app_js = open("../src/_app.js").read()
views_js = open("../src/_views.js").read()
views2_js = open("../src/_views2.js").read()
views3_js = open("../src/_views3.js").read()

assets_js = "const IMG = " + json.dumps(assets, ensure_ascii=False) + ";"

HTML = '''<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#0A0A1F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>My Princess's Knight · 公主端</title>
<link rel="manifest" href="data:application/json;base64,__MANIFEST__">
<style>
''' + core_css + screen_css + '''
</style>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
</head>
<body>
<div id="app">
  <canvas id="stars"></canvas>

  <section id="intro" class="screen">
    <div class="veil"></div>
    <div class="float"><img class="pp" id="introPP" src=""></div>
    <div class="kick eng">ISEKAI · ARCANE QUEST</div>
    <h1 class="eng">My Princess's Knight</h1>
    <div class="sub engi">The Princess's Bounty</div>
    <p>你被召喚到了星辰彼端的異世界。<br>每一件待辦都是一張懸賞，<br>而本公主，會親自為你的功績加冕。</p>
    <button class="cta" onclick="enterFromIntro()">翻開懸賞書</button>
    <div class="foot eng">PRINCESS CONSOLE</div>
  </section>

  <section id="pairing" class="screen hidden">
    <div class="pk eng">PAIRING · 情侶配對</div>
    <h2>連結你們的星盤</h2>
    <p>輸入一組你和騎士共用的「配對碼」（自己取，例如你們的紀念日或暱稱）。<br>兩人輸入相同的碼，懸賞就會同步。</p>
    <input type="text" id="pairInput" placeholder="輸入配對碼" maxlength="20">
    <button class="cta" style="margin-top:18px" onclick="confirmPair()">連結星盤</button>
  </section>

  <section id="main" class="screen hidden">
    <div id="switchbar"></div>
    <div class="hud">
      <div class="left">
        <img class="pav" id="hudAvatar" src="" onclick="openAvatarPick()">
        <div>
          <div class="who">公主 Elia</div>
          <div class="lvrow"><span class="lvbadge" id="lvBadge">Lv.1</span><div class="xpbar"><i id="xpFill" style="width:0%"></i></div></div>
        </div>
      </div>
      <div class="right">
        <span class="wallet"><span class="ic">__COINIC__</span><span id="coinNum">620</span></span>
        <span class="wallet"><span class="ic" style="color:#7FC4FF">__XPIC__</span><span id="xpNum">160</span></span>
        <button class="iconbtn" onclick="openSettings()">__GEARIC__</button>
        <button class="iconbtn" onclick="switchToKnight()">__CROWNIC__</button>
      </div>
    </div>
    <main id="content"></main>
    <nav id="nav"></nav>
  </section>

  <div id="overlays"></div>
</div>

<script>
''' + assets_js + '\n' + core_js + '\n' + data_js + '\n' + princess_state + '\n' + app_js + '\n' + views_js + '\n' + views2_js + '\n' + views3_js + '''
// HUD 靜態 icon 填入
document.querySelectorAll('.wallet .ic')[0].innerHTML=ICO.coin();
document.querySelectorAll('.wallet .ic')[1].innerHTML=ICO.xp();
document.querySelectorAll('.iconbtn')[0].innerHTML=ICO.gear();
document.querySelectorAll('.iconbtn')[1].innerHTML=ICO.crown();
</script>
</body>
</html>'''

# manifest
manifest = {
  "name":"My Princess's Knight · 公主端","short_name":"公主端",
  "start_url":".","display":"standalone","background_color":"#0A0A1F","theme_color":"#0A0A1F",
  "icons":[]
}
import base64
mb64 = base64.b64encode(json.dumps(manifest).encode()).decode()
HTML = HTML.replace("__MANIFEST__", mb64)
# 移除 HUD 內聯 icon 佔位（改用 JS 填）
HTML = HTML.replace("__COINIC__","").replace("__XPIC__","").replace("__GEARIC__","").replace("__CROWNIC__","")

open("../dist/princess-app.html","w").write(HTML)
print("公主端組裝完成，大小", round(len(HTML)/1024/1024,2), "MB")
