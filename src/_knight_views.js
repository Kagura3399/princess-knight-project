/* ===== 騎士端懸賞分頁 ===== */
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
function allBountyTasks(){
  // 公主發給騎士的 + 騎士自建任務，合併顯示
  const fromPrincess=S.tasks.filter(t=>t.assignee==='knight');
  return fromPrincess;
}
function viewBounty(){
  const f=fmtDateNav();
  let html='<div class="scope">'+['day','week','month'].map(s=>'<button class="'+(S.scope===s?'on':'')+'" onclick="setScope(\''+s+'\')">'+({day:'每日',week:'每週',month:'每月'})[s]+'</button>').join('')+'</div>';
  html+='<div class="datenav"><button class="arrow" onclick="shiftDate(-1)">'+icon('left')+'</button>';
  html+='<div class="datehead" '+(S.scope==='month'?'onclick="openYearMonth()"':'')+'><div class="d">'+f.d+'</div><div class="w">'+f.w+'</div></div>';
  html+='<button class="arrow" onclick="shiftDate(1)">'+icon('right')+'</button></div>';
  if(S.scope==='month')html+=monthCal();
  const list=allBountyTasks().filter(t=>{if(t.scope!==S.scope)return false;if(S.scope==='day'&&t.date)return t.date===dstr(viewDate);return true;});
  const done=list.filter(t=>t.status==='done').length;
  html+='<div class="boardhead"><div class="t">'+icon('bell')+' 公主的懸賞</div><div class="c">'+done+' / '+list.length+' 達成</div></div>';
  html+='<div class="progress"><i style="width:'+(list.length?done/list.length*100:0)+'%"></i></div>';
  html+=list.map(bountyCard).join('')||'<div class="empty"><div class="star">✦</div>公主還沒張貼懸賞給你。<br>先到「手札」完成自己的修練吧。</div>';
  return html;
}
function bountyCard(t){
  const col=RANKC[t.rank];
  const sm={open:['可接取','#7FC4FF'],accepted:['進行中','#A88BFF'],submitted:['審核中','#F0C04A'],done:['已完成','#3FE0A8']}[t.status];
  let action='';
  if(t.status==='open')action='<button class="acceptbtn" onclick="event.stopPropagation();acceptBounty(\''+t.id+'\')">接下</button>';
  else if(t.status==='accepted')action='<button class="reportbtn" onclick="event.stopPropagation();reportBounty(\''+t.id+'\')">回報</button>';
  else if(t.status==='submitted')action='<div class="waitbox">'+icon('clock')+'</div>';
  else action='<div class="donebox">'+icon('check')+'</div>';
  return '<div class="bounty '+(t.status==='done'?'done':'')+'"><div class="edge" style="background:'+col+';box-shadow:0 0 12px '+col+'"></div>'+
    '<div class="seal" style="border-color:'+col+';color:'+col+'">'+icon('sword')+'</div>'+
    '<div class="info"><div class="row1"><span class="rank" style="background:'+col+'">'+t.rank+'</span><span class="status" style="color:'+sm[1]+'">'+sm[0]+'</span></div>'+
    '<div class="title">'+t.title+'</div>'+
    (t.note?'<div class="bnote">'+icon('book')+' '+t.note+'</div>':'')+
    '<div class="rewards"><span class="rew coin">'+icon('coin')+' '+t.coins+'</span><span class="rew xp">'+icon('xp')+' '+t.xp+'</span></div></div>'+
    action+'</div>';
}
function setScope(s){SFX.tap();S.scope=s;viewDate=new Date(TODAY);render();}
function monthCal(){
  const d=viewDate,y=d.getFullYear(),m=d.getMonth();const first=new Date(y,m,1).getDay();const days=new Date(y,m+1,0).getDate();
  const taskDays={};allBountyTasks().forEach(t=>{if(t.date){const dd=t.date.split('-');if(+dd[0]===y&&+dd[1]===m+1)taskDays[+dd[2]]=1;}});
  let cells='';for(let i=0;i<first;i++)cells+='<div class="calcell" style="background:transparent;cursor:default"></div>';
  for(let i=1;i<=days;i++){const today=(i===TODAY.getDate()&&m===TODAY.getMonth()&&y===TODAY.getFullYear());const has=taskDays[i];
    cells+='<div class="calcell '+(today?'today':'')+(has?' has':'')+'" onclick="pickCalDay('+i+')">'+i+(has&&!today?'<span class="pip"></span>':'')+'</div>';}
  return '<div class="cal"><div class="calgrid">'+['日','一','二','三','四','五','六'].map(w=>'<div class="wd">'+w+'</div>').join('')+cells+'</div></div>';
}
function pickCalDay(day){SFX.tap();const d=viewDate;viewDate=new Date(d.getFullYear(),d.getMonth(),day);S.scope='day';render();}

/* 接懸賞流程 */
function acceptBounty(id){const t=S.tasks.find(x=>x.id===id);if(!t)return;t.status='accepted';SFX.tap();toast('已接下懸賞，加油！');syncPush();render();renderNav();}
function reportBounty(id){const t=S.tasks.find(x=>x.id===id);if(!t)return;t.status='submitted';SFX.publish();
  // 騎士回報→公主端審核。顯示公主口諭
  const note=KNIGHT_NOTES[Math.floor(Math.random()*KNIGHT_NOTES.length)];
  const d=el('<div class="praise"><img src="'+IMG.princess+'"><div><div class="pl">公主的口諭</div><div class="pt">'+note+'</div></div></div>');$('overlays').appendChild(d);setTimeout(()=>d.remove(),2900);
  toast('已回報，等候公主審核 ✦');syncPush();render();renderNav();
}
