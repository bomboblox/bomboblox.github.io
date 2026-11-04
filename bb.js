/* Bomboblox shared code. Load the firebase app/auth/firestore compat scripts BEFORE this file. */

/* ====== 1) FIREBASE CONFIG (already filled in) ====== */
var BB_FIREBASE={apiKey:"AIzaSyA1yGuSQ1sK5_oESRyTmfV_q5i6ZiLhdt0",authDomain:"bomboblox.firebaseapp.com",projectId:"bomboblox",storageBucket:"bomboblox.firebasestorage.app",messagingSenderId:"213718036243",appId:"1:213718036243:web:ab59b8145667ed764a74e6"};
/* ====== 2) PASTE THE UID OF YOUR OWNER ACCOUNT HERE ====== */
var OWNER_UID='PASTE-OWNER-UID-HERE';

firebase.initializeApp(BB_FIREBASE);
var auth=firebase.auth(),db=firebase.firestore();
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function bbDate(iso){return iso?new Date(iso).toLocaleDateString():''}
function bbFmt(n){return Number(n||0).toLocaleString()}

/* ====================== AVATARS (everyone starts as a noob) ====================== */
/* look ids: 'noob' is free. look1..look10 are bought in the shop (price must match lookPrice() in RULES.txt) */
var BB_LOOKS={
  noob:{n:'Noob',h:'#f5cd30',t:'#0d69ac',l:'#a3c76d',a:'#f5cd30',p:0},
  look1:{n:'Sambusa Orange',h:'#f5cd30',t:'#ff8c1a',l:'#8a3b00',a:'#ff8c1a',p:10},
  look2:{n:'Shaah Brown',h:'#e8b98a',t:'#7b4a2a',l:'#3d2616',a:'#7b4a2a',p:20},
  look3:{n:'Bariis Cream',h:'#f5cd30',t:'#f3e7c9',l:'#c9b27c',a:'#f3e7c9',p:30},
  look4:{n:'Hooyo Pink',h:'#f5cd30',t:'#ff6fb5',l:'#8e2a68',a:'#ff6fb5',p:40},
  look5:{n:'Adeer Green',h:'#e8b98a',t:'#2e8b57',l:'#1b4d33',a:'#2e8b57',p:50},
  look6:{n:'Canjeero Gold',h:'#f5cd30',t:'#e0a800',l:'#7a5c00',a:'#e0a800',p:60},
  look7:{n:'Bombo Candy',h:'#fff',t:'#ff2b55',l:'#ffffff',a:'#ff2b55',p:70},
  look8:{n:'Cambuulo Purple',h:'#f5cd30',t:'#7b3fe4',l:'#3b1c80',a:'#7b3fe4',p:80},
  look9:{n:'Xawaash Red',h:'#e8b98a',t:'#c0301a',l:'#5e140a',a:'#c0301a',p:90},
  look10:{n:'Royal Bombo',h:'#f5cd30',t:'#ffd700',l:'#5b2fb3',a:'#ffd700',p:100}
};
var LOOK_IDS=['look1','look2','look3','look4','look5','look6','look7','look8','look9','look10'];
function bbLook(id){return BB_LOOKS[id]||BB_LOOKS.noob}
function bbSvg(look){var L=bbLook(look),s='stroke="#000" stroke-opacity=".3" stroke-width="1"';
  return '<svg viewBox="0 0 40 64" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+
  '<rect x="1" y="18" width="7" height="20" fill="'+L.a+'" '+s+'/><rect x="32" y="18" width="7" height="20" fill="'+L.a+'" '+s+'/>'+
  '<rect x="9" y="18" width="22" height="20" fill="'+L.t+'" '+s+'/>'+
  '<rect x="9" y="39" width="10.5" height="23" fill="'+L.l+'" '+s+'/><rect x="20.5" y="39" width="10.5" height="23" fill="'+L.l+'" '+s+'/>'+
  '<rect x="12" y="2" width="16" height="15" fill="'+L.h+'" '+s+'/><rect x="16" y="7" width="2.4" height="3.4" fill="#15121b"/><rect x="21.6" y="7" width="2.4" height="3.4" fill="#15121b"/><rect x="16" y="12.2" width="8" height="1.6" fill="#15121b"/></svg>'}
