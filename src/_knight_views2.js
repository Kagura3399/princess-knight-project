/* ===== 騎士端 計劃 ===== */
function viewPlan(){
  let html='<div class="kicker">OVERVIEW · 全局計劃</div>';
  // 公主懸賞統計
  const pb=allBountyTasks();const pbDone=pb.filter(t=>t.status==='done').length;
  html+='<div class="plancard"><div class="ph"><div><div class="pt">公主的懸賞</div><div class="psub">來自公主 Elia</div></div><div class="pc" style="color:#F0C04A">'+pbDone+'/'+pb.length+'</div></div><div class="progress"><i style="width:'+(pb.length?pbDone/pb.length*100:0)+'%;background:linear-gradient(90deg,#F0C04A,#FFE08A)"></i></div></div>';
  // 各自建清單統計
  S.lists.forEach(l=>{
    const tasks=S.myTasks.filter(t=>t.list===l.id);const done=tasks.filter(t=>t.status==='done').length;
    html+='<div class="plancard"><div class="ph"><div><div class="pt">'+icon(l.icon)+' '+l.name+'</div></div><div class="pc" style="color:#A88BFF">'+done+'/'+tasks.length+'</div></div>';
    html+='<div class="progress"><i style="width:'+(tasks.length?done/tasks.length*100:0)+'%;background:linear-gradient(90deg,#7B5CFF,#A88BFF)"></i></div>';
    html+='<div class="plist">'+(tasks.slice(0,5).map(t=>'<div class="pi"><span class="pdot '+(t.status==='done'?'on':'')+'" style="'+(t.status==='done'?'background:#A88BFF':'')+'">'+(t.status==='done'?icon('check'):'')+'</span><span style="'+(t.status==='done'?'color:var(--textDim);text-decoration:line-through':'color:var(--text)')+'">'+t.title+'</span></div>').join('')||'<span style="font-size:12.5px;color:var(--textDim)">尚無委託</span>')+'</div></div>';
  });
  // 累計完成
  html+='<div class="plancard" style="text-align:center"><div style="font-size:13px;color:var(--textDim)">累計完成委託</div><div style="font-size:32px;color:var(--gold);margin-top:4px">'+S.completedCount+'</div><div style="font-size:11px;color:var(--arcaneHi);margin-top:2px">每 10 個，星辰使者會現身為你喝采</div></div>';
  return html;
}

/* ===== 夥伴（騎士端，初始無夥伴）===== */
function viewPets(){
  if(S.ownedPets.length===0)return '<div class="kicker">COMPANION · 夥伴</div><div class="empty"><div class="star">✦</div>你還沒有夥伴。<br>完成任務賺金幣，到「兌換」帶一隻回來吧。</div>';
  const pid=S.activePet||S.ownedPets[0];const p=S.pets[pid];const meta=PETMETA[pid];
  const happy=!p.sick&&p.hunger>30&&p.joy>30;
  let mood,moodcol;
  if(p.sick){mood='生病了…快用治療藥水救救牠';moodcol='#FF6FA5';}
  else if(happy){mood='心情很好，蹦蹦跳跳';moodcol='#3FE0A8';}
  else{mood='看起來有點低落…照顧一下吧';moodcol='#FFA8C8';}
  let html='<div class="kicker">COMPANION · 夥伴</div>';
  html+='<div class="petstage"><img class="petimg '+(p.sick?'sick':'')+'" src="'+IMG[meta.img]+'">'+
  '<div class="petname">'+meta.sp+' '+meta.name+'</div><div class="petmood" style="color:'+moodcol+'">'+mood+'</div>';
  html+='<div class="stat"><div class="sl"><span style="color:var(--textDim);font-weight:700">飽足</span><span style="color:#F0C04A;font-weight:700">'+Math.round(p.hunger)+'%</span></div><div class="statbar"><i style="width:'+p.hunger+'%;background:linear-gradient(90deg,#F0C04A,#FFE08A)"></i></div></div>';
  html+='<div class="stat"><div class="sl"><span style="color:var(--textDim);font-weight:700">快樂</span><span style="color:#FF6FA5;font-weight:700">'+Math.round(p.joy)+'%</span></div><div class="statbar"><i style="width:'+p.joy+'%;background:linear-gradient(90deg,#FF6FA5,#FFA8C8)"></i></div></div>';
  if(p.sick)html+='<div class="petbtns"><button class="petbtn heal" onclick="usePotion()">使用治療藥水'+(S.bag.potion>0?'（'+S.bag.potion+'）':'（需購買）')+'</button></div>';
  else html+='<div class="petbtns"><button class="petbtn" onclick="openBag()">餵食</button><button class="petbtn" onclick="playPet()">玩耍</button></div>';
  html+='</div>';
  if(S.ownedPets.length>1)html+='<div class="petswitch">'+S.ownedPets.map(id=>'<img class="'+(id===pid?'on':'')+'" src="'+IMG[PETMETA[id].img]+'" onclick="switchPet(\''+id+'\')">').join('')+'</div>';
  return html;
}
function switchPet(id){SFX.tap();S.activePet=id;savePush();render();}
function playPet(){const p=S.pets[S.activePet||S.ownedPets[0]];if(p.sick)return;p.joy=Math.min(100,p.joy+25);SFX.redeem();savePush();toast('陪牠玩了一會，真開心！');render();}
function openBag(){
  const slots=Object.keys(FOODS).map(k=>{const f=FOODS[k];const q=S.bag[k]||0;return '<div class="bagslot '+(q>0?'':'empty')+'" '+(q>0?'onclick="feed(\''+k+'\')"':'')+'><img src="'+IMG[f.img]+'">'+(q>0?'<span class="qty">'+q+'</span>':'')+'<div class="bn">'+f.name+'</div></div>';}).join('');
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('bag')+' 背包 · 餵食</div><div class="sheetsub">點選食物餵給夥伴。食物可在「兌換」購買。</div>'+
  '<div class="baggrid">'+slots+'</div><div style="margin-top:16px;font-size:12px;color:var(--textDim);text-align:center">沒有食物了？到「兌換」分頁購買補給。</div></div></div>';
}
function feed(k){const p=S.pets[S.activePet||S.ownedPets[0]];if((S.bag[k]||0)<=0)return;if(p.sick){toast('牠生病了，要先治療');return;}
  S.bag[k]--;p.hunger=Math.min(100,p.hunger+FOODS[k].hunger);SFX.redeem();closeSheetForce();savePush();toast(FOODS[k].name+' 餵食成功！飽足 +'+FOODS[k].hunger);render();}
