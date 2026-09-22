/* ===== 角色圖鑑 ===== */
function viewCodex(){
  const total=Object.keys(ROLEMETA).length;const owned=S.ownedRoles.length;
  let html='<div class="codexhead"><div class="kicker" style="margin:0">CODEX · 星辰使者</div><div class="cc">已收集 '+owned+' / '+total+'</div></div>';
  html+='<div class="rolegrid">'+Object.keys(ROLEMETA).map(k=>{
    const m=ROLEMETA[k];const have=S.ownedRoles.includes(k);const cur=S.avatar===k;
    return '<div class="rolecard '+(have?'':'locked')+(cur?' current':'')+'" onclick="openRoleFull(\''+k+'\')"><img src="'+IMG[m.img]+'">'+
    '<div class="rn">'+(have?m.name:'？？？')+'</div><div class="rt">'+m.title+'</div>'+
    (have?'':'<div class="lock">'+icon('coin')+' '+roleCost(k)+'</div>')+'</div>';
  }).join('')+'</div>';
  return html;
}
function openRoleFull(k){SFX.tap();const m=ROLEMETA[k];const have=S.ownedRoles.includes(k);
  const bgUrl=IMG['bg_'+(S.currentBg)]||IMG.bg_castle;
  let acts;
  if(have){
    acts='<button class="ract setav" onclick="setAvatar(\''+k+'\')">設為頭像</button>'+
         '<button class="ract summon" onclick="summonRole(\''+k+'\')">登場</button>';
  }else{
    acts='<button class="ract locked" onclick="buyRole(\''+k+'\')">'+icon('coin')+' '+roleCost(k)+' 兌換</button>';
  }
  const d=el('<div class="rolefull"><div class="rbg" style="background-image:url(\''+bgUrl+'\')"></div><div class="rveil"></div>'+
  '<div class="rtop"><div class="rclose" onclick="closeRoleFull()">'+icon('close')+'</div></div>'+
  '<div class="rbody"><img class="rimg float" src="'+IMG[m.img]+'">'+
  '<div class="rname">'+(have?m.name:'？？？')+'</div><div class="rtitle">'+m.title+'</div>'+
  '<div class="rstory">'+(have?m.story:'尚未兌換。兌換後即可閱覽這位星辰使者的故事，並讓他登場。')+'</div>'+
  '<div class="racts">'+acts+'</div></div></div>');
  $('overlays').appendChild(d);d.id='roleFull';
}
function closeRoleFull(){const r=$('roleFull');if(r)r.remove();}
function setAvatar(k){S.avatar=k;SFX.approve();save();refreshHUD();toast('已將 '+ROLEMETA[k].name+' 設為頭像');closeRoleFull();render();}
function summonRole(k){closeRoleFull();SFX.summon();
  const fx=el('<div class="summonfx"><div class="flash"></div><div class="ring"></div></div>');$('overlays').appendChild(fx);
  setTimeout(()=>{fx.remove();toast('✦ '+ROLEMETA[k].name+' 華麗登場！');},1400);
}
function buyRole(k){const cost=roleCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足，再去冒險吧');return;}
  S.coins-=cost;S.ownedRoles.push(k);SFX.redeem();save();refreshHUD();closeRoleFull();toast('已兌換星辰使者：'+ROLEMETA[k].name);render();
}