/* an avatar tile. It first shows the initial, then swaps itself for the persons real avatar. */
function bbAvU(uid,name,size,href){var t=href?'a':'div';return '<'+t+(href?' href="'+href+'"':'')+' class="av" data-u="'+esc(uid)+'" style="width:'+size+'px;height:'+size+'px;font-size:'+Math.round(size*.45)+'px">'+esc((name||'?')[0].toUpperCase())+'</'+t+'>'}
var _uc={};
function bbUser(uid){if(!_uc[uid])_uc[uid]=db.collection('users').doc(uid).get().then(function(d){return d.exists?d.data():{}}).catch(function(){delete _uc[uid];return null});return _uc[uid]}
function bbFill(){document.querySelectorAll('.av[data-u]:not([data-d])').forEach(function(el){el.dataset.d=1;
  bbUser(el.dataset.u).then(function(u){if(u===null){el.dataset.d='fail';return}el.innerHTML=bbSvg(u.look);el.classList.add('has')})})}
function bbRefreshAv(uid){if(uid)delete _uc[uid];else _uc={};document.querySelectorAll('.av[data-d]').forEach(function(e){e.removeAttribute('data-d')});bbFill()}
if(document.body)new MutationObserver(function(){clearTimeout(window._bt);window._bt=setTimeout(bbFill,50)}).observe(document.body,{childList:true,subtree:true});

