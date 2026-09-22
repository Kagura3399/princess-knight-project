/* ===== 張貼/編輯懸賞（不閃退：只更新狀態不重繪整面板）===== */
let addForm={};
function openAddBounty(editId){SFX.tap();
  if(editId){const t=S.tasks.find(x=>x.id===editId);addForm={editId,title:t.title,rank:t.rank,scope:t.scope,assignee:t.assignee,repeat:t.repeat||false,hasTime:t.hasTime||false,timeStart:t.timeStart||'09:00',timeEnd:t.timeEnd||'',remind:t.remind||'none',coins:t.coins,xp:t.xp,note:t.note||'',customDate:t.date||dstr(viewDate)};}
  else addForm={editId:null,title:'',rank:'B',scope:S.scope==='month'?'day':S.scope,assignee:'self',repeat:false,hasTime:false,timeStart:'09:00',timeEnd:'',remind:'none',coins:20,xp:30,note:'',customDate:dstr(viewDate)};
  renderAddSheet();
}
function renderAddSheet(){
  const a=addForm;
  const rk=['C','B','A','S'].map(r=>'<button class="rankchip" data-k="rank" data-v="'+r+'" style="'+(a.rank===r?'border-color:'+RANKC[r]+';color:'+RANKC[r]+';background:'+RANKC[r]+'22':'')+'">'+r+'</button>').join('');
  const sc=[['day','今日'],['week','本週'],['month','本月'],['custom','自訂']].map(([k,l])=>'<button class="chip '+(a.scope===k?'on':'')+'" data-k="scope" data-v="'+k+'">'+l+'</button>').join('');
  const as=[['self','我自己'],['knight','騎士']].map(([k,l])=>'<button class="chip '+(a.assignee===k?'on':'')+'" data-k="assignee" data-v="'+k+'">'+l+'</button>').join('');
  const rm=[['1day','一天前'],['1hr','1小時前'],['10min','10分前'],['custom','自訂']].map(([k,l])=>'<button class="chip '+(a.remind===k?'on':'')+'" data-k="remind" data-v="'+k+'">'+l+'</button>').join('');
  // 自訂日期欄（固定存在，用 display 控制）
  const customDate='<div id="customDateZone" style="display:'+(a.scope==='custom'?'block':'none')+'"><label class="field">指定日期</label><input type="text" id="t_date" value="'+a.customDate+'" placeholder="2026-6-30"></div>';
  // 時間欄（固定存在，用 display 控制）
  const timeZone='<div id="timeZone" style="display:'+(a.hasTime?'block':'none')+'">'+
    '<div style="display:flex;gap:10px;margin-bottom:6px"><div style="flex:1"><label class="field">開始</label><input type="time" id="t_start" value="'+a.timeStart+'"></div><div style="flex:1"><label class="field">結束（選填）</label><input type="time" id="t_end" value="'+a.timeEnd+'"></div></div>'+
    '<label class="field">提醒提前</label><div class="chips">'+rm+'</div></div>';
  const html='<div class="sheetbg" id="addSheetBg"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('bell')+' '+(a.editId?'編輯懸賞':'張貼懸賞令')+'</div><div class="sheetsub">身為公主，你能懸賞試煉，也能親自完成。</div>'+
  '<label class="field">懸賞名稱</label><input type="text" id="b_title" placeholder="例如：練習鋼琴 30 分鐘" value="'+a.title.replace(/"/g,'&quot;')+'">'+
  '<label class="field">難度等級</label><div class="chips">'+rk+'</div>'+
  '<label class="field">時段</label><div class="chips">'+sc+'</div>'+customDate+
  '<label class="field">懸賞予</label><div class="chips">'+as+'</div>'+
  '<div class="toggle"><span class="tl">設定時間</span><div class="sw '+(a.hasTime?'on':'')+'" data-toggle="hasTime"><i></i></div></div>'+timeZone+
  '<div class="toggle"><span class="tl">每週重複</span><div class="sw '+(a.repeat?'on':'')+'" data-toggle="repeat"><i></i></div></div>'+
  '<label class="field" style="margin-top:8px">手札附記（選填）</label><input type="text" id="b_note" placeholder="補充說明…" value="'+a.note.replace(/"/g,'&quot;')+'">'+
  '<div style="display:flex;gap:12px;margin:8px 0 20px"><div style="flex:1"><label class="field">金幣賞金</label><div class="stepper"><button data-step="coins" data-d="-5">−</button><span class="v">'+icon('coin','coin')+' <span id="v_coins">'+a.coins+'</span></span><button data-step="coins" data-d="5">+</button></div></div>'+
  '<div style="flex:1"><label class="field">經驗賞金</label><div class="stepper"><button data-step="xp" data-d="-5">−</button><span class="v">'+icon('xp','xp')+' <span id="v_xp">'+a.xp+'</span></span><button data-step="xp" data-d="5">+</button></div></div></div>'+
  '<button class="cta" style="width:100%" id="b_submit">'+(a.editId?'儲存變更':'張貼懸賞')+'</button></div></div>';
  $('overlays').innerHTML=html;
  bindAddSheet();
}
function syncFormInputs(){const t=$('b_title'),n=$('b_note'),ts=$('t_start'),te=$('t_end'),td=$('t_date');
  if(t)addForm.title=t.value;if(n)addForm.note=n.value;if(ts)addForm.timeStart=ts.value;if(te)addForm.timeEnd=te.value;if(td)addForm.customDate=td.value;}
function bindAddSheet(){
  $('addSheetBg').onclick=e=>{if(e.target.id==='addSheetBg')closeSheetForce();};
  // 難度/時段/懸賞予/提醒：只切 class，完全不重繪（不閃退）
  document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.k,v=b.dataset.v;addForm[k]=v;SFX.tap();
    b.parentElement.querySelectorAll('[data-k="'+k+'"]').forEach(x=>{
      if(k==='rank'){const r=x.dataset.v;x.style.cssText=(r===v)?('border-color:'+RANKC[r]+';color:'+RANKC[r]+';background:'+RANKC[r]+'22'):'';}
      else x.classList.toggle('on',x.dataset.v===v);
    });
    if(k==='scope'){const dz=$('customDateZone');if(dz)dz.style.display=(v==='custom')?'block':'none';}
  });
  // 開關：只顯示/隱藏對應區塊，不重繪
  document.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.toggle;addForm[k]=!addForm[k];b.classList.toggle('on',addForm[k]);SFX.tap();
    if(k==='hasTime'){const tz=$('timeZone');if(tz)tz.style.display=addForm[k]?'block':'none';}
  });
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const k=b.dataset.step;addForm[k]=Math.max(0,addForm[k]+(+b.dataset.d));$('v_'+k).textContent=addForm[k];SFX.tap();});
  $('b_submit').onclick=submitBounty;
}
function submitBounty(){syncFormInputs();const a=addForm;if(!a.title.trim()){toast('請填寫懸賞名稱');return;}
  let scope=a.scope,date=null;
  if(scope==='day'||scope==='custom'){date=scope==='custom'?a.customDate:dstr(viewDate);scope='day';}
  const obj={title:a.title.trim(),scope,rank:a.rank,coins:a.coins,xp:a.xp,assignee:a.assignee,note:a.note.trim(),repeat:a.repeat,hasTime:a.hasTime,timeStart:a.timeStart,timeEnd:a.timeEnd,remind:a.remind,date};
  if(a.editId){const t=S.tasks.find(x=>x.id===a.editId);Object.assign(t,obj);toast('懸賞已更新 ✦');}
  else{obj.id=nid();obj.status='open';S.tasks.unshift(obj);SFX.publish();toast('懸賞已張貼於布告欄 ✦');}
  closeSheetForce();syncPush();render();renderNav();
}

