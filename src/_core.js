
/* ===== ICON 系統（中世紀復古線條）===== */
const IK=(p,sw)=>'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="'+(sw||2.2)+'" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';
const ICO={
  coin:()=>IK('<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="10.5" stroke-width="1.2"/><path d="M24 15 V33 M20 19.5 h6 a3 3 0 0 1 0 6 h-5 a3 3 0 0 0 0 6 h6" stroke-width="2"/>'),
  xp:()=>IK('<path d="M24 7 L28.5 18.5 L40 19.5 L31 27 L34 38.5 L24 32 L14 38.5 L17 27 L8 19.5 L19.5 18.5 Z"/>'),
  bell:()=>IK('<path d="M24 8 a10 10 0 0 1 10 10 c0 8 4 12 4 12 H10 s4 -4 4 -12 a10 10 0 0 1 10 -10Z"/><path d="M24 8 V5"/><circle cx="24" cy="5" r="1.6" fill="currentColor"/><path d="M20 34 a4 4 0 0 0 8 0"/>'),
  bag:()=>IK('<path d="M16 16 v-2 a8 8 0 0 1 16 0 v2"/><path d="M12 18 a4 4 0 0 1 4 -4 h16 a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 H16 a4 4 0 0 1 -4 -4 Z"/><path d="M20 24 h8 a2 2 0 0 1 2 2 v3 H18 v-3 a2 2 0 0 1 2 -2Z" stroke-width="1.8"/>'),
  sound:()=>IK('<path d="M12 20 h6 l8 -6 v20 l-8 -6 h-6 Z"/><path d="M31 18 a8 8 0 0 1 0 12 M35 14 a13 13 0 0 1 0 20"/>'),
  soundoff:()=>IK('<path d="M12 20 h6 l8 -6 v20 l-8 -6 h-6 Z"/><path d="M31 19 l10 10 M41 19 l-10 10"/>'),
  music:()=>IK('<path d="M19 30 V13 l16 -3 v17"/><circle cx="15" cy="31" r="4"/><circle cx="31" cy="28" r="4"/>'),
  gear:()=>IK('<circle cx="24" cy="24" r="5.5"/><path d="M24 9 v4 M24 35 v4 M9 24 h4 M35 24 h4 M13.5 13.5 l2.8 2.8 M31.7 31.7 l2.8 2.8 M34.5 13.5 l-2.8 2.8 M16.3 31.7 l-2.8 2.8"/>'),
  crown:()=>IK('<path d="M12 32 L10 16 L18 23 L24 12 L30 23 L38 16 L36 32 Z"/><path d="M12 36 h24"/><circle cx="24" cy="12" r="1.6" fill="currentColor"/>'),
  gem:()=>IK('<path d="M16 12 h16 l8 10 -16 16 -16 -16 Z"/><path d="M8 22 h32 M16 12 l4 10 M32 12 l-4 10 M24 38 l-4 -16 M24 38 l4 -16" stroke-width="1.5"/>'),
  shield:()=>IK('<path d="M24 7 L38 13 v12 c0 11 -14 16 -14 16 S10 36 10 25 V13 Z"/><path d="M19 24 l4 4 7 -8"/>'),
  sword:()=>IK('<path d="M30 8 L38 8 L38 16 L20 34 L14 34 L14 28 Z"/><path d="M14 28 L8 34 M11 31 L17 37 M20 34 L26 40"/>'),
  heart:()=>IK('<path d="M24 38 C10 28 8 18 14 14 c4 -3 8 -1 10 3 c2 -4 6 -6 10 -3 c6 4 4 14 -10 24Z"/>'),
  edit:()=>IK('<path d="M30 10 l8 8 -20 20 -10 2 2 -10 Z"/><path d="M27 13 l8 8"/>'),
  trash:()=>IK('<path d="M12 16 h24 M19 16 v-3 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v3 M15 16 l2 22 a2 2 0 0 0 2 2 h10 a2 2 0 0 0 2 -2 l2 -22"/><path d="M22 22 v12 M26 22 v12" stroke-width="1.8"/>'),
  left:()=>IK('<path d="M28 14 L18 24 L28 34"/>'),
  right:()=>IK('<path d="M20 14 L30 24 L20 34"/>'),
  plus:()=>IK('<path d="M24 12 v24 M12 24 h24"/>'),
  check:()=>IK('<path d="M12 25 l8 8 16 -18"/>',2.6),
  close:()=>IK('<path d="M15 15 l18 18 M33 15 l-18 18"/>'),
  cal:()=>IK('<rect x="9" y="12" width="30" height="28" rx="3"/><path d="M9 19 h30 M17 8 v8 M31 8 v8"/>'),
  clock:()=>IK('<circle cx="24" cy="24" r="15"/><path d="M24 15 v9 l6 4"/>'),
  back:()=>IK('<path d="M20 12 L10 24 L20 36 M10 24 H38"/>'),
  book:()=>IK('<path d="M12 10 h20 a2 2 0 0 1 2 2 v26 a2 2 0 0 0 -2 -2 H12 Z"/><path d="M12 10 a2 2 0 0 0 -2 2 v26 a2 2 0 0 1 2 -2"/><path d="M16 18 h12 M16 24 h12"/>'),
};
function icon(name,cls,size){return '<span class="ic '+(cls||'')+'" '+(size?'style="width:'+size+'px;height:'+size+'px"':'')+'>'+(ICO[name]?ICO[name]():'')+'</span>';}