/* ====================== GLOBAL STYLES (same look as SomaliTube) ====================== */
(function(){var c=document.createElement('style');c.textContent=
'*{margin:0;padding:0;box-sizing:border-box}body{background:#15121b;color:#f1f1f1;font-family:Rubik,Verdana,sans-serif;min-height:100vh;display:flex;flex-direction:column}a{color:inherit;text-decoration:none}'+
'#topbar{background:#1a1724;border-bottom:4px solid #ff8c1a;min-height:68px;display:flex;flex-wrap:wrap;align-items:center;padding:8px 16px;gap:10px;position:sticky;top:0;z-index:100}'+
'#logo{font-family:Bungee,Impact,fantasy;font-size:28px;color:#fff;letter-spacing:2px;text-shadow:3px 3px 0 #ff8c1a;white-space:nowrap}.bb-logo{height:40px;width:auto;max-width:280px;display:block}'+
'#search-wrap{display:flex;flex:1 1 220px;max-width:380px;margin:0 auto}#search-input{flex:1;min-width:0;height:36px;background:#2b2638;border:2px solid #3a3450;border-right:none;color:#fff;font:13px Rubik,sans-serif;padding:0 12px;outline:none}#search-input:focus{border-color:#ff8c1a}'+
'#search-btn{height:36px;padding:0 16px;background:#ff8c1a;border:2px solid #ff8c1a;color:#fff;font:900 12px Rubik,sans-serif;cursor:pointer;letter-spacing:1px}#search-btn:hover{background:#e07300}'+
'#auth-area{margin-left:auto;display:flex;gap:8px;align-items:center}.nav-me{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:900}'+
'.auth-btn{height:36px;padding:0 20px;font:900 13px Rubik,sans-serif;cursor:pointer;display:inline-flex;align-items:center;border:2px solid #ff8c1a}#btn-login{background:transparent;color:#ff8c1a}#btn-login:hover{background:#ff8c1a;color:#fff}#btn-signup{background:#ff8c1a;color:#fff}'+
'main{flex:1;max-width:1100px;width:100%;margin:0 auto;padding:28px 16px;display:flex;flex-direction:column;gap:24px}'+
'footer{background:#1a1724;border-top:4px solid #ff8c1a;padding:14px 20px;text-align:center;font-size:12px;color:#666}'+
'.section-label{font-family:Bungee,Impact,fantasy;font-size:22px;color:#ff8c1a;letter-spacing:2px;border-left:5px solid #ff8c1a;padding-left:12px;line-height:1.1}'+
'.card{background:#201c2b;border:2px solid #2b2638;padding:16px}.empty{font-size:13px;color:#777;padding:14px 0;line-height:1.5}'+
'.btn{height:36px;padding:0 16px;font:900 13px Rubik,sans-serif;cursor:pointer;border:2px solid #ff8c1a;background:#ff8c1a;color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}.btn:hover{background:#e07300;border-color:#e07300}'+
'.btn.outline{background:transparent;color:#ff8c1a}.btn.outline:hover{background:#ff8c1a;color:#fff}.btn.green{background:#3ddc84;border-color:#3ddc84;color:#15121b}.btn.red{background:transparent;border-color:#ff4d6d;color:#ff4d6d}.btn.red:hover{background:#ff4d6d;color:#fff}.btn:disabled{opacity:.5;cursor:default}'+
'.txt{height:40px;background:#2b2638;border:2px solid #3a3450;color:#f1f1f1;font:14px Rubik,sans-serif;padding:0 12px;outline:none;min-width:0}.txt:focus{border-color:#ff8c1a}textarea.txt{height:90px;padding:10px 12px;resize:vertical;width:100%}'+
'.av{display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-family:Bungee,Impact,fantasy;flex-shrink:0;background:#2b2638;border:2px solid #3a3450;overflow:hidden}.av.has{background:#3a3a3a}.av svg{width:100%;height:100%;padding:6%}'+
'.friend-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}'+
'.ftile{background:#201c2b;border:2px solid #2b2638;padding:12px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;min-width:0}.ftile:hover{border-color:#ff8c1a}.ftile .av{width:100%!important;height:auto!important;aspect-ratio:1}'+
'.ftile .fn{font-size:14px;font-weight:900;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ftile .btn{height:28px;font-size:12px;width:100%}'+
'.rq{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid #2b2638}.rq .rn{flex:1;min-width:0;font-size:14px;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rq .btn{height:30px;padding:0 10px;font-size:12px}'+
'.st-modal{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px}.st-box{background:#201c2b;border:3px solid #ff8c1a;max-width:420px;width:100%;max-height:80vh;display:flex;flex-direction:column}'+
/* points pill + shop bits */
'.pts-pill{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 6px 0 10px;background:#3a2308;border:2px solid #ff8c1a;color:#fff;font:900 14px Rubik,sans-serif;cursor:pointer;white-space:nowrap}.pts-pill:hover{background:#ff8c1a}'+
'.pts-coin{width:20px;height:20px;object-fit:contain;display:block;flex-shrink:0}.pts-go{background:#ff8c1a;color:#fff;font-size:10px;letter-spacing:1px;padding:3px 6px;margin-left:2px}'+
'.shop-msg{font-size:13px;font-weight:900;margin:6px 0}.shop-msg:empty{display:none}.shop-msg.ok{color:#3ddc84}.shop-msg.bad{color:#ff4d6d}'+
/* inbox */
'.ib-btn{position:relative;height:34px;width:40px;background:transparent;border:2px solid #ff8c1a;color:#fff;font-size:17px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}.ib-btn:hover{background:#ff8c1a}'+
'.ib-badge{position:absolute;top:-9px;right:-9px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#ff2b2b;color:#fff;font:900 11px Rubik,sans-serif;align-items:center;justify-content:center;border:2px solid #1a1724}'+
'#ib-panel{position:fixed;right:12px;width:380px;max-width:calc(100vw - 24px);max-height:70vh;display:flex;flex-direction:column;background:#201c2b;border:3px solid #ff8c1a;z-index:200;box-shadow:6px 6px 0 #000}'+
'.ib-head{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:2px solid #2b2638;font:15px Bungee,Impact,fantasy;letter-spacing:2px;color:#ff8c1a}.ib-head span{flex:1}'+
'.ib-clear{background:none;border:none;color:#888;font:900 12px Rubik,sans-serif;cursor:pointer}.ib-clear:hover{color:#ff4d6d}'+
'.ib-list{overflow-y:auto}.ib-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #2b2638}.ib-row:hover{background:#272233}.ib-row.new{background:#3a2308;border-left:4px solid #ff8c1a}'+
'.ib-m{min-width:0}.ib-t{font-size:13px;line-height:1.4;overflow-wrap:anywhere}.ib-t b{color:#ff8c1a}.ib-q{color:#bbb}.ib-time{font-size:11px;color:#666;margin-top:2px}.ib-empty{padding:22px 16px;font-size:13px;color:#777;line-height:1.5}'+
/* gift popup */
'.gift-box{max-width:360px;text-align:center;padding:26px 22px;align-items:center;gap:6px}.gift-ico{font-size:60px;line-height:1}.gift-t{font-size:16px;font-weight:900}.gift-t b{color:#ff8c1a}'+
'.gift-n{display:flex;align-items:center;justify-content:center;gap:10px;font:39px Bungee,Impact,fantasy;letter-spacing:2px}.gift-n .pts-coin{width:44px;height:44px}.gift-s{font-size:13px;font-weight:900;color:#ff8c1a;margin-bottom:10px}'+
'.gift-claim{width:100%;height:52px;background:#3ddc84;border:none;color:#15121b;font:18px Bungee,Impact,fantasy;letter-spacing:3px;cursor:pointer}.gift-later{background:none;border:none;color:#777;font:900 12px Rubik,sans-serif;cursor:pointer;margin-top:6px}'+
/* sidebar */
':root{--sbw:230px}@media(max-width:760px){:root{--sbw:66px}}body.has-side{padding-left:var(--sbw)}body.has-side #topbar{margin-left:calc(var(--sbw) * -1)}'+
'#sidebar{position:fixed;left:0;top:72px;bottom:0;width:var(--sbw);background:#13101a;border-right:3px solid #2b2638;z-index:90;display:flex;flex-direction:column;gap:12px;padding:16px 14px;overflow-y:auto}'+
'.sb-btn{display:flex;align-items:center;gap:14px;height:54px;padding:0 16px;background:#15121b;border:2px solid #ff8c1a;color:#ff8c1a;font:900 17px Rubik,Verdana,sans-serif;white-space:nowrap;flex-shrink:0}.sb-btn .sb-i{font-size:22px;width:28px;text-align:center;flex-shrink:0}.sb-btn:hover,.sb-btn.on{background:#ff8c1a;color:#fff}.sb-i .pts-coin{width:26px;height:26px}'+
'.sb-btn.sb-admin{border-color:#ff4d6d;color:#ff4d6d}.sb-btn.sb-admin:hover{background:#ff4d6d;color:#fff}@media(max-width:760px){#sidebar{padding:12px 8px}.sb-btn{padding:0;justify-content:center}.sb-btn .sb-t{display:none}}';
document.head.appendChild(c)})();


