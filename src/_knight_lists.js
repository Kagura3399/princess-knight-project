/* ===== 騎士端 手札（自建清單）===== */
let currentList=null;  // 目前進入的清單 id

function viewLists(){
  if(currentList)return viewListDetail(currentList);
  let html='<div class="kicker">SCROLLS · 騎士手札</div>';
  html+='<div style="font-size:13px;color:var(--textDim);margin-bottom:16px">記下你的修練與委託。完成它們，賺取金幣與經驗。</div>';
  html+='<div class="listgrid">';
  S.lists.forEach(l=>{
    const tasks=S.myTasks.filter(t=>t.list===l.id);
    const done=tasks.filter(t=>t.status==='done').length;
    html+='<div class="listcard" onclick="openList(\''+l.id+'\')"><div class="listicon">'+icon(l.icon)+'</div>'+
    '<div class="listname">'+l.name+'</div><div class="listcount">'+done+' / '+tasks.length+' 完成</div></div>';
  });
  html+='</div>';
  return html;
}
function viewListDetail(lid){
  const l=S.lists.find(x=>x.id===lid);if(!l)return '';
  const tasks=S.myTasks.filter(t=>t.list===lid);
  const done=tasks.filter(t=>t.status==='done').length;
  let html='<div class="listdetailhead"><button class="backbtn" onclick="backToLists()">'+icon('back')+'</button>'+
    '<div class="ldh-title">'+icon(l.icon)+' '+l.name+'</div></div>';
  html+='<div class="boardhead"><div class="c">'+done+' / '+tasks.length+' 完成</div></div>';
  html+='<div class="progress"><i style="width:'+(tasks.length?done/tasks.length*100:0)+'%"></i></div>';
  html+=tasks.map(myTaskCard).join('')||'<div class="empty"><div class="star">✦</div>這份清單還是空的。<br>點下方按鈕新增第一個委託。</div>';
  html+='<button class="addtaskbtn" onclick="openAddMyTask(\''+lid+'\')">'+icon('plus')+' 新增委託</button>';
  return html;
}
function myTaskCard(t){
  const col=RANKC[t.rank];
  return '<div class="bounty '+(t.status==='done'?'done':'')+'" onclick="openMyTaskMenu(\''+t.id+'\')"><div class="edge" style="background:'+col+';box-shadow:0 0 12px '+col+'"></div>'+
    '<div class="seal" style="border-color:'+col+';color:'+col+'">'+icon('sword')+'</div>'+
    '<div class="info"><div class="row1"><span class="rank" style="background:'+col+'">'+t.rank+'</span></div>'+
    '<div class="title">'+t.title+'</div>'+
    (t.note?'<div class="bnote">'+icon('book')+' '+t.note+'</div>':'')+
    '<div class="rewards"><span class="rew coin">'+icon('coin')+' '+t.coins+'</span><span class="rew xp">'+icon('xp')+' '+t.xp+'</span></div></div>'+
    '<button class="chk '+(t.status==='done'?'done':'')+'" onclick="event.stopPropagation();toggleMyTask(\''+t.id+'\')">'+(t.status==='done'?icon('check'):'')+'</button></div>';
}
function openList(id){SFX.tap();currentList=id;render();}
function backToLists(){SFX.tap();currentList=null;render();}

/* 完成自建任務（觸發角色出場）*/
function toggleMyTask(id){const t=S.myTasks.find(x=>x.id===id);if(!t)return;
  if(t.status==='done'){t.status='open';S.coins=Math.max(0,S.coins-t.coins);S.xp=Math.max(0,S.xp-t.xp);S.completedCount=Math.max(0,S.completedCount-1);}
  else{t.status='done';award(t);S.completedCount++;SFX.complete();praise();
    // 每完成10個→角色出場
    setTimeout(()=>checkRoleAppear(),1600);
  }
  savePush();refreshHUD();render();renderNav();
}