/* ===== 計劃 ===== */
function viewPlan(){
  const groups=[['day','每日計劃','#4DA6FF'],['week','週計劃','#3FE0A8'],['month','月計劃','#FF6FA5']];
  let html='<div class="kicker">OVERVIEW · 全局計劃</div>';
  const subs={day:(TODAY.getMonth()+1)+' 月 '+TODAY.getDate()+' 日 '+WK[TODAY.getDay()],week:'本週',month:TODAY.getFullYear()+' 年 '+(TODAY.getMonth()+1)+' 月'};
  groups.forEach(([k,label,tone])=>{
    let list=S.tasks.filter(t=>t.scope===k);if(k==='day')list=list.filter(t=>!t.date||t.date===dstr(TODAY));
    const done=list.filter(t=>t.status==='done').length;
    html+='<div class="plancard"><div class="ph"><div><div class="pt">'+label+'</div><div class="psub">'+subs[k]+'</div></div><div class="pc" style="color:'+tone+'">'+done+'/'+list.length+'</div></div>';
    html+='<div class="progress"><i style="width:'+(list.length?done/list.length*100:0)+'%;background:linear-gradient(90deg,'+tone+',#7FC4FF)"></i></div>';
    html+='<div class="plist">'+(list.map(t=>'<div class="pi"><span class="pdot '+(t.status==='done'?'on':'')+'" style="'+(t.status==='done'?'background:'+tone:'')+'">'+(t.status==='done'?icon('check'):'')+'</span><span style="'+(t.status==='done'?'color:var(--textDim);text-decoration:line-through':'color:var(--text)')+'">'+t.title+'</span></div>').join('')||'<span style="font-size:12.5px;color:var(--textDim)">尚無項目</span>')+'</div></div>';
  });
  return html;
}