/* ===== 音效 ===== */
let AC=null;
function ac(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC;}
function tone(f,t0,dur,type,g,glide){const a=ac(),o=a.createOscillator(),gn=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(glide)o.frequency.exponentialRampToValueAtTime(glide,t0+dur);gn.gain.setValueAtTime(.0001,t0);gn.gain.exponentialRampToValueAtTime(g||.16,t0+.012);gn.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(gn).connect(a.destination);o.start(t0);o.stop(t0+dur+.02);}
const SFX={
  complete(){if(S.muted)return;try{const t=ac().currentTime;[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.07,.32,'triangle',.16));tone(1568,t+.28,.5,'sine',.08);}catch(e){}},
  publish(){if(S.muted)return;try{const t=ac().currentTime;tone(196,t,.5,'sawtooth',.1,220);tone(294,t+.05,.45,'triangle',.1);tone(98,t+.18,.3,'sine',.14);}catch(e){}},
  redeem(){if(S.muted)return;try{const t=ac().currentTime;[880,1175,1568].forEach((f,i)=>tone(f,t+i*.05,.25,'sine',.12));tone(2093,t+.16,.35,'triangle',.06);}catch(e){}},
  approve(){if(S.muted)return;try{const t=ac().currentTime;tone(440,t,.4,'triangle',.14);tone(660,t+.12,.5,'sine',.12);tone(880,t+.24,.6,'sine',.08);}catch(e){}},
  summon(){if(S.muted)return;try{const t=ac().currentTime;[262,330,392,523,659,784].forEach((f,i)=>tone(f,t+i*.09,.5,'triangle',.13));tone(1047,t+.5,.8,'sine',.1);}catch(e){}},
  tap(){if(S.muted)return;try{tone(660,ac().currentTime,.08,'sine',.05);}catch(e){}},
  level(){if(S.muted)return;try{const t=ac().currentTime;[392,523,659,784,1047].forEach((f,i)=>tone(f,t+i*.08,.4,'triangle',.15));}catch(e){}},
};

