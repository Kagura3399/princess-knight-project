/* ===== 騎士端 設定（含備份碼）===== */
function openSettings(){SFX.tap();
  const bgThumbs=Object.keys(BGMETA).map(k=>{const owned=S.ownedBg.includes(k);return '<div class="bgthumb '+(S.currentBg===k?'on':'')+(owned?'':' locked')+'" style="background-image:url(\''+IMG['bg_'+k]+'\')" '+(owned?'onclick="setCurrentBg(\''+k+'\')"':'')+'><div class="bgn">'+BGMETA[k].name+'</div></div>';}).join('');
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('gear')+' 設定</div>'+
  '<div class="setrow"><div class="sleft">'+icon('sound')+' 音效</div><div class="sw '+(S.muted?'':'on')+'" onclick="toggleMute(this)"><i></i></div></div>'+
  '<div class="setrow"><div class="sleft">'+icon('music')+' 背景音樂</div><div class="sw '+(S.musicOff?'':'on')+'" onclick="toggleMusic(this)"><i></i></div></div>'+
  '<div class="setrow"><div class="sleft">'+icon('music')+' 音樂音量</div><input type="range" class="slider" min="0" max="40" value="'+Math.round(S.musicVol*100)+'" oninput="setMusicVol(this.value)"></div>'+
  '<div style="padding:14px 0"><div class="sleft" style="margin-bottom:10px">'+icon('gem')+' 背景選擇</div><div class="bgpick">'+bgThumbs+'</div></div>'+
  '<div class="setrow"><div class="sleft">'+icon('book')+' 資料備份</div><button class="editprice" onclick="openBackup()">匯出 / 匯入</button></div>'+
  '<div style="text-align:center;font-size:11px;color:var(--textDim);margin-top:10px">配對碼：'+(S.roomCode||'未設定')+'</div>'+
  '</div></div>';
}
function toggleMute(sw){S.muted=!S.muted;sw.classList.toggle('on');save();}
function toggleMusic(sw){S.musicOff=!S.musicOff;sw.classList.toggle('on');if(S.musicOff)bgmStop();else bgmStart();save();}
function setMusicVol(v){S.musicVol=v/100;bgmVol(S.musicVol);save();}
function setCurrentBg(k){S.currentBg=k;SFX.tap();savePush();applyBgClass();closeSheetForce();toast('背景已更換：'+BGMETA[k].name);}

/* 備份碼 */
function openBackup(){SFX.tap();const code=exportBackup();
  $('overlays').innerHTML='<div class="sheetbg" onclick="closeSheet(event)"><div class="sheet" onclick="event.stopPropagation()"><div class="handle"></div>'+
  '<div class="sheettitle">'+icon('book')+' 資料備份</div><div class="sheetsub">複製備份碼存到安全的地方。換手機或重裝時，貼回來即可還原所有進度。</div>'+
  '<label class="field">你的備份碼（長按複製）</label><textarea id="backupOut" readonly style="width:100%;height:90px;padding:12px;border-radius:12px;border:1.5px solid var(--line);background:rgba(0,0,0,.3);color:var(--text);font-size:11px;font-family:monospace;resize:none">'+code+'</textarea>'+
  '<button class="btnsec" style="width:100%;margin:8px 0 18px" onclick="copyBackup()">'+icon('book')+' 複製備份碼</button>'+
  '<label class="field">貼上備份碼還原</label><textarea id="backupIn" placeholder="貼上之前匯出的備份碼…" style="width:100%;height:70px;padding:12px;border-radius:12px;border:1.5px solid var(--line);background:rgba(0,0,0,.3);color:var(--text);font-size:11px;font-family:monospace;resize:none"></textarea>'+
  '<button class="cta" style="width:100%;margin-top:10px" onclick="doImport()">還原這份備份</button></div></div>';
}
function copyBackup(){const t=$('backupOut');t.select();try{document.execCommand('copy');toast('備份碼已複製');}catch(e){toast('請長按文字手動複製');}}
function doImport(){const code=$('backupIn').value.trim();if(!code){toast('請貼上備份碼');return;}
  if(importBackup(code)){SFX.approve();closeSheetForce();toast('資料已還原 ✦');renderNav();render();refreshHUD();applyBgClass();}
  else toast('備份碼無效，請檢查');
}

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
function closeSheetForce(){$('overlays').innerHTML='';}

/* 夥伴狀態下降（每30秒掉1飽足）*/
setInterval(()=>{
  const pid=S.activePet||S.ownedPets[0];const p=pid&&S.pets[pid];if(!p)return;
  if(!p.sick){p.hunger=Math.max(0,p.hunger-1);p.joy=Math.max(0,p.joy-0.5);
    if(p.hunger<=0){p._starve=(p._starve||0)+1;if(p._starve>=3){p.sick=true;p._starve=0;if(S.tab==='pets'){toast('夥伴餓壞生病了！需要治療藥水');render();}}}
  }else p.joy=Math.max(0,p.joy-0.6);
  save();if(S.tab==='pets'&&!document.querySelector('.sheetbg'))render();
},30000);

boot();