/* ===== 夥伴 ===== */
function viewPets(){
  if(S.ownedPets.length===0)return '<div class="kicker">COMPANION · 夥伴</div><div class="empty"><div class="star">✦</div>你還沒有夥伴。<br>到「兌換」用金幣帶一隻回家吧。</div>';
  const pid=S.activePet;const p=S.pets[pid];const meta=PETMETA[pid];
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
function switchPet(id){SFX.tap();S.activePet=id;save();render();}
function playPet(){const p=S.pets[S.activePet];if(p.sick)return;p.joy=Math.min(100,p.joy+25);SFX.redeem();save();toast('陪牠玩了一會，真開心！');render();}
function openBag(){
  const slots=Object.keys(FOODS).map(k=>{const f=FOODS[k];const q=S.bag[k]||0;return '<div class="bagslot '+(q>0?'':'empty')+'" '+(q>0?'onclick="feed(\''+k+'\')"':'')+'><img src="'+IMG[f.img]+'">'+(q>0?'<span class="qty">'+q+'</span>':'')+'<div class="bn">'+f.name+'</div></div>';}).join('');
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('bag')+' 背包 · 餵食</div><div class="sheetsub">點選食物餵給夥伴。食物可在「兌換」購買。</div>'+
  '<div class="baggrid">'+slots+'</div><div style="margin-top:16px;font-size:12px;color:var(--textDim);text-align:center">沒有食物了？到「兌換」分頁購買補給。</div></div></div>';
}
function feed(k){const p=S.pets[S.activePet];if((S.bag[k]||0)<=0)return;if(p.sick){toast('牠生病了，要先治療');return;}
  S.bag[k]--;p.hunger=Math.min(100,p.hunger+FOODS[k].hunger);SFX.redeem();closeSheetForce();save();toast(FOODS[k].name+' 餵食成功！飽足 +'+FOODS[k].hunger);render();}
function usePotion(){const p=S.pets[S.activePet];if((S.bag.potion||0)<=0){toast('沒有治療藥水，請至兌換購買');return;}
  S.bag.potion--;p.sick=false;p.hunger=40;p.joy=Math.max(p.joy,40);SFX.approve();save();toast('治療藥水生效，夥伴康復了！');render();}