/* ===== 背景音樂（合成星空氛圍，循環）===== */
let BGM={playing:false,nodes:[],gain:null,timer:null};
function bgmStart(){
  if(BGM.playing||S.musicOff)return;
  try{const a=ac();BGM.gain=a.createGain();BGM.gain.gain.value=(S.musicVol!=null?S.musicVol:0.18);BGM.gain.connect(a.destination);
    const pad=a.createGain();pad.gain.value=0.5;pad.connect(BGM.gain);
    // 緩慢和弦墊（A 小調氛圍）
    const freqs=[220,261.6,329.6];
    freqs.forEach((f,i)=>{const o=a.createOscillator();o.type='sine';o.frequency.value=f;
      const g=a.createGain();g.gain.value=0;o.connect(g).connect(pad);o.start();
      // 緩慢起伏
      const lfo=a.createOscillator();lfo.type='sine';lfo.frequency.value=0.05+i*0.02;
      const lg=a.createGain();lg.gain.value=0.08;lfo.connect(lg).connect(g.gain);lfo.start();
      g.gain.value=0.08;
      BGM.nodes.push(o,lfo);});
    // 偶爾的星光鈴音
    BGM.timer=setInterval(()=>{if(S.musicOff)return;const t=a.currentTime;const notes=[523,659,784,1047,1319];const n=notes[Math.floor(Math.random()*notes.length)];
      const o=a.createOscillator();o.type='triangle';o.frequency.value=n;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.06,t+0.3);g.gain.exponentialRampToValueAtTime(0.0001,t+2.5);o.connect(g).connect(BGM.gain);o.start(t);o.stop(t+2.6);},4000+Math.random()*3000);
    BGM.playing=true;
  }catch(e){}
}
function bgmStop(){if(!BGM.playing)return;try{BGM.nodes.forEach(n=>{try{n.stop()}catch(e){}});clearInterval(BGM.timer);BGM.nodes=[];BGM.playing=false;}catch(e){}}
function bgmVol(v){if(BGM.gain)BGM.gain.gain.value=v;}

/* ===== 星空背景 ===== */
function initStars(){const cv=document.getElementById('stars');if(!cv)return;const ctx=cv.getContext('2d');let w,h,stars=[];
function rs(){w=cv.width=cv.offsetWidth*2;h=cv.height=cv.offsetHeight*2;}rs();
for(let i=0;i<80;i++)stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.8+.3,s:Math.random()*.5+.1,p:Math.random()*7});
let t=0;function draw(){ctx.clearRect(0,0,w,h);t+=.02;stars.forEach(st=>{const tw=(Math.sin(t*st.s+st.p)+1)/2;ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,7);ctx.fillStyle='rgba('+(180+tw*60)+','+(160+tw*60)+',255,'+(.2+tw*.6)+')';ctx.fill();st.y+=.08;if(st.y>h)st.y=0;});requestAnimationFrame(draw);}draw();
window.addEventListener('resize',rs);}

/* ===== Firebase 同步層 ===== */
const FB_CONFIG={"apiKey": "AIzaSyAiPif0vwil15U9XSfhxWgysTJGmIX4NFk", "authDomain": "princess-knight-ff0f7.firebaseapp.com", "projectId": "princess-knight-ff0f7", "storageBucket": "princess-knight-ff0f7.firebasestorage.app", "messagingSenderId": "600452587965", "appId": "1:600452587965:web:3d81105a6742ecf06cf2d4", "measurementId": "G-X5YL3JG160"};
let DB=null, FBReady=false, ROOM=null, syncUnsub=null;
async function initFirebase(){
  try{
    const app=firebase.initializeApp(FB_CONFIG);
    DB=firebase.firestore();
    FBReady=true;
    return true;
  }catch(e){console.error('Firebase init 失敗',e);return false;}
}
// 配對碼 → 房間
function setRoom(code){ROOM=code.trim().toLowerCase();}
// 監聽共享資料（任務）
function watchShared(cb){
  if(!FBReady||!ROOM)return;
  if(syncUnsub)syncUnsub();
  syncUnsub=DB.collection('rooms').doc(ROOM).onSnapshot(doc=>{
    if(doc.exists)cb(doc.data());
  },err=>console.error('同步監聽錯誤',err));
}
// 寫入共享資料
async function pushShared(data){
  if(!FBReady||!ROOM)return false;
  try{await DB.collection('rooms').doc(ROOM).set(data,{merge:true});return true;}
  catch(e){console.error('寫入失敗',e);return false;}
}