/* ---- Bomboblox blocky look ---- */
(function(){var c=document.createElement('style');c.textContent=
'#topbar{border-bottom:5px solid #ffd23f}footer{border-top:5px solid #ffd23f}'+
'.btn,.auth-btn,#search-btn{border-bottom-width:5px;letter-spacing:.5px}.btn:active{transform:translateY(2px);border-bottom-width:3px}'+
'.card,.ftile,.look,.prow,.panel{border-width:3px;box-shadow:4px 4px 0 #000}'+
'.section-label{border-left:0;padding-left:0;background:linear-gradient(90deg,#ffd23f 0 12px,transparent 12px);padding:2px 0 2px 24px;color:#ffd23f}'+
'.sb-btn{border:none;border-left:7px solid #ff8c1a;background:#201c2b;color:#fff;box-shadow:3px 3px 0 #000;font-weight:700}.sb-btn:hover,.sb-btn.on{background:#ff8c1a;color:#15121b;border-left-color:#ffd23f}'+
'.sb-btn.sb-admin{border-left-color:#ff4d6d;color:#ff4d6d}.sb-btn.sb-admin:hover{background:#ff4d6d;color:#fff}'+
'.pts-pill{border-bottom-width:5px}.ib-btn{border-bottom-width:5px}.txt{border-width:3px}';
document.head.appendChild(c)})();

/* ====================== POINTS (BOMBOPOINTS) ====================== */
var DAILY_QUESTS=3;
/* If you change a reward here, change reward() in RULES.txt too. */
var QUESTS={
  chat:{t:'Send a chat message',pts:8,i:'&#128172;'},
  add:{t:'Send a friend request',pts:9,i:'&#10133;'},
  accept:{t:'Accept a friend request',pts:10,i:'&#129309;'},
  visit:{t:'Visit someones profile',pts:8,i:'&#128064;'},
  shop:{t:'Check out the Shop',pts:8,i:'&#128717;&#65039;'},
  bio:{t:'Write something in your profile',pts:12,i:'&#9997;&#65039;'}
};
function bbDay(){var d=new Date();return d.getUTCFullYear()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate()}
function bbMsToReset(){var d=new Date();return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+1)-d.getTime()}
function bbQuestsToday(){var ids=Object.keys(QUESTS),s=bbDay()>>>0;
  function rnd(){s=(s+0x6D2B79F5)>>>0;var t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
  for(var i=ids.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),x=ids[i];ids[i]=ids[j];ids[j]=x}return ids.slice(0,DAILY_QUESTS)}
function bbAct(q){var u=auth.currentUser;if(!u||bbQuestsToday().indexOf(q)<0)return;
  var day=bbDay(),id=day+'_'+q,k='bba_'+u.uid+'_'+id;try{if(localStorage.getItem(k))return}catch(e){}
  function mark(){try{localStorage.setItem(k,'1')}catch(e){}}
  db.collection('wallets').doc(u.uid).collection('acts').doc(id).set({q:q,day:day}).then(mark).catch(function(e){if(e&&e.code==='permission-denied')mark()})}
function bbClaim(q){var u=auth.currentUser,Q=QUESTS[q];if(!u||!Q||bbQuestsToday().indexOf(q)<0)return Promise.reject(new Error('That quest is not active today'));
  var day=bbDay(),id=day+'_'+q,w=db.collection('wallets').doc(u.uid),c=w.collection('claims').doc(id);
  return db.runTransaction(function(t){return t.get(w).then(function(s){var d=s.exists?s.data():{},n=d.day===day?(d.n||0):0;
    if(n>=DAILY_QUESTS)throw new Error('You already got all '+DAILY_QUESTS+' quests today!');
    t.set(w,{points:(d.points||0)+Q.pts,day:day,n:n+1,lastClaim:id},{merge:true});t.set(c,{q:q,pts:Q.pts,day:day})})})}

