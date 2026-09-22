
/* ===== 公主端狀態 ===== */
let uid=Date.now()%100000; const nid=()=>'t'+(uid++)+Math.floor(Math.random()*999);
let TODAY=new Date();
let viewDate=new Date();   // 目前瀏覽的日期（可用箭頭切換）

const S={
  role:'princess', muted:false, musicOff:false, musicVol:0.18,
  coins:2000, xp:160, tab:'bounty', scope:'day',
  avatar:'princess',   // HUD 大頭貼（公主端預設公主，可改成已擁有角色）
  activePet:'cat',
  paired:false, roomCode:'',
  tasks:[], // 會由 Firebase 同步或本地載入
  // 公主端是管理端：角色/夥伴全解鎖方便預覽
  pets:{slime:{hunger:80,joy:75,sick:false},cat:{hunger:80,joy:75,sick:false},wolf:{hunger:80,joy:75,sick:false},dragon:{hunger:80,joy:75,sick:false}},
  ownedPets:['slime','cat','wolf','dragon'],
  ownedRoles:['knight','mage','klein','viola','cecilia','astrea','roselyn','cyril','lily','noelle','mia'],
  ownedBg:['town','forest','garden','castle','temple','cathedral'], currentBg:'town',
  bag:{carrot:3,cheese:2,chicken:2,sushi:1,potion:2},
  prices:{}, // 公主可改的兌換價（覆蓋預設）
};

const DEFAULT_TASKS=[
  {id:nid(),title:'晨間修練 十分鐘',scope:'day',rank:'C',coins:15,xp:20,status:'done',assignee:'self',note:'',date:dstr(TODAY)},
  {id:nid(),title:'研讀魔導書 半時辰',scope:'day',rank:'B',coins:25,xp:35,status:'open',assignee:'self',note:'今日進度：第三章',date:dstr(TODAY)},
  {id:nid(),title:'整理書齋',scope:'day',rank:'B',coins:30,xp:40,status:'submitted',assignee:'knight',note:'',date:dstr(TODAY)},
  {id:nid(),title:'完成週之奏報',scope:'week',rank:'A',coins:60,xp:90,status:'open',assignee:'self',note:''},
  {id:nid(),title:'修練三回',scope:'week',rank:'A',coins:80,xp:120,status:'open',assignee:'self',note:''},
  {id:nid(),title:'積攢本月星幣',scope:'month',rank:'S',coins:150,xp:200,status:'open',assignee:'self',note:''},
];

function dstr(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function roleCost(k){return (S.prices['role_'+k]!=null)?S.prices['role_'+k]:(ROLEMETA[k].cost||300);}
function petCost(k){return (S.prices['pet_'+k]!=null)?S.prices['pet_'+k]:PETMETA[k].cost;}
function bgCost(k){return (S.prices['bg_'+k]!=null)?S.prices['bg_'+k]:BGMETA[k].cost;}
function foodCost(k){const base=k==='potion'?POTION.cost:FOODS[k].cost;return (S.prices['food_'+k]!=null)?S.prices['food_'+k]:base;}
function prizeCost(p){return (S.prices['prize_'+p.id]!=null)?S.prices['prize_'+p.id]:p.cost;}
const lvl=()=>Math.floor(S.xp/100)+1;

/* ===== 本地儲存 ===== */
function save(){try{localStorage.setItem('pk_princess',JSON.stringify({coins:S.coins,xp:S.xp,avatar:S.avatar,activePet:S.activePet,pets:S.pets,ownedPets:S.ownedPets,ownedRoles:S.ownedRoles,ownedBg:S.ownedBg,currentBg:S.currentBg,bag:S.bag,prices:S.prices,muted:S.muted,musicOff:S.musicOff,musicVol:S.musicVol,roomCode:S.roomCode,paired:S.paired,tasks:S.tasks}));}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem('pk_princess'));if(d)Object.assign(S,d);}catch(e){}}
