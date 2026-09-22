/* ===== 騎士端狀態 ===== */
function $(id){return document.getElementById(id);}
function el(html){const d=document.createElement('div');d.innerHTML=html;return d.firstElementChild;}
let uid=Date.now()%100000; const nid=()=>'t'+(uid++)+Math.floor(Math.random()*999);
let TODAY=new Date();
let viewDate=new Date();

const S={
  role:'knight', muted:false, musicOff:false, musicVol:0.18,
  knightName:'', myRole:'knight',  // 騎士選的代表角色（初始只有 knight）
  coins:0, xp:160, tab:'bounty', scope:'day',
  avatar:'knight',
  activePet:null,
  paired:false, roomCode:'',
  tasks:[],            // 共享任務（與公主同步）
  myTasks:[],          // 騎士自建任務
  lists:[              // 自建清單（預設四個）
    {id:'study',name:'修練手札',icon:'book'},
    {id:'shop',name:'補給採買',icon:'bag'},
    {id:'daily',name:'日常委託',icon:'shield'},
    {id:'movie',name:'幻影劇場',icon:'music'},
  ],
  completedCount:0,    // 永久累計完成數（用於角色出場）
  pets:{},
  ownedPets:[],
  ownedRoles:['knight'],   // 初始只有騎士
  ownedBg:['town'], currentBg:'town',
  bag:{carrot:0,cheese:0,chicken:0,sushi:0,potion:0},
  DATA_VERSION:2,      // 資料版本（用於遷移）
};

const lvl=()=>Math.floor(S.xp/100)+1;
function dstr(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function roleCost(k){return ROLEMETA[k].cost||300;}
function petCost(k){return PETMETA[k].cost;}
function bgCost(k){return BGMETA[k].cost;}
function foodCost(k){return k==='potion'?POTION.cost:FOODS[k].cost;}

/* ===== 本地儲存（含版本遷移）===== */
function save(){try{localStorage.setItem('pk_knight',JSON.stringify(snapshot()));}catch(e){}}
function snapshot(){return {v:S.DATA_VERSION,knightName:S.knightName,myRole:S.myRole,coins:S.coins,xp:S.xp,avatar:S.avatar,activePet:S.activePet,pets:S.pets,ownedPets:S.ownedPets,ownedRoles:S.ownedRoles,ownedBg:S.ownedBg,currentBg:S.currentBg,bag:S.bag,muted:S.muted,musicOff:S.musicOff,musicVol:S.musicVol,roomCode:S.roomCode,paired:S.paired,myTasks:S.myTasks,lists:S.lists,completedCount:S.completedCount};}
function migrate(d){
  // 資料版本遷移：確保舊版資料在新版能用
  if(!d.v||d.v<2){
    d.lists=d.lists||[{id:'study',name:'修練手札',icon:'book'},{id:'shop',name:'補給採買',icon:'bag'},{id:'daily',name:'日常委託',icon:'shield'},{id:'movie',name:'幻影劇場',icon:'music'}];
    d.completedCount=d.completedCount||0;
    d.myTasks=d.myTasks||[];
  }
  return d;
}
function load(){try{let d=JSON.parse(localStorage.getItem('pk_knight'));if(d){d=migrate(d);Object.assign(S,d);}}catch(e){}}

/* ===== 匯出/匯入備份碼 ===== */
function exportBackup(){
  const data=snapshot();data._tasks=S.tasks;data._exported=Date.now();
  const json=JSON.stringify(data);
  // 壓成 base64 備份碼
  return btoa(unescape(encodeURIComponent(json)));
}
function importBackup(code){
  try{
    const json=decodeURIComponent(escape(atob(code.trim())));
    let d=JSON.parse(json);d=migrate(d);
    if(d._tasks){S.tasks=d._tasks;delete d._tasks;}
    delete d._exported;
    Object.assign(S,d);save();
    if(S.paired){pushPrivate();pushShared({tasks:S.tasks});}
    return true;
  }catch(e){return false;}
}