var BB_PTS=0,_wUnsub=null,_wUid=null;
function bbPaintPts(){document.querySelectorAll('.pts-n').forEach(function(e){e.textContent=bbFmt(BB_PTS)});window.dispatchEvent(new Event('bbpoints'))}
function bbWalletListen(user){if(_wUid===user.uid)return;if(_wUnsub)_wUnsub();_wUid=user.uid;
  _wUnsub=db.collection('wallets').doc(user.uid).onSnapshot(function(s){BB_PTS=s.exists?(s.data().points||0):0;bbPaintPts()},function(){})}
var BB_COIN='<img class="pts-coin" src="bombopoint.png" alt="" onerror="this.outerHTML=\'&#127852;\'">';
function bbPtsPill(){return '<button type="button" class="pts-pill" onclick="location.href=\'shop.html\'" title="Your Bombopoints. Click to spend them!">'+BB_COIN+'<b class="pts-n">'+bbFmt(BB_PTS)+'</b><span class="pts-go">SHOP</span></button>'}

/* avatar shop: look1 costs 10, look2 20 ... look10 100 */
function bbOwnedLooks(){var u=auth.currentUser;if(!u)return Promise.resolve([]);
  return db.collection('users').doc(u.uid).collection('pics').get().then(function(q){return q.docs.map(function(d){return d.id})}).catch(function(){return[]})}
function bbBuyLook(id){var u=auth.currentUser,L=BB_LOOKS[id];if(!u||!L||!L.p)return Promise.reject(new Error('Not for sale'));
  var w=db.collection('wallets').doc(u.uid),pr=db.collection('users').doc(u.uid).collection('pics').doc(id);
  return db.runTransaction(function(t){return Promise.all([t.get(w),t.get(pr)]).then(function(r){if(r[1].exists)throw new Error('You already own this look');
    var old=r[0].exists?(r[0].data().points||0):0;if(old<L.p)throw new Error('Not enough Bombopoints');
    t.set(w,{points:old-L.p,lastPic:id},{merge:true});t.set(pr,{at:new Date().toISOString()})})})}
function bbWear(id){var u=auth.currentUser;return db.collection('users').doc(u.uid).update({look:id}).then(function(){bbRefreshAv(u.uid)})}

/* gifts + codes */
function bbFindUser(text){text=String(text||'').trim();if(!text||text.indexOf('/')>-1)return Promise.resolve(null);
  return db.collection('users').doc(text).get().then(function(d){if(d.exists)return{uid:d.id,name:d.data().username||'Unknown'};
    return db.collection('users').where('username','==',text).get().then(function(q){return q.size===1?{uid:q.docs[0].id,name:q.docs[0].data().username||text}:null})}).catch(function(){return null})}
function bbSendGift(to,amount){var u=auth.currentUser;amount=Math.floor(Number(amount));
  if(!u)return Promise.reject(new Error('Log in first'));if(!to||to===u.uid)return Promise.reject(new Error('Pick someone else'));if(!(amount>=1&&amount<=100000))return Promise.reject(new Error('Pick an amount from 1 to 100000'));
  var w=db.collection('wallets').doc(u.uid),g=db.collection('gifts').doc();
  return db.runTransaction(function(t){return t.get(w).then(function(s){var old=s.exists?(s.data().points||0):0;if(old<amount)throw new Error('Not enough Bombopoints');
    t.set(w,{points:old-amount,lastSend:g.id},{merge:true});t.set(g,{to:to,from:u.uid,fromName:String(u.displayName||'Someone').slice(0,40),amount:amount,at:new Date().toISOString(),claimed:false})})})}
function bbClaimGift(id){var u=auth.currentUser,g=db.collection('gifts').doc(id),w=db.collection('wallets').doc(u.uid);
  return db.runTransaction(function(t){return Promise.all([t.get(g),t.get(w)]).then(function(r){var gd=r[0].data();if(!r[0].exists||gd.to!==u.uid||gd.claimed)throw new Error('This gift was already claimed');
    t.set(w,{points:(r[1].exists?(r[1].data().points||0):0)+gd.amount,lastGift:id},{merge:true});t.update(g,{claimed:true});return gd.amount})})}
function bbRedeem(code){var u=auth.currentUser;code=String(code||'').trim().toUpperCase();
  if(!u)return Promise.reject(new Error('Log in first'));if(!/^[A-Z0-9_-]{3,30}$/.test(code))return Promise.reject(new Error('Wrong code'));
  var cr=db.collection('codes').doc(code),rr=cr.collection('redeemed').doc(u.uid),w=db.collection('wallets').doc(u.uid);
  return db.runTransaction(function(t){return Promise.all([t.get(cr),t.get(rr),t.get(w)]).then(function(r){
    if(!r[0].exists)throw new Error('Wrong code');if(r[1].exists)throw new Error('You already used this code');
    var pts=r[0].data().points;t.set(w,{points:(r[2].exists?(r[2].data().points||0):0)+pts,lastRedeem:code},{merge:true});t.set(rr,{at:new Date().toISOString()});return pts})})}
