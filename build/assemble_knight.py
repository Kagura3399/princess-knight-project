import json, base64
A = json.load(open("../assets/_assets.json"))
core_css = open("../src/_core.css").read()
screen_css = open("../src/_screen.css").read()
knight_css = open("../src/_knight_screen.css").read()
core_js = open("../src/_core.js").read()
data_js = open("../src/_data.js").read()
k_state = open("../src/_knight_state.js").read()
k_sync = open("../src/_knight_sync.js").read()
k_app = open("../src/_knight_app.js").read()
k_views = open("../src/_knight_views.js").read()
k_lists = open("../src/_knight_lists.js").read()
k_views2 = open("../src/_knight_views2.js").read()
k_views3 = open("../src/_knight_views3.js").read()

assets_js = "const IMG = " + json.dumps(A, ensure_ascii=False) + ";"

HTML = '''<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#0A0A1F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>My Princess's Knight · 騎士端</title>
<link rel="manifest" href="data:application/json;base64,__MANIFEST__">
<style>
''' + core_css + screen_css + knight_css + '''
</style>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
</head>
<body>
<div id="app">
  <canvas id="stars"></canvas>

  <section id="intro" class="screen">
    <div class="veil"></div>
    <div class="float"><img class="pp" id="introKnight" src="" style="border-color:var(--astral)"></div>
    <div class="kick eng">ISEKAI · KNIGHT'S OATH</div>
    <h1 class="eng">My Princess's Knight</h1>
    <div class="sub engi">The Knight's Oath</div>
    <p>你應公主的召喚而來。<br>接下她張貼的懸賞，以功績<br>贏得她的青睞與賞賜。</p>
    <button class="cta" onclick="enterFromIntro()">立下誓約</button>
    <div class="foot eng">KNIGHT CONSOLE</div>
  </section>

  <section id="pairing" class="screen hidden">
    <div class="pk eng">PAIRING · 連結星盤</div>
    <h2>輸入配對碼</h2>
    <p>請輸入公主設定好的「配對碼」。<br>兩人使用相同的碼，懸賞與進度就會同步。</p>
    <input type="text" id="pairInput" placeholder="輸入配對碼" maxlength="20">
    <button class="cta" style="margin-top:18px" onclick="confirmPair()">連結星盤</button>
  </section>

  <section id="naming" class="screen hidden">
    <div class="pk eng">THE OATH · 騎士之名</div>
    <h2>你叫什麼名字？</h2>
    <p>公主將以此名，記下你的功績。</p>
    <input type="text" id="nameInput" placeholder="輸入你的名字" maxlength="12">
    <button class="cta" style="margin-top:18px" onclick="confirmName()">確認此名</button>
  </section>

  <section id="main" class="screen hidden">
    <div class="hud">
      <div class="left">
        <img class="pav" id="hudAvatar" src="" style="border-color:var(--astral)">
        <div>
          <div class="who" id="hudName">騎士</div>
          <div class="lvrow"><span class="lvbadge" id="lvBadge">Lv.1</span><div class="xpbar"><i id="xpFill" style="width:0%"></i></div></div>
        </div>
      </div>
      <div class="right">
        <span class="wallet"><span class="ic">__COIN__</span><span id="coinNum">0</span></span>
        <span class="wallet"><span class="ic" style="color:#7FC4FF">__XP__</span><span id="xpNum">0</span></span>
        <button class="iconbtn" onclick="openSettings()">__GEAR__</button>
      </div>
    </div>
    <main id="content"></main>
    <nav id="nav"></nav>
  </section>

  <div id="overlays"></div>
</div>

<script>
''' + assets_js + '\n' + core_js + '\n' + data_js + '\n' + k_state + '\n' + k_sync + '\n' + k_app + '\n' + k_views + '\n' + k_lists + '\n' + k_views2 + '\n' + k_views3 + '''
document.querySelectorAll('.wallet .ic')[0].innerHTML=ICO.coin();
document.querySelectorAll('.wallet .ic')[1].innerHTML=ICO.xp();
document.querySelectorAll('.iconbtn')[0].innerHTML=ICO.gear();
</script>
</body>
</html>'''

manifest = {"name":"My Princess's Knight · 騎士端","short_name":"騎士端","start_url":".","display":"standalone","background_color":"#0A0A1F","theme_color":"#0A0A1F","icons":[]}
HTML = HTML.replace("__MANIFEST__", base64.b64encode(json.dumps(manifest).encode()).decode())
HTML = HTML.replace("__COIN__","").replace("__XP__","").replace("__GEAR__","")

open("../dist/knight-app.html","w").write(HTML)
print("騎士端組裝完成，大小", round(len(HTML)/1024/1024,2), "MB")