/* 新增/編輯自建任務 */
let myForm={};
function openAddMyTask(lid,editId){SFX.tap();
  if(editId){const t=S.myTasks.find(x=>x.id===editId);myForm={editId,list:t.list,title:t.title,rank:t.rank,coins:t.coins,xp:t.xp,note:t.note||''};}
  else myForm={editId:null,list:lid,title:'',rank:'C',coins:15,xp:20,note:''};
  renderMyTaskSheet();
}
function renderMyTaskSheet(){
  const a=myForm;
  const rk=['C','B','A','S'].map(r=>'<button class="rankchip" data-k="rank" data-v="'+r+'" style="'+(a.rank===r?'border-color:'+RANKC[r]+';color:'+RANKC[r]+';background:'+RANKC[r]+'22':'')+'">'+r+'</button>').join('');
  $('overlays').innerHTML='<div class="sheetbg" id="mySheetBg"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('sword')+' '+(a.editId?'編輯委託':'新增委託')+'</div><div class="sheetsub">完成後可獲得金幣與經驗。</div>'+
  '<label class="field">委託名稱</label><input type="text" id="m_title" placeholder="例如：背 20 個單字" value="'+a.title.replace(/"/g,'&quot;')+'">'+
  '<label class="field">難度等級</label><div class="chips">'+rk+'</div>'+
  '<label class="field">手札附記（選填）</label><input type="text" id="m_note" placeholder="補充說明…" value="'+a.note.replace(/"/g,'&quot;')+'">'+
  '<div style="display:flex;gap:12px;margin:8px 0 20px"><div style="flex:1"><label class="field">金幣</label><div class="stepper"><button data-step="coins" data-d="-5">−</button><span class="v">'+icon('coin','coin')+' <span id="mv_coins">'+a.coins+'</span></span><button data-step="coins" data-d="5">+</button></div></div>'+
  '<div style="flex:1"><label class="field">經驗</label><div class="stepper"><button data-step="xp" data-d="-5">−</button><span class="v">'+icon('xp','xp')+' <span id="mv_xp">'+a.xp+'</span></span><button data-step="xp" data-d="5">+</button></div></div></div>'+
  '<button class="cta" style="width:100%" id="m_submit">'+(a.editId?'儲存變更':'新增委託')+'</button></div></div>';
  $('mySheetBg').onclick=e=>{if(e.target.id==='mySheetBg')closeSheetForce();};
  document.querySelectorAll('#mySheetBg [data-k]').forEach(b=>b.onclick=()=>{const v=b.dataset.v;myForm.rank=v;SFX.tap();b.parentElement.querySelectorAll('[data-k]').forEach(x=>{const r=x.dataset.v;x.style.cssText=(r===v)?('border-color:'+RANKC[r]+';color:'+RANKC[r]+';background:'+RANKC[r]+'22'):'';});});
  document.querySelectorAll('#mySheetBg [data-step]').forEach(b=>b.onclick=()=>{const k=b.dataset.step;myForm[k]=Math.max(0,myForm[k]+(+b.dataset.d));$('mv_'+k).textContent=myForm[k];SFX.tap();});
  $('m_submit').onclick=submitMyTask;
}
function submitMyTask(){const title=$('m_title').value.trim();if(!title){toast('請填寫委託名稱');return;}
  const note=$('m_note').value.trim();const a=myForm;
  if(a.editId){const t=S.myTasks.find(x=>x.id===a.editId);Object.assign(t,{title,rank:a.rank,coins:a.coins,xp:a.xp,note});toast('委託已更新');}
  else{S.myTasks.unshift({id:nid(),list:a.list,title,rank:a.rank,coins:a.coins,xp:a.xp,note,status:'open'});SFX.publish();toast('委託已新增 ✦');}
  closeSheetForce();savePush();render();
}
function openMyTaskMenu(id){const t=S.myTasks.find(x=>x.id===id);if(!t)return;SFX.tap();
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('sword')+' '+t.title+'</div><div class="sheetsub">難度 '+t.rank+' · '+icon('coin')+' '+t.coins+' · '+icon('xp')+' '+t.xp+'</div>'+
  '<div class="sheetbtns"><button class="btnsec" onclick="openAddMyTask(\''+t.list+'\',\''+id+'\')">'+icon('edit')+' 編輯委託</button>'+
  '<button class="btnsec btndanger" onclick="deleteMyTask(\''+id+'\')">'+icon('trash')+' 刪除委託</button></div></div></div>';
}
function deleteMyTask(id){S.myTasks=S.myTasks.filter(x=>x.id!==id);SFX.tap();closeSheetForce();toast('委託已刪除');savePush();render();}

/* 自建清單 */
function openAddList(){SFX.tap();
  const icons=['book','bag','shield','music','sword','heart','gem','bell','crown','star'];
  let iconBtns=icons.map((ic,i)=>'<button class="iconpick'+(i===0?' on':'')+'" data-ic="'+ic+'">'+icon(ic)+'</button>').join('');
  $('overlays').innerHTML='<div class="sheetbg" id="listSheetBg"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('plus')+' 自建清單</div><div class="sheetsub">建立你專屬的任務分類。</div>'+
  '<label class="field">清單名稱</label><input type="text" id="l_name" placeholder="例如：健身計劃">'+
  '<label class="field">選擇圖示</label><div class="iconpickrow">'+iconBtns+'</div>'+
  '<button class="cta" style="width:100%;margin-top:14px" id="l_submit">建立清單</button></div></div>';
  let pickedIcon='book';
  $('listSheetBg').onclick=e=>{if(e.target.id==='listSheetBg')closeSheetForce();};
  document.querySelectorAll('.iconpick').forEach(b=>b.onclick=()=>{pickedIcon=b.dataset.ic;document.querySelectorAll('.iconpick').forEach(x=>x.classList.remove('on'));b.classList.add('on');SFX.tap();});
  $('l_submit').onclick=()=>{const name=$('l_name').value.trim();if(!name){toast('請輸入清單名稱');return;}
    S.lists.push({id:'list'+nid(),name,icon:pickedIcon});SFX.approve();closeSheetForce();toast('清單已建立 ✦');savePush();render();};
}