var _gcUid=null;
function bbGiftCheck(user){if(_gcUid===user.uid)return;_gcUid=user.uid;
  db.collection('gifts').where('to','==',user.uid).where('claimed','==',false).get().then(function(q){var l=q.docs.map(function(d){var x=d.data();x.id=d.id;return x});if(l.length)bbGiftPopup(l,0)}).catch(function(){})}
function bbGiftPopup(list,i){var old=document.getElementById('gift-pop');if(old)old.remove();if(i>=list.length)return;var g=list[i];
  var o=document.createElement('div');o.className='st-modal';o.id='gift-pop';
  o.innerHTML='<div class="st-box gift-box"><div class="gift-ico">&#127873;</div><div class="gift-t"><b>'+esc(g.fromName||'Someone')+'</b> gifted you</div><div class="gift-n">'+BB_COIN+' '+bbFmt(g.amount)+'</div><div class="gift-s">Bombopoints'+(list.length>1?' &middot; gift '+(i+1)+' of '+list.length:'')+'</div><button type="button" class="gift-claim">CLAIM!</button><button type="button" class="gift-later">Later</button><div class="shop-msg" id="gift-msg"></div></div>';
  o.addEventListener('click',function(e){if(e.target.classList.contains('gift-later')||e.target===o)return o.remove();
    if(!e.target.classList.contains('gift-claim'))return;var b=e.target;b.disabled=true;b.textContent='...';
    bbClaimGift(g.id).then(function(){b.textContent='Claimed!';setTimeout(function(){bbGiftPopup(list,i+1)},700)}).catch(function(err){var m=o.querySelector('#gift-msg');m.className='shop-msg bad';m.textContent=err.message;b.disabled=false;b.textContent='CLAIM!'})});
  document.body.appendChild(o)}

/* ====================== FRIENDS ====================== */
/* users/{id}/friends/{friendId}  = a friendship (written on both sides when a request is accepted)
   users/{id}/friendReqs/{fromId} = a pending request that fromId sent to id */
function bbFriendRef(a,b){return db.collection('users').doc(a).collection('friends').doc(b)}
function bbReqRef(to,from){return db.collection('users').doc(to).collection('friendReqs').doc(from)}
function bbFriendState(them){var me=auth.currentUser.uid;
  return Promise.all([bbFriendRef(me,them).get(),bbReqRef(them,me).get(),bbReqRef(me,them).get()]).then(function(r){return r[0].exists?'friends':r[1].exists?'sent':r[2].exists?'incoming':'none'})}
function bbSendReq(them){var me=auth.currentUser;
  return bbReqRef(them,me.uid).set({name:String(me.displayName||'Unknown').slice(0,40),at:new Date().toISOString()}).then(function(){bbAct('add');return bbNotify(them,'friendreq',{link:'friends.html?tab=req'})})}
function bbAccept(them,name){var me=auth.currentUser,at=new Date().toISOString(),b=db.batch();
  b.set(bbFriendRef(me.uid,them),{name:String(name||'Unknown').slice(0,40),at:at});
  b.set(bbFriendRef(them,me.uid),{name:String(me.displayName||'Unknown').slice(0,40),at:at});
  b.delete(bbReqRef(me.uid,them));
  return b.commit().then(function(){bbAct('accept');return bbNotify(them,'friendacc',{link:'user.html?uid='+me.uid})})}
