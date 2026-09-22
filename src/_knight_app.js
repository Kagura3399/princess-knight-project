/* ===== 騎士端主邏輯 ===== */
async function boot(){
  load();
  applyBgClass();
  $('introKnight').src=IMG.role_knight;
  $('intro').style.backgroundImage="url('"+IMG.bg_intro+"')";
  await initFirebase();
  initStars();
  // 已完成初始設定→直接進主畫面
  if(S.paired&&S.roomCode&&S.knightName){setRoom(S.roomCode);startSync();}
}

/* 開場→配對碼→取名→主畫面（不選角色，默認騎士） */
function enterFromIntro(){SFX.tap();if(!S.musicOff)bgmStart();
  if(S.paired&&S.knightName){enterApp();return;}
  $('intro').classList.add('hidden');
  if(!S.paired)$('pairing').classList.remove('hidden');
  else if(!S.knightName)$('naming').classList.remove('hidden');
}
function confirmPair(){
  const code=$('pairInput').value.trim();
  if(code.length<3){toast('配對碼至少 3 個字');return;}
  S.roomCode=code;S.paired=true;setRoom(code);save();SFX.approve();
  startSync();
  $('pairing').classList.add('hidden');
  if(!S.knightName)$('naming').classList.remove('hidden');
  else enterApp();
}
function confirmName(){
  const n=$('nameInput').value.trim();
  if(!n){toast('請輸入你的名字');return;}
  S.knightName=n;S.myRole='knight';S.avatar='knight';save();SFX.approve();
  $('naming').classList.add('hidden');
  if(S.paired)pushPrivate();
  enterApp();
}
function enterApp(){
  ['intro','pairing','naming'].forEach(id=>{const e=$(id);if(e)e.classList.add('hidden');});
  $('main').classList.remove('hidden');
  renderNav();render();refreshHUD();applyBgClass();
}

/* HUD */
function refreshHUD(){
  $('coinNum').textContent=S.coins;
  $('xpNum').textContent=S.xp;
  $('lvBadge').textContent='Lv.'+lvl();
  $('xpFill').style.width=(S.xp%100)+'%';
  $('hudAvatar').src=IMG[ROLEMETA[S.avatar]?ROLEMETA[S.avatar].img:'role_knight'];
  $('hudName').textContent=S.knightName||'騎士';
}
function applyBgClass(){
  const meta=BGMETA[S.currentBg];
  if(meta&&meta.light)document.body.classList.add('lightbg');else document.body.classList.remove('lightbg');
  const url=IMG['bg_'+S.currentBg];
  if(['bounty','plan'].includes(S.tab)&&url){
    const dark=meta&&meta.light?'rgba(10,10,31,.35),rgba(10,10,31,.7)':'rgba(10,10,31,.6),rgba(10,10,31,.9)';
    $('main').style.backgroundImage="linear-gradient(180deg,"+dark+"),url('"+url+"')";
    $('main').style.backgroundSize='cover';$('main').style.backgroundPosition='center';$('main').style.backgroundAttachment='fixed';
  }else $('main').style.backgroundImage='';
}

/* 角色出場（每完成10個任務，騎士端專屬）*/
function checkRoleAppear(){
  if(S.completedCount>0&&S.completedCount%10===0){
    const pool=S.ownedRoles;
    const k=pool[Math.floor(Math.random()*pool.length)];
    const m=ROLEMETA[k];const line=m.lines[Math.floor(Math.random()*m.lines.length)];
    roleAppear(m,line);
  }
}
function roleAppear(m,line){SFX.summon();
  const d=el('<div class="roleappear"><div class="ra-bg"></div><div class="ra-card"><img src="'+IMG[m.img]+'" class="ra-img"><div class="ra-info"><div class="ra-name">'+m.name+(m.title?' · '+m.title:'')+'</div><div class="ra-line">'+line+'</div></div></div></div>');
  $('overlays').appendChild(d);
  d.onclick=()=>d.remove();
  setTimeout(()=>{if(d.parentElement)d.remove();},4200);
}

/* 讚美（公主的，完成單任務時）+ toast */
function praise(){const p=PRAISES[Math.floor(Math.random()*PRAISES.length)];const d=el('<div class="praise"><img src="'+IMG.princess+'"><div><div class="pl">公主的口諭</div><div class="pt">'+p+'</div></div></div>');$('overlays').appendChild(d);setTimeout(()=>d.remove(),2900);}
function toast(m){const d=el('<div class="toast">'+m+'</div>');$('overlays').appendChild(d);setTimeout(()=>d.remove(),2200);}
function award(t){const before=Math.floor(S.xp/100);S.coins+=t.coins;S.xp+=t.xp;if(Math.floor(S.xp/100)>before)SFX.level();}

/* 導覽 */
function renderNav(){
  const items=[['bounty','懸賞','bell'],['lists','手札','book'],['plan','計劃','cal'],['pets','夥伴','heart'],['shop','兌換','gem']];
  $('nav').innerHTML=items.map(([k,label,ic])=>{
    const on=S.tab===k;let badge='';
    if(k==='bounty'){const n=S.tasks.filter(t=>t.assignee==='knight'&&t.status==='open').length;if(n)badge='<span class="nbadge">'+n+'</span>';}
    return '<button class="'+(on?'on':'')+'" onclick="go(\''+k+'\')"><div style="position:relative">'+icon(ic)+badge+'</div><span>'+label+'</span></button>';
  }).join('');
}
function go(tab){SFX.tap();S.tab=tab;renderNav();render();applyBgClass();}
function render(){
  const c=$('content');
  if(S.tab==='bounty')c.innerHTML=viewBounty();
  else if(S.tab==='lists')c.innerHTML=viewLists();
  else if(S.tab==='plan')c.innerHTML=viewPlan();
  else if(S.tab==='pets')c.innerHTML=viewPets();
  else if(S.tab==='shop')c.innerHTML=viewShop();
  document.querySelectorAll('.fab').forEach(f=>f.remove());
  if(S.tab==='lists'){const fab=el('<button class="fab">'+icon('plus')+'</button>');fab.onclick=()=>openAddList();$('main').appendChild(fab);}
}
