/* ===== 懸賞分頁 ===== */
function fmtDateNav(){const d=viewDate;
  if(S.scope==='day')return{d:(d.getMonth()+1)+' 月 '+d.getDate()+' 日',w:WK[d.getDay()]};
  if(S.scope==='week'){const s=new Date(d);s.setDate(d.getDate()-d.getDay());const e=new Date(s);e.setDate(s.getDate()+6);return{d:(s.getMonth()+1)+'/'+s.getDate()+' – '+(e.getMonth()+1)+'/'+e.getDate(),w:'第 '+Math.ceil(d.getDate()/7)+' 週'};}
  return{d:d.getFullYear()+' 年 '+(d.getMonth()+1)+' 月',w:'星之計劃'};
}
function shiftDate(dir){SFX.tap();const d=viewDate;
  if(S.scope==='day')d.setDate(d.getDate()+dir);
  else if(S.scope==='week')d.setDate(d.getDate()+dir*7);
  else d.setMonth(d.getMonth()+dir);
  viewDate=new Date(d);render();
}
function viewBounty(){
  const f=fmtDateNav();
  let html='<div class="scope">'+['day','week','month'].map(s=>'<button class="'+(S.scope===s?'on':'')+'" onclick="setScope(\''+s+'\')">'+({day:'每日',week:'每週',month:'每月'})[s]+'</button>').join('')+'</div>';
  html+='<div class="datenav"><button class="arrow" onclick="shiftDate(-1)">'+icon('left')+'</button>';
  html+='<div class="datehead" '+(S.scope==='month'?'onclick="openYearMonth()"':'')+'><div class="d">'+f.d+'</div><div class="w">'+f.w+'</div></div>';
  html+='<button class="arrow" onclick="shiftDate(1)">'+icon('right')+'</button></div>';
  if(S.scope==='month')html+=monthCal();
  const list=scopedTasks();
  const done=list.filter(t=>t.status==='done').length;
  html+='<div class="boardhead"><div class="t">'+icon('bell')+' 懸賞布告欄</div><div class="c">'+done+' / '+list.length+' 達成</div></div>';
  html+='<div class="progress"><i style="width:'+(list.length?done/list.length*100:0)+'%"></i></div>';
  html+=list.map(bountyCard).join('')||'<div class="empty"><div class="star">✦</div>此時段沒有懸賞。<br>點右下角張貼第一張懸賞令吧。</div>';
  return html;
}
function scopedTasks(){
  return S.tasks.filter(t=>{
    if(t.scope!==S.scope)return false;
    if(S.scope==='day'&&t.date)return t.date===dstr(viewDate);
    return true;
  });
}
function bountyCard(t){
  const col=RANKC[t.rank];
  const sm={open:['招募中','#B8B4E0'],accepted:['進行中','#7FC4FF'],submitted:['待審核','#F0C04A'],done:['已完成','#3FE0A8']}[t.status];
  const isOther=t.assignee!=='self';
  let action='';
  if(!isOther)action='<button class="chk '+(t.status==='done'?'done':'')+'" onclick="event.stopPropagation();toggleSelf(\''+t.id+'\')">'+(t.status==='done'?icon('check'):'')+'</button>';
  else if(t.status==='submitted')action='<button class="reviewbtn" onclick="event.stopPropagation();openReview(\''+t.id+'\')">審核</button>';
  else action='<div class="donebox '+(t.status==='done'?'':'empty')+'">'+(t.status==='done'?icon('check'):'')+'</div>';
  const assignName=isOther?(ROLEMETA[t.assignee]?ROLEMETA[t.assignee].name:t.assignee):'';
  return '<div class="bounty '+(t.status==='done'?'done':'')+'" onclick="openTaskMenu(\''+t.id+'\')"><div class="edge" style="background:'+col+';box-shadow:0 0 12px '+col+'"></div>'+
    '<div class="seal" style="border-color:'+col+';color:'+col+'">'+icon('sword')+'</div>'+
    '<div class="info"><div class="row1"><span class="rank" style="background:'+col+'">'+t.rank+'</span><span class="status" style="color:'+sm[1]+'">'+sm[0]+'</span></div>'+
    '<div class="title">'+t.title+'</div>'+
    (t.note?'<div class="bnote">'+icon('book')+' '+t.note+'</div>':'')+
    '<div class="rewards"><span class="rew coin">'+icon('coin')+' '+t.coins+'</span><span class="rew xp">'+icon('xp')+' '+t.xp+'</span>'+(isOther?'<span class="assign">懸賞予 · '+assignName+'</span>':'')+'</div></div>'+
    action+'</div>';
}
function setScope(s){SFX.tap();S.scope=s;viewDate=new Date(TODAY);render();}
function monthCal(){
  const d=viewDate,y=d.getFullYear(),m=d.getMonth();const first=new Date(y,m,1).getDay();const days=new Date(y,m+1,0).getDate();
  const taskDays={};S.tasks.forEach(t=>{if(t.date){const dd=t.date.split('-');if(+dd[0]===y&&+dd[1]===m+1)taskDays[+dd[2]]=1;}});
  let cells='';for(let i=0;i<first;i++)cells+='<div class="calcell" style="background:transparent;cursor:default"></div>';
  for(let i=1;i<=days;i++){const today=(i===TODAY.getDate()&&m===TODAY.getMonth()&&y===TODAY.getFullYear());const has=taskDays[i];
    cells+='<div class="calcell '+(today?'today':'')+(has?' has':'')+'" onclick="pickCalDay('+i+')">'+i+(has&&!today?'<span class="pip"></span>':'')+'</div>';}
  return '<div class="cal"><div class="calgrid">'+['日','一','二','三','四','五','六'].map(w=>'<div class="wd">'+w+'</div>').join('')+cells+'</div></div>';
}
function pickCalDay(day){SFX.tap();const d=viewDate;const picked=new Date(d.getFullYear(),d.getMonth(),day);viewDate=picked;S.scope='day';render();}