function bbDecline(them){return bbReqRef(auth.currentUser.uid,them).delete()}
function bbCancel(them){return bbReqRef(them,auth.currentUser.uid).delete()}
function bbUnfriend(them){var me=auth.currentUser.uid,b=db.batch();b.delete(bbFriendRef(me,them));b.delete(bbFriendRef(them,me));return b.commit()}
/* one smart button: <button class="btn fbtn" data-uid=".." data-name=".."> */
var FB_LABEL={none:['&#10133; Add Friend','add',''],sent:['&#8987; Request sent (cancel)','cancel','outline'],incoming:['&#9989; Accept request','accept','green'],friends:['&#10004; Friends','unfriend','outline']};
function bbFBtn(uid,name){return '<button type="button" class="btn fbtn" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'" disabled>...</button>'}
function bbFBtnSet(b){bbFriendState(b.dataset.uid).then(function(s){var L=FB_LABEL[s];b.dataset.act=L[1];b.className='btn fbtn '+L[2];b.innerHTML=L[0];b.disabled=false}).catch(function(){b.textContent='?'})}
function bbFBtnFill(root){(root||document).querySelectorAll('.fbtn:not([data-act])').forEach(bbFBtnSet)}
function bbFBtnClick(e,after){var b=e.target.closest('.fbtn');if(!b||b.disabled)return false;var a=b.dataset.act,id=b.dataset.uid,p;
  if(a==='add')p=bbSendReq(id);else if(a==='cancel')p=bbCancel(id);else if(a==='accept')p=bbAccept(id,b.dataset.name);
  else if(a==='unfriend'){if(!confirm('Remove '+b.dataset.name+' from your friends?'))return true;p=bbUnfriend(id)}else return true;
  b.disabled=true;p.then(function(){b.removeAttribute('data-act');bbFBtnSet(b);if(after)after()}).catch(function(err){alert(err.message);bbFBtnSet(b)});return true}
function bbReqRow(id,x){return '<div class="rq" data-uid="'+esc(id)+'" data-name="'+esc(x.name)+'">'+bbAvU(id,x.name,40,'user.html?uid='+encodeURIComponent(id))+'<a class="rn" href="user.html?uid='+encodeURIComponent(id)+'">'+esc(x.name||'Unknown')+'</a><button type="button" class="btn green" data-rq="accept">Accept</button><button type="button" class="btn red" data-rq="decline">Decline</button></div>'}
function bbReqClick(e){var b=e.target.closest('[data-rq]');if(!b)return;var r=b.closest('.rq');b.disabled=true;
  (b.dataset.rq==='accept'?bbAccept(r.dataset.uid,r.dataset.name):bbDecline(r.dataset.uid)).catch(function(err){alert(err.message);b.disabled=false})}
function bbFriendTile(id,x){return '<div class="ftile">'+bbAvU(id,x.name,100,'user.html?uid='+encodeURIComponent(id))+'<a class="fn" href="user.html?uid='+encodeURIComponent(id)+'">'+esc(x.name||'Unknown')+'</a><a class="btn outline" href="chat.html?uid='+encodeURIComponent(id)+'">&#128172; Chat</a></div>'}

/* ====================== INBOX ====================== */
function bbNotify(to,type,o){var u=auth.currentUser;if(!u||!to||to===u.uid)return Promise.resolve();o=o||{};
  var doc={type:type,from:u.uid,fromName:String(u.displayName||'Unknown').slice(0,40),text:String(o.text||'').slice(0,140),link:String(o.link||'').slice(0,200),at:new Date().toISOString()};
  return db.collection('users').doc(to).collection('inbox').doc(o.id||(type+'_'+u.uid)).set(doc).catch(function(){})}
var BB_INBOX=[],BB_SEEN='',_ibUid=null;
function bbInboxListen(user){if(_ibUid===user.uid)return;_ibUid=user.uid;
  db.collection('users').doc(user.uid).collection('inbox').orderBy('at','desc').limit(50).onSnapshot(function(q){BB_INBOX=q.docs.map(function(d){var x=d.data();x.id=d.id;return x});bbPaintInbox()},function(){});
  db.collection('inboxSeen').doc(user.uid).onSnapshot(function(s){BB_SEEN=s.exists?(s.data().at||''):'';bbPaintInbox()},function(){})}
function bbUnseen(){return BB_INBOX.filter(function(x){return x.at>BB_SEEN}).length}
function bbPaintInbox(){var n=bbUnseen();document.querySelectorAll('.ib-badge').forEach(function(e){e.textContent=n>99?'99+':n;e.style.display=n?'flex':'none'});
  if(document.getElementById('ib-panel')){bbDrawInbox();if(n)bbMarkSeen()}}
function bbMarkSeen(){var u=auth.currentUser;if(!u)return;var at=new Date().toISOString();BB_INBOX.forEach(function(x){if(x.at>at)at=x.at});if(at<=BB_SEEN)return;
  BB_SEEN=at;db.collection('inboxSeen').doc(u.uid).set({at:at}).catch(function(){})}
function bbAgo(iso){var s=Math.max(0,(Date.now()-new Date(iso).getTime())/1000);return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':s<86400?Math.floor(s/3600)+'h ago':Math.floor(s/86400)+'d ago'}
function bbSafeLink(l,fb){return /^(user|chat|friends)\.html([?#][\w=&%.#-]*)?$/.test(l||'')?l:fb}
var BB_INB_TXT={friendreq:'sent you a friend request',friendacc:'accepted your friend request',chat:'sent you a message'};
function bbDrawInbox(){var p=document.getElementById('ib-panel');if(!p)return;var old=p._old||'';
  var rows=BB_INBOX.map(function(x){var link=bbSafeLink(x.link,x.type==='chat'?'chat.html?uid='+encodeURIComponent(x.from):'user.html?uid='+encodeURIComponent(x.from));
    return '<a class="ib-row'+(x.at>old?' new':'')+'" href="'+esc(link)+'">'+bbAvU(x.from,x.fromName,38)+'<div class="ib-m"><div class="ib-t"><b>'+esc(x.fromName||'Someone')+'</b> '+(BB_INB_TXT[x.type]||'did something')+(x.text&&x.type==='chat'?': <span class="ib-q">&ldquo;'+esc(x.text)+'&rdquo;</span>':'')+'</div><div class="ib-time">'+bbAgo(x.at)+'</div></div></a>'}).join('');
  p.querySelector('.ib-list').innerHTML=rows||'<div class="ib-empty">Nothing here yet. Friend requests and messages show up here.</div>'}
function bbToggleInbox(e){if(e)e.stopPropagation();var ex=document.getElementById('ib-panel');if(ex){ex.remove();return}
  var p=document.createElement('div');p.id='ib-panel';p._old=BB_SEEN;
  p.innerHTML='<div class="ib-head"><span>Inbox</span><button type="button" class="ib-clear">Clear all</button></div><div class="ib-list"></div>';
  p.addEventListener('click',function(ev){ev.stopPropagation();if(ev.target.classList.contains('ib-clear')){var b=db.batch();BB_INBOX.forEach(function(x){b.delete(db.collection('users').doc(auth.currentUser.uid).collection('inbox').doc(x.id))});b.commit().catch(function(err){alert(err.message)})}});
  document.body.appendChild(p);var tb=document.getElementById('topbar');p.style.top=(tb?tb.offsetHeight:68)+'px';bbDrawInbox();bbMarkSeen()}
document.addEventListener('click',function(e){var p=document.getElementById('ib-panel');if(p&&!p.contains(e.target))p.remove()});

/* ====================== TOP BAR ====================== */
function bbNav(user){var a=document.getElementById('auth-area');if(!user||!a)return;
  a.innerHTML='<button type="button" class="ib-btn" onclick="bbToggleInbox(event)" title="Inbox">&#9993;&#65039;<span class="ib-badge" style="display:none"></span></button><a href="user.html?uid='+esc(user.uid)+'" class="nav-me">'+bbAvU(user.uid,user.displayName,38)+'<span>'+esc(user.displayName||'Profile')+'</span></a>'+bbPtsPill();
  bbWalletListen(user);bbInboxListen(user);bbPaintInbox();bbGiftCheck(user);
  document.querySelectorAll('.av[data-d=fail]').forEach(function(e){e.removeAttribute('data-d')});bbFill();
  var ad=document.getElementById('sb-admin');if(ad)ad.style.display=user.uid===OWNER_UID?'flex':'none'}

/* logo (bomboblox.png in the top left corner) + search + sidebar */
(function(){var tb=document.getElementById('topbar');if(!tb)return;
  var lg=document.getElementById('logo');
  if(lg)lg.innerHTML='<img class="bb-logo" src="bomboblox.png" alt="BOMBOBLOX" onerror="this.replaceWith(document.createTextNode(\'BOMBOBLOX\'))">';
  if(!document.getElementById('auth-area'))return;
  var sw=document.createElement('form');sw.id='search-wrap';sw.innerHTML='<input type="text" id="search-input" placeholder="Search for people" autocomplete="off"><button id="search-btn" type="submit">GO</button>';
  sw.onsubmit=function(e){e.preventDefault();location.href='friends.html?tab=find&q='+encodeURIComponent(document.getElementById('search-input').value.trim())};
  tb.insertBefore(sw,document.getElementById('auth-area'));
  var here=location.pathname.split('/').pop()||'index.html';
  var items=[['index.html','&#127968;','Home'],['friends.html','&#128101;','Friends'],['chat.html','&#128172;','Chat'],['shop.html',BB_COIN,'Shop'],['admin.html','&#128737;&#65039;','Admin']];
  var sb=document.createElement('nav');sb.id='sidebar';
  sb.innerHTML=items.map(function(x){var adm=x[0]==='admin.html';return '<a class="sb-btn'+(adm?' sb-admin':'')+(here===x[0]?' on':'')+'" href="'+x[0]+'"'+(adm?' id="sb-admin" style="display:none"':'')+' title="'+x[2]+'"><span class="sb-i">'+x[1]+'</span><span class="sb-t">'+x[2]+'</span></a>'}).join('');
  document.body.appendChild(sb);document.body.classList.add('has-side');
  function place(){sb.style.top=tb.offsetHeight+'px'}place();window.addEventListener('resize',place);
  if(window.ResizeObserver)new ResizeObserver(place).observe(tb)})();