/* ===== 商店 ===== */
function viewShop(){
  let html='<div class="kicker">TREASURY · 金幣兌換</div>';
  html+='<div class="shopsec"><div class="shophead"><span class="st">夥伴補給</span><span class="badge" style="color:#3FE0A8;background:rgba(63,224,168,.14)">存入背包</span><span class="editprice" onclick="openPriceEdit(\'food\')">'+icon('edit')+' 改價</span></div><div class="grid2">';
  Object.keys(FOODS).forEach(k=>{const f=FOODS[k];html+=shopBtn(f.img,f.name+'（飽足+'+f.hunger+'）',foodCost(k),'buyFood(\''+k+'\')','#F0C04A');});
  html+=shopBtn(POTION.img,POTION.name+'（治癒生病）',foodCost('potion'),'buyFood(\'potion\')','#3FE0A8');
  html+='</div></div>';
  html+='<div class="shopsec"><div class="shophead"><span class="st">尊貴獎勵</span><span class="badge" style="color:#FF6FA5;background:rgba(255,111,165,.14)">唯公主能授予</span><span class="editprice" onclick="openPriceEdit(\'prize\')">'+icon('edit')+' 改價</span></div><div class="grid2">';
  PRIZES.forEach(p=>{html+='<div class="shopcard"><img src="'+IMG.princess+'" style="height:130px;border-radius:10px;object-fit:cover;object-position:center 18%;width:100%"><div class="sn">'+p.name+'</div><button class="buybtn" style="background:linear-gradient(135deg,#FF6FA5,#FFA8C8)" onclick="buyPrize(\''+p.id+'\','+prizeCost(p)+',\''+p.name+'\')">'+icon('coin')+' '+prizeCost(p)+'</button></div>';});
  html+='</div></div>';
  html+='<div class="shopsec"><div class="shophead"><span class="st">星辰使者</span><span class="editprice" onclick="openPriceEdit(\'role\')">'+icon('edit')+' 改價</span></div><div class="grid2">';
  Object.keys(ROLEMETA).forEach(k=>{if(INIT_ROLES.includes(k))return;const owned=S.ownedRoles.includes(k);html+='<div class="shopcard"><img src="'+IMG[ROLEMETA[k].img]+'" onclick="openRoleFull(\''+k+'\')"><div class="sn">'+ROLEMETA[k].name+'</div><button class="buybtn '+(owned?'owned':'')+'" style="'+(owned?'':'background:linear-gradient(135deg,#A88BFF,#7B5CFF)')+'" '+(owned?'':'onclick="buyRole(\''+k+'\')"')+'>'+(owned?'已擁有':icon('coin')+' '+roleCost(k))+'</button></div>';});
  html+='</div></div>';
  html+='<div class="shopsec"><div class="shophead"><span class="st">夥伴</span><span class="editprice" onclick="openPriceEdit(\'pet\')">'+icon('edit')+' 改價</span></div><div class="grid2">';
  Object.keys(PETMETA).forEach(k=>{const owned=S.ownedPets.includes(k);html+='<div class="shopcard"><img src="'+IMG[PETMETA[k].img]+'"><div class="sn">'+PETMETA[k].sp+' '+PETMETA[k].name+'</div><button class="buybtn '+(owned?'owned':'')+'" style="'+(owned?'':'background:linear-gradient(135deg,#3FE0A8,#2bbd8a);color:#0A0A1F')+'" '+(owned?'':'onclick="buyPet(\''+k+'\')"')+'>'+(owned?'已擁有':icon('coin')+' '+petCost(k))+'</button></div>';});
  html+='</div></div>';
  html+='<div class="shopsec"><div class="shophead"><span class="st">背景</span><span class="editprice" onclick="openPriceEdit(\'bg\')">'+icon('edit')+' 改價</span></div><div class="grid2">';
  Object.keys(BGMETA).forEach(k=>{if(k==='town')return;const owned=S.ownedBg.includes(k);const b=BGMETA[k];html+='<div class="shopcard"><img src="'+IMG['bg_'+k]+'" style="height:90px;border-radius:10px;object-fit:cover;width:100%"><div class="sn">'+b.name+'</div><button class="buybtn '+(owned?'owned':'')+'" style="'+(owned?'':'background:linear-gradient(135deg,#F0C04A,#FFE08A)')+'" '+(owned?'':'onclick="buyBg(\''+k+'\')"')+'>'+(owned?'已擁有':icon('coin')+' '+bgCost(k))+'</button></div>';});
  html+='</div></div>';
  return html;
}
function shopBtn(img,name,cost,onclick,col){return '<div class="shopcard"><img src="'+IMG[img]+'"><div class="sn">'+name+'</div><button class="buybtn" style="background:linear-gradient(135deg,'+col+',#FFE08A)" onclick="'+onclick+'">'+icon('coin')+' '+cost+'</button></div>';}
function buyFood(k){const item=k==='potion'?POTION:FOODS[k];const cost=foodCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足');return;}S.coins-=cost;S.bag[k]=(S.bag[k]||0)+1;SFX.redeem();save();toast(item.name+' 已存入背包');refreshHUD();render();}
function buyPet(k){const cost=petCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足');return;}S.coins-=cost;S.ownedPets.push(k);S.pets[k]={hunger:70,joy:60,sick:false};SFX.redeem();save();toast('已兌換夥伴：'+PETMETA[k].sp+' '+PETMETA[k].name);refreshHUD();render();}
function buyBg(k){const cost=bgCost(k);if(S.coins<cost){SFX.tap();toast('金幣不足');return;}S.coins-=cost;S.ownedBg.push(k);SFX.redeem();save();toast('已兌換背景：'+BGMETA[k].name);refreshHUD();render();}
function buyPrize(id,cost,name){if(S.coins<cost){SFX.tap();toast('金幣不足，再去冒險吧');return;}S.coins-=cost;SFX.redeem();save();praise();toast('已兌換：'+name+' ♡');refreshHUD();}

/* 改價（公主專屬） */
function openPriceEdit(cat){SFX.tap();
  let items=[];
  if(cat==='food'){items=Object.keys(FOODS).map(k=>['food_'+k,FOODS[k].name,foodCost(k)]);items.push(['food_potion',POTION.name,foodCost('potion')]);}
  else if(cat==='prize')items=PRIZES.map(p=>['prize_'+p.id,p.name,prizeCost(p)]);
  else if(cat==='role')items=Object.keys(ROLEMETA).filter(k=>!INIT_ROLES.includes(k)).map(k=>['role_'+k,ROLEMETA[k].name,roleCost(k)]);
  else if(cat==='pet')items=Object.keys(PETMETA).map(k=>['pet_'+k,PETMETA[k].sp+' '+PETMETA[k].name,petCost(k)]);
  else if(cat==='bg')items=Object.keys(BGMETA).filter(k=>k!=='town').map(k=>['bg_'+k,BGMETA[k].name,bgCost(k)]);
  const rows=items.map(([key,name,cur])=>'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><span style="flex:1;font-size:14px;color:var(--text)">'+name+'</span><input type="number" id="pr_'+key+'" value="'+cur+'" style="width:90px;margin:0;text-align:center"></div>').join('');
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('edit')+' 調整兌換價格</div><div class="sheetsub">身為公主，你能親自定價。</div>'+rows+
  '<button class="cta" style="width:100%;margin-top:8px" onclick="savePrices(\''+items.map(i=>i[0]).join(',')+'\')">儲存價格</button></div></div>';
}
function savePrices(keys){keys.split(',').forEach(key=>{const v=+$('pr_'+key).value;if(v>=0)S.prices[key]=v;});SFX.approve();save();closeSheetForce();toast('價格已更新 ✦');render();}

/* ===== 設定 ===== */
function openSettings(){SFX.tap();
  const bgThumbs=Object.keys(BGMETA).map(k=>{const owned=S.ownedBg.includes(k);return '<div class="bgthumb '+(S.currentBg===k?'on':'')+(owned?'':' locked')+'" style="background-image:url(\''+IMG['bg_'+k]+'\')" '+(owned?'onclick="setCurrentBg(\''+k+'\')"':'')+'><div class="bgn">'+BGMETA[k].name+'</div></div>';}).join('');
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('gear')+' 設定</div>'+
  '<div class="setrow"><div class="sleft">'+icon('sound')+' 音效</div><div class="sw '+(S.muted?'':'on')+'" onclick="toggleMute(this)"><i></i></div></div>'+
  '<div class="setrow"><div class="sleft">'+icon('music')+' 背景音樂</div><div class="sw '+(S.musicOff?'':'on')+'" onclick="toggleMusic(this)"><i></i></div></div>'+
  '<div class="setrow"><div class="sleft">'+icon('music')+' 音樂音量</div><input type="range" class="slider" min="0" max="40" value="'+Math.round(S.musicVol*100)+'" oninput="setMusicVol(this.value)"></div>'+
  '<div style="padding:14px 0"><div class="sleft" style="margin-bottom:10px">'+icon('gem')+' 背景選擇</div><div class="bgpick">'+bgThumbs+'</div></div>'+
  '</div></div>';
}
function toggleMute(sw){S.muted=!S.muted;sw.classList.toggle('on');save();}
function toggleMusic(sw){S.musicOff=!S.musicOff;sw.classList.toggle('on');if(S.musicOff)bgmStop();else bgmStart();save();}
function setMusicVol(v){S.musicVol=v/100;bgmVol(S.musicVol);save();}
function setCurrentBg(k){S.currentBg=k;SFX.tap();save();applyBgClass();closeSheetForce();toast('背景已更換：'+BGMETA[k].name);}

/* 端切換 */
function switchToKnight(){SFX.tap();$('switchbar').innerHTML='<div class="switchbar">'+icon('crown')+' 公主端 ·（騎士端 App 為獨立檔案）<button onclick="exitKnight()">關閉</button></div>';toast('騎士端是另一個獨立 App 檔案');}
function exitKnight(){$('switchbar').innerHTML='';}

/* 大頭貼點擊 → 選頭像 */
function openAvatarPick(){SFX.tap();
  const opts=['princess'].concat(S.ownedRoles);
  const cards=opts.map(k=>{const img=k==='princess'?IMG.princess:IMG[ROLEMETA[k].img];const name=k==='princess'?'公主 Elia':ROLEMETA[k].name;
    return '<div class="bgthumb '+(S.avatar===k?'on':'')+'" style="background-image:url(\''+img+'\');background-position:top center" onclick="setAvatar2(\''+k+'\')"><div class="bgn">'+name+'</div></div>';}).join('');
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('crown')+' 選擇頭像</div><div class="sheetsub">可選公主或已擁有的星辰使者。</div>'+
  '<div class="bgpick">'+cards+'</div></div></div>';
}
function setAvatar2(k){S.avatar=k;SFX.approve();save();refreshHUD();closeSheetForce();toast('頭像已更換');}

/* 年月選擇器 */
function openYearMonth(){SFX.tap();const d=viewDate;let years='';for(let y=2024;y<=2030;y++)years+='<option value="'+y+'" '+(y===d.getFullYear()?'selected':'')+'>'+y+' 年</option>';
  let months='';for(let m=1;m<=12;m++)months+='<option value="'+m+'" '+(m===d.getMonth()+1?'selected':'')+'>'+m+' 月</option>';
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet center" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('cal')+' 選擇年月</div>'+
  '<div style="display:flex;gap:10px;margin:16px 0"><select id="ymY" style="flex:1;padding:12px;border-radius:12px;background:rgba(0,0,0,.3);color:var(--text);border:1.5px solid var(--line);font-family:inherit;font-size:15px">'+years+'</select>'+
  '<select id="ymM" style="flex:1;padding:12px;border-radius:12px;background:rgba(0,0,0,.3);color:var(--text);border:1.5px solid var(--line);font-family:inherit;font-size:15px">'+months+'</select></div>'+
  '<button class="cta" style="width:100%" onclick="applyYearMonth()">確定</button></div></div>';
}
function applyYearMonth(){const y=+$('ymY').value,m=+$('ymM').value;viewDate=new Date(y,m-1,1);SFX.tap();closeSheetForce();render();}

/* 收尾 */
function closeSheet(e){if(e.target.classList.contains('sheetbg'))$('overlays').innerHTML='';}
function closeSheetForce(){const r=$('roleFull');$('overlays').innerHTML='';if(r&&$('overlays'))$('overlays').innerHTML='';}

/* 夥伴狀態下降（放慢：每 30 秒掉 1 飽足）*/
setInterval(()=>{
  const p=S.pets[S.activePet];if(!p)return;
  if(!p.sick){p.hunger=Math.max(0,p.hunger-1);p.joy=Math.max(0,p.joy-0.5);
    if(p.hunger<=0){p._starve=(p._starve||0)+1;if(p._starve>=3){p.sick=true;p._starve=0;if(S.tab==='pets'){toast('夥伴餓壞生病了！需要治療藥水');render();}}}
  }else{p.joy=Math.max(0,p.joy-0.6);}
  save();if(S.tab==='pets'&&!document.querySelector('.sheetbg'))render();
},30000);

boot();