function toggleSelf(id){const t=S.tasks.find(x=>x.id===id);if(!t)return;
  if(t.status==='done'){t.status='open';S.coins=Math.max(0,S.coins-t.coins);S.xp=Math.max(0,S.xp-t.xp);}
  else{t.status='done';award(t);SFX.complete();praise();}
  syncPush();refreshHUD();render();renderNav();
}

/* 任務選單（編輯/刪除） */
function openTaskMenu(id){const t=S.tasks.find(x=>x.id===id);if(!t)return;SFX.tap();
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('sword')+' '+t.title+'</div><div class="sheetsub">難度 '+t.rank+' · '+icon('coin')+' '+t.coins+' · '+icon('xp')+' '+t.xp+'</div>'+
  '<div class="sheetbtns"><button class="btnsec" onclick="openAddBounty(\''+id+'\')">'+icon('edit')+' 編輯懸賞</button>'+
  '<button class="btnsec btndanger" onclick="deleteTask(\''+id+'\')">'+icon('trash')+' 刪除懸賞</button></div></div></div>';
}
function deleteTask(id){S.tasks=S.tasks.filter(x=>x.id!==id);SFX.tap();closeSheetForce();toast('懸賞已撤下');syncPush();render();renderNav();}

/* 審核 */
function openReview(id){SFX.tap();const t=S.tasks.find(x=>x.id===id);
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div style="text-align:center;margin-bottom:16px"><div class="seal" style="margin:0 auto 8px;width:64px;height:64px;border-color:'+RANKC[t.rank]+';color:'+RANKC[t.rank]+'">'+icon('shield')+'</div>'+
  '<div style="font-size:18px;color:#fff">審核懸賞</div><div style="font-size:13px;color:var(--textDim);margin-top:4px">騎士回報已完成</div></div>'+
  '<div style="background:rgba(0,0,0,.3);border-radius:14px;padding:16px;border:1px solid var(--line)"><div style="font-size:15px;color:#fff;margin-bottom:8px">'+t.title+'</div>'+
  '<div class="rewards"><span class="rew coin">'+icon('coin')+' '+t.coins+'</span><span class="rew xp">'+icon('xp')+' '+t.xp+'</span></div></div>'+
  '<div class="sheetbtns"><button class="btnsec" onclick="rejectTask(\''+id+'\')">退回重試</button>'+
  '<button class="cta" style="flex:2;width:auto;padding:13px 0" onclick="approveTask(\''+id+'\')">核發獎勵 ✦</button></div></div></div>';
}
function approveTask(id){const t=S.tasks.find(x=>x.id===id);t.status='done';award(t);SFX.approve();closeSheetForce();praise();toast('已核發獎勵 ✦');syncPush();refreshHUD();render();renderNav();}
function rejectTask(id){const t=S.tasks.find(x=>x.id===id);t.status='accepted';SFX.tap();closeSheetForce();toast('已退回，請騎士重試');syncPush();render();renderNav();}
