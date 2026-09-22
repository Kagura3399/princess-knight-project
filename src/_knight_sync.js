/* ===== 騎士端 Firebase 同步（共享任務 + 個人進度都存雲端）===== */
let privateUnsub=null;
// 監聽共享任務
function startSync(){
  watchShared(data=>{
    if(data&&data.tasks){S.tasks=data.tasks;save();if(!$('main').classList.contains('hidden')){render();renderNav();}}
  });
  // 監聽自己的個人進度（換裝置時拉回）
  watchPrivate();
}
function watchPrivate(){
  if(!FBReady||!ROOM)return;
  if(privateUnsub)privateUnsub();
  privateUnsub=DB.collection('rooms').doc(ROOM).collection('private').doc('knight').onSnapshot(doc=>{
    if(doc.exists){
      const d=doc.data();
      // 只在雲端較新時套用（避免覆蓋本地剛改的）
      if(d._t&&(!S._lastPush||d._t>S._lastPush+500)){
        const cur=$('main')&&!$('main').classList.contains('hidden');
        migrate(d);Object.assign(S,d);save();
        if(cur){render();renderNav();refreshHUD();}
      }
    }
  },err=>console.error('個人進度監聽錯誤',err));
}
// 上傳個人進度到雲端
async function pushPrivate(){
  if(!FBReady||!ROOM)return;
  try{const data=snapshot();data._t=Date.now();S._lastPush=data._t;
    await DB.collection('rooms').doc(ROOM).collection('private').doc('knight').set(data,{merge:true});
  }catch(e){console.error('個人進度上傳失敗',e);}
}
// 共享任務推送
function syncPush(){if(S.paired)pushShared({tasks:S.tasks});save();pushPrivate();}
// 個人進度變動時呼叫（金幣、角色、夥伴等）
function savePush(){save();if(S.paired)pushPrivate();}
