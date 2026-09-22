/* ===== 公主端主邏輯 ===== */
function $(id){return document.getElementById(id);}
function el(html){const d=document.createElement('div');d.innerHTML=html;return d.firstElementChild;}

/* 初始化 */
async function boot(){
  load();
  if(!S.tasks||S.tasks.length===0)S.tasks=DEFAULT_TASKS.slice();
  // 套用背景明暗
  applyBgClass();
  // 圖片
  $('introPP').src=IMG.princess;
  $('intro').style.backgroundImage="url('"+IMG.bg_intro+"')";
  // Firebase
  await initFirebase();
  if(S.paired&&S.roomCode){setRoom(S.roomCode);startSync();}
  initStars();
}

function enterFromIntro(){
  SFX.tap();
  if(!S.musicOff)bgmStart();
  if(!S.paired){ $('intro').classList.add('hidden'); $('pairing').classList.remove('hidden'); }
  else enterApp();
}
function confirmPair(){
  const code=$('pairInput').value.trim();
  if(code.length<3){toast('配對碼至少 3 個字');return;}
  S.roomCode=code; S.paired=true; setRoom(code); save();
  SFX.approve();
  // 首次配對：把本地任務推上雲端（合併）
  pushShared({tasks:S.tasks});
  startSync();
  $('pairing').classList.add('hidden'); enterApp();
}
function enterApp(){
  $('intro').classList.add('hidden'); $('pairing').classList.add('hidden');
  $('main').classList.remove('hidden');
  renderNav(); render(); refreshHUD(); applyBgClass();
}
function startSync(){
  watchShared(data=>{
    if(data&&data.tasks){ S.tasks=data.tasks; save(); if(!$('main').classList.contains('hidden')){render();renderNav();} }
  });
}
function syncPush(){ if(S.paired)pushShared({tasks:S.tasks}); save(); }

/* HUD */
function refreshHUD(){
  $('coinNum').textContent=S.coins;
  $('xpNum').textContent=S.xp;
  $('lvBadge').textContent='Lv.'+lvl();
  $('xpFill').style.width=(S.xp%100)+'%';
  $('hudAvatar').src=IMG[S.avatar==='princess'?'princess':ROLEMETA[S.avatar].img];
}
function applyBgClass(){
  const meta=BGMETA[S.currentBg];
  if(meta&&meta.light)document.body.classList.add('lightbg');else document.body.classList.remove('lightbg');
  const url=IMG['bg_'+S.currentBg];
  if(['bounty','plan'].includes(S.tab)&&url){
    const dark=meta&&meta.light?'rgba(10,10,31,.35),rgba(10,10,31,.7)':'rgba(10,10,31,.6),rgba(10,10,31,.9)';
    $('main').style.backgroundImage="linear-gradient(180deg,"+dark+"),url('"+url+"')";
    $('main').style.backgroundSize='cover';$('main').style.backgroundPosition='center';$('main').style.backgroundAttachment='fixed';
  }else{$('main').style.backgroundImage='';}
}

/* 讚美（頭像永遠公主）+ toast */
function praise(){const p=PRAISES[Math.floor(Math.random()*PRAISES.length)];const d=el('<div class="praise"><img src="'+IMG.princess+'"><div><div class="pl">公主的讚美</div><div class="pt">'+p+'</div></div></div>');$('overlays').appendChild(d);setTimeout(()=>d.remove(),2900);}
function toast(m){const d=el('<div class="toast">'+m+'</div>');$('overlays').appendChild(d);setTimeout(()=>d.remove(),2200);}

function award(t){const before=Math.floor(S.xp/100);S.coins+=t.coins;S.xp+=t.xp;if(Math.floor(S.xp/100)>before)SFX.level();}

/* 導覽 */
function renderNav(){
  const items=[['bounty','懸賞','bell'],['plan','計劃','cal'],['pets','夥伴','heart'],['codex','圖鑑','book'],['shop','兌換','gem']];
  $('nav').innerHTML=items.map(([k,label,ic])=>{
    const on=S.tab===k;let badge='';
    if(k==='bounty'){const n=S.tasks.filter(t=>t.status==='submitted').length;if(n)badge='<span class="nbadge">'+n+'</span>';}
    return '<button class="'+(on?'on':'')+'" onclick="go(\''+k+'\')"><div style="position:relative">'+icon(ic)+badge+'</div><span>'+label+'</span></button>';
  }).join('');
}
function go(tab){SFX.tap();S.tab=tab;renderNav();render();applyBgClass();}

/* 主渲染 */
function render(){
  const c=$('content');
  if(S.tab==='bounty')c.innerHTML=viewBounty();
  else if(S.tab==='plan')c.innerHTML=viewPlan();
  else if(S.tab==='pets')c.innerHTML=viewPets();
  else if(S.tab==='codex')c.innerHTML=viewCodex();
  else if(S.tab==='shop')c.innerHTML=viewShop();
  document.querySelectorAll('.fab').forEach(f=>f.remove());
  if(S.tab==='bounty'){const fab=el('<button class="fab">'+icon('plus')+'</button>');fab.onclick=()=>openAddBounty();$('main').appendChild(fab);}
}