function usePotion(){const p=S.pets[S.activePet||S.ownedPets[0]];if((S.bag.potion||0)<=0){toast('沒有治療藥水，請至兌換購買');return;}
  S.bag.potion--;p.sick=false;p.hunger=40;p.joy=Math.max(p.joy,40);SFX.approve();savePush();toast('治療藥水生效，夥伴康復了！');render();}

/* ===== 兌換（騎士端，需金幣解鎖）===== */
function viewShop(){
  let html='<div class="kicker">TREASURY · 金幣兌換</div>';
  html+='<div class="shopsec"><div class="shophead"><span class="st">夥伴補給</span><span class="badge" style="color:#3FE0A8;background:rgba(63,224,168,.14)">存入背包</span></div><div class="grid2">';
  Object.keys(FOODS).forEach(k=>{const f=FOODS[k];html+=shopBtn(f.img,f.name+'（飽足+'+f.hunger+'）',foodCost(k),'buyFood(\''+k+'\')','#F0C04A');});
  html+=shopBtn(POTION.img,POTION.name+'（治癒生病）',foodCost('potion'),'buyFood(\'potion\')','#3FE0A8');
  html+='</div></div>';
  // 星辰使者（角色）
  html+='<div class="shopsec"><div class="shophead"><span class="st">星辰使者</span></div><div class="grid2">';
  Object.keys(ROLEMETA).forEach(k=>{if(INIT_ROLES.includes(k))return;const owned=S.ownedRoles.includes(k);html+='<div class="shopcard"><img src="'+IMG[ROLEMETA[k].img]+'" onclick="openRoleFull(\''+k+'\')"><div class="sn">'+ROLEMETA[k].name+'</div><button class="buybtn '+(owned?'owned':'')+'" style="'+(owned?'':'background:linear-gradient(135deg,#A88BFF,#7B5CFF)')+'" '+(owned?'':'onclick="buyRole(\''+k+'\')"')+'>'+(owned?'已擁有':icon('coin')+' '+roleCost(k))+'</button></div>';});
  html+='</div></div>';
  // 夥伴
  html+='<div class="shopsec"><div class="shophead"><span class="st">夥伴</span></div><div class="grid2">';
  Object.keys(PETMETA).forEach(k=>{const owned=S.ownedPets.includes(k);html+='<div class="shopcard"><img src="'+IMG[PETMETA[k].img]+'"><div class="sn">'+PETMETA[k].sp+' '+PETMETA[k].name+'</div><button class="buybtn '+(owned?'owned':'')+'" style="'+(owned?'':'background:linear-gradient(135deg,#3FE0A8,#2bbd8a);color:#0A0A1F')+'" '+(owned?'':'onclick="buyPet(\''+k+'\')"')+'>'+(owned?'已擁有':icon('coin')+' '+petCost(k))+'</button></div>';});
  html+='</div></div>';
  // 背景
  html+='<div class="shopsec"><div class="shophead"><span class="st">背景</span></div><div class="grid2">';
  Object.keys(BGMETA).forEach(k=>{if(k==='town')return;const owned=S.ownedBg.includes(k);const b=BGMETA[k];html+='<div class="shopcard"><img src="'+IMG['bg_'+k]+'" style="height:90px;border-radius:10px;object-fit:cover;width:100%"><div class="sn">'+b.name+'</div><button class="buybtn '+(owned?'owned':'')+'" style="'+(owned?'':'background:linear-gradient(135deg,#F0C04A,#FFE08A)')+'" '+(owned?'':'onclick="buyBg(\''+k+'\')"')+'>'+(owned?'已擁有':icon('coin')+' '+bgCost(k))+'</button></div>';});
  html+='</div></div>';
  return html;
}
function shopBtn(img,name,cost,onclick,col){return '<div class="shopcard"><img src="'+IMG[img]+'"><div class="sn">'+name+'</div><button class="buybtn" style="background:linear-gradient(135deg,'+col+',#FFE08A)" onclick="'+onclick+'">'+icon('coin')+' '+cost+'</button></div>';}
function buyFood(k){const item=k==='potion'?POTION:FOODS[k];const cost=foodCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足');return;}S.coins-=cost;S.bag[k]=(S.bag[k]||0)+1;SFX.redeem();savePush();toast(item.name+' 已存入背包');refreshHUD();render();}
function buyPet(k){const cost=petCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足，再去冒險吧');return;}S.coins-=cost;S.ownedPets.push(k);S.pets[k]={hunger:70,joy:60,sick:false};if(!S.activePet)S.activePet=k;SFX.redeem();savePush();toast('已兌換夥伴：'+PETMETA[k].sp+' '+PETMETA[k].name);refreshHUD();render();}
function buyBg(k){const cost=bgCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足');return;}S.coins-=cost;S.ownedBg.push(k);SFX.redeem();savePush();toast('已兌換背景：'+BGMETA[k].name);refreshHUD();render();}

/* 角色詳情（兌換+登場）*/
function openRoleFull(k){SFX.tap();const m=ROLEMETA[k];const have=S.ownedRoles.includes(k);
  const bgUrl=IMG['bg_'+S.currentBg]||IMG.bg_castle;
  let acts;
  if(have)acts='<button class="ract setav" onclick="setAvatar(\''+k+'\')">設為頭像</button><button class="ract summon" onclick="summonRole(\''+k+'\')">登場</button>';
  else acts='<button class="ract locked" onclick="buyRole(\''+k+'\')">'+icon('coin')+' '+roleCost(k)+' 兌換</button>';
  const d=el('<div class="rolefull"><div class="rbg" style="background-image:url(\''+bgUrl+'\')"></div><div class="rveil"></div>'+
  '<div class="rtop"><div class="rclose" onclick="closeRoleFull()">'+icon('close')+'</div></div>'+
  '<div class="rbody"><img class="rimg float" src="'+IMG[m.img]+'"><div class="rname">'+(have?m.name:'？？？')+'</div><div class="rtitle">'+(m.title||'　')+'</div>'+
  '<div class="rstory">'+(have?m.story:'尚未兌換。兌換後即可閱覽這位星辰使者的故事，並讓他登場。')+'</div>'+
  (have&&m.lines?'<div class="rquote">「'+m.lines[0]+'」</div>':'')+
  '<div class="racts">'+acts+'</div></div></div>');
  $('overlays').appendChild(d);d.id='roleFull';
}
function closeRoleFull(){const r=$('roleFull');if(r)r.remove();}
function setAvatar(k){S.avatar=k;SFX.approve();savePush();refreshHUD();toast('已將 '+ROLEMETA[k].name+' 設為頭像');closeRoleFull();render();}
function summonRole(k){closeRoleFull();const m=ROLEMETA[k];SFX.summon();
  const fx=el('<div class="summonfx"><div class="flash"></div><div class="ring"></div></div>');$('overlays').appendChild(fx);
  setTimeout(()=>{fx.remove();const line=m.lines[Math.floor(Math.random()*m.lines.length)];roleAppear(m,line);},1400);}
function buyRole(k){const cost=roleCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足，再去冒險吧');return;}
  S.coins-=cost;S.ownedRoles.push(k);SFX.redeem();savePush();refreshHUD();closeRoleFull();
  const m=ROLEMETA[k];toast('已兌換星辰使者：'+m.name);
  setTimeout(()=>{const line=m.lines[Math.floor(Math.random()*m.lines.length)];roleAppear(m,line);},400);
  render();
}
