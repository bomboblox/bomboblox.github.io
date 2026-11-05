/* Bomboblox shared code. Load the firebase app/auth/firestore compat scripts BEFORE this file. */

/* ====== 1) FIREBASE CONFIG (already filled in) ====== */
var BB_FIREBASE={apiKey:"AIzaSyA1yGuSQ1sK5_oESRyTmfV_q5i6ZiLhdt0",authDomain:"bomboblox.firebaseapp.com",projectId:"bomboblox",storageBucket:"bomboblox.firebasestorage.app",messagingSenderId:"213718036243",appId:"1:213718036243:web:ab59b8145667ed764a74e6"};
/* ====== 2) PASTE THE UID OF YOUR OWNER ACCOUNT HERE ====== */
var OWNER_UID='xZu0gq6EWeVq73AKHwJCBPAuAmu2';

firebase.initializeApp(BB_FIREBASE);
var auth=firebase.auth(),db=firebase.firestore();
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function bbDate(iso){return iso?new Date(iso).toLocaleDateString():''}
function bbFmt(n){return Number(n||0).toLocaleString()}

/* ====================== AVATARS (everyone starts as a noob) ====================== */
/* look ids: 'noob' is free. look1..look10 are bought in the shop (price must match lookPrice() in RULES.txt) */
var BB_LOOKS={
  noob:{n:'Noob',h:'#f5cd30',t:'#0d69ac',l:'#a3c76d',a:'#f5cd30',p:0},
  look1:{n:'Sambusa Orange',h:'#f5cd30',t:'#ff6a00',l:'#8a3b00',a:'#ff6a00',p:10},
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
function bbSvg(look,full){var L=bbLook(look),s='stroke="#000" stroke-opacity=".3" stroke-width="1"';
  return '<svg viewBox="'+(full?'0 0 40 64':'0 0 40 40')+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+
  '<rect x="1" y="18" width="7" height="20" fill="'+L.a+'" '+s+'/><rect x="32" y="18" width="7" height="20" fill="'+L.a+'" '+s+'/>'+
  '<rect x="9" y="18" width="22" height="20" fill="'+L.t+'" '+s+'/>'+
  '<rect x="9" y="39" width="10.5" height="23" fill="'+L.l+'" '+s+'/><rect x="20.5" y="39" width="10.5" height="23" fill="'+L.l+'" '+s+'/>'+
  '<rect x="12" y="2" width="16" height="15" fill="'+L.h+'" '+s+'/><rect x="16" y="7" width="2.4" height="3.4" fill="#111"/><rect x="21.6" y="7" width="2.4" height="3.4" fill="#111"/><rect x="16" y="12.2" width="8" height="1.6" fill="#111"/></svg>'}
/* an avatar tile. It first shows the initial, then swaps itself for the persons real avatar. */
function bbAvU(uid,name,size,href,full){var t=href?'a':'div';return '<'+t+(href?' href="'+href+'"':'')+' class="av'+(full?' full':'')+'" data-u="'+esc(uid)+'" style="width:'+size+'px;height:'+(full?Math.round(size*1.6):size)+'px;font-size:'+Math.round(size*.45)+'px">'+esc((name||'?')[0].toUpperCase())+'</'+t+'>'}
var _uc={};
function bbUser(uid){if(!_uc[uid])_uc[uid]=db.collection('users').doc(uid).get().then(function(d){return d.exists?d.data():{}}).catch(function(){delete _uc[uid];return null});return _uc[uid]}
function bbFill(){document.querySelectorAll('.av[data-u]:not([data-d])').forEach(function(el){el.dataset.d=1;
  bbUser(el.dataset.u).then(function(u){if(u===null){el.dataset.d='fail';return}el.innerHTML=bbSvg(u.look,el.classList.contains('full'));el.classList.add('has')})})}
function bbRefreshAv(uid){if(uid)delete _uc[uid];else _uc={};document.querySelectorAll('.av[data-d]').forEach(function(e){e.removeAttribute('data-d')});bbFill()}
if(document.body)new MutationObserver(function(){clearTimeout(window._bt);window._bt=setTimeout(bbFill,50)}).observe(document.body,{childList:true,subtree:true});

/* ====================== GLOBAL STYLES (2016-style) ====================== */
(function(){var c=document.createElement('style');c.textContent="*{margin:0;padding:0;box-sizing:border-box}body{background:#111;color:#f1f1f1;font:15px 'Source Sans 3',Arial,sans-serif;min-height:100vh;display:flex;flex-direction:column}a{color:inherit;text-decoration:none}#topbar{background:#ff6a00;color:#111;height:46px;display:flex;align-items:center;padding:0 20px;position:sticky;top:0;z-index:100}#logo{font-weight:900;font-size:24px;letter-spacing:-.5px;margin-right:14px;display:flex;align-items:center;color:#111;white-space:nowrap}.bb-logo{height:32px;width:auto;max-width:240px;display:block}.tl{display:flex}.tl a,.tbtn{font:700 15px 'Source Sans 3',Arial,sans-serif;padding:0 12px;height:46px;display:flex;align-items:center;color:#111;background:none;border:0;cursor:pointer;position:relative}.tl a:hover,.tbtn:hover{background:#e05a00}#search-wrap{display:flex;margin-left:auto;width:230px}#search-input{flex:1;min-width:0;height:28px;background:#111;border:0;color:#f1f1f1;font:14px 'Source Sans 3',Arial,sans-serif;padding:0 10px;outline:none}#search-btn{height:28px;padding:0 10px;background:#333;border:0;color:#fff;font:700 13px 'Source Sans 3',Arial,sans-serif;cursor:pointer}#auth-area{display:flex;align-items:center;gap:4px;margin-left:10px}.auth-btn{background:#111;color:#fff;font-weight:700;padding:5px 14px;font-size:14px}.auth-btn:hover{background:#333}.nav-me{display:flex;align-items:center;gap:7px;font-weight:700;padding:0 8px;height:46px}.nav-me:hover{background:#e05a00}.pts-pill{background:#111;color:#fff;font:700 14px 'Source Sans 3',Arial,sans-serif;height:28px;padding:0 10px;display:flex;align-items:center;gap:6px;border:0;cursor:pointer}.coin,.pts-coin{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:#ff6a00;color:#111;font-size:10px;font-weight:900;flex-shrink:0}#pg{flex:1;display:grid;grid-template-columns:190px minmax(0,1fr);gap:18px;max-width:1180px;width:100%;margin:0 auto;padding:18px 16px 30px;align-items:start}#mn{display:flex;flex-direction:column;border-right:1px solid #2a2a2a;position:sticky;top:64px}#mn a{padding:11px 14px;font-weight:700;font-size:16px;color:#ccc;border-left:4px solid transparent}#mn a:hover{background:#1e1e1e}#mn a.on{background:#1e1e1e;color:#ff6a00;border-left-color:#ff6a00}#mn a.adm{color:#ff5a5a}main{flex:1;width:100%;max-width:1180px;margin:0 auto;padding:18px 16px 30px;display:flex;flex-direction:column;gap:18px;min-width:0}#pg main{padding:0;margin:0;max-width:none}footer{border-top:1px solid #2a2a2a;padding:16px 20px;text-align:center;font-size:13px;color:#999}.sec,.card{background:#1e1e1e;border:1px solid #2a2a2a;padding:14px 16px}.card h3{font-size:19px;font-weight:700;margin-bottom:6px}.hd{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid #2a2a2a;padding-bottom:8px;margin-bottom:14px}.hd h2{font-size:20px;font-weight:700}.hd a{font-size:14px;color:#ff6a00;font-weight:600}.section-label{font-size:20px;font-weight:700;border-bottom:1px solid #2a2a2a;padding-bottom:8px}.empty{font-size:14px;color:#999;padding:10px 0;line-height:1.5}.btn{height:32px;padding:0 16px;font:700 14px 'Source Sans 3',Arial,sans-serif;border:0;border-radius:3px;background:#ff6a00;color:#111;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}.btn:hover{background:#e05a00}.btn.outline{background:#333;color:#f1f1f1}.btn.outline:hover{background:#444}.btn.green{background:#2fd16f}.btn.red{background:#333;color:#ff5a5a}.btn.red:hover{background:#ff4444;color:#fff}.btn:disabled{opacity:.5;cursor:default}.txt{height:36px;background:#111;border:1px solid #333;color:#f1f1f1;font:15px 'Source Sans 3',Arial,sans-serif;padding:0 10px;outline:none;min-width:0}.txt:focus{border-color:#ff6a00}textarea.txt{height:90px;padding:8px 10px;resize:vertical;width:100%}.av{display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;border-radius:50%;background:#2a2a2a;overflow:hidden;flex-shrink:0}.av svg{width:100%;height:100%}.av.full{border-radius:0;border:1px solid #333;background:#161616}.av.full svg{padding:6%}.friend-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:14px 10px}.fr{display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;min-width:0}.fr .av{width:78px!important;height:78px!important}.fr .fn{font-size:14px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fr .fn:hover{color:#ff6a00}.fr .mini{font-size:12px;color:#ff6a00;font-weight:600}.qr,.rq{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #2a2a2a}.qr:last-child,.rq:last-child{border-bottom:0}.qt,.rn{flex:1;min-width:0;font-weight:600;overflow-wrap:anywhere}.qt small{display:block;color:#ffb066;font-size:13px}.qr i{font-style:normal;font-size:13px}.rq .btn{height:28px;padding:0 12px;font-size:13px}.on{color:#2fd16f;font-weight:600}.off{color:#999}.st-modal{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px}.st-box{background:#1e1e1e;border:1px solid #ff6a00;max-width:420px;width:100%;max-height:80vh;display:flex;flex-direction:column}.shop-msg{font-size:14px;font-weight:600;margin:6px 0}.shop-msg:empty{display:none}.shop-msg.ok{color:#2fd16f}.shop-msg.bad{color:#ff5a5a}.ib-badge{position:absolute;top:5px;right:-2px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#d11;color:#fff;font:700 11px 'Source Sans 3',Arial,sans-serif;align-items:center;justify-content:center}#ib-panel{position:fixed;right:12px;width:380px;max-width:calc(100vw - 24px);max-height:70vh;display:flex;flex-direction:column;background:#1e1e1e;border:1px solid #ff6a00;z-index:200}.ib-head{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #2a2a2a;font-size:18px;font-weight:700}.ib-head span{flex:1}.ib-clear{background:none;border:none;color:#999;font:600 13px 'Source Sans 3',Arial,sans-serif;cursor:pointer}.ib-clear:hover{color:#ff4444}.ib-list{overflow-y:auto}.ib-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #2a2a2a}.ib-row:hover{background:#262626}.ib-row.new{background:#2a1608;border-left:4px solid #ff6a00}.ib-m{min-width:0}.ib-t{font-size:14px;line-height:1.4;overflow-wrap:anywhere}.ib-t b{color:#ff6a00}.ib-q{color:#bbb}.ib-time{font-size:12px;color:#888;margin-top:2px}.ib-empty{padding:20px 16px;font-size:14px;color:#999}.gift-box{max-width:340px;text-align:center;padding:24px 20px;align-items:center;gap:6px}.gift-ico{display:none}.gift-t{font-size:17px;font-weight:600}.gift-t b{color:#ff6a00}.gift-n{display:flex;align-items:center;justify-content:center;gap:10px;font-size:48px;font-weight:900}.gift-n .pts-coin{width:34px;height:34px;font-size:18px}.gift-s{font-size:14px;color:#ff6a00;font-weight:600;margin-bottom:10px}.gift-claim{width:100%;height:42px;background:#2fd16f;border:none;color:#111;font:900 18px 'Source Sans 3',Arial,sans-serif;cursor:pointer}.gift-later{background:none;border:none;color:#999;font:600 13px 'Source Sans 3',Arial,sans-serif;cursor:pointer;margin-top:6px}@media(max-width:860px){#pg{grid-template-columns:1fr}#mn{flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid #2a2a2a;position:static}#mn a{white-space:nowrap}.tl,#search-wrap{display:none}#auth-area{margin-left:auto}}";document.head.appendChild(c)})();

/* ====================== POINTS (BOMBOPOINTS) ====================== */
var DAILY_QUESTS=3;
/* If you change a reward here, change reward() in RULES.txt too. */
var QUESTS={
  chat:{t:'Send a chat message',pts:8,i:''},
  add:{t:'Send a frend request',pts:9,i:''},
  accept:{t:'Accept a frend request',pts:10,i:''},
  visit:{t:'Visit sumone\'s profile',pts:8,i:''},
  shop:{t:'Check out De Shop',pts:8,i:''},
  bio:{t:'Write sumthin in ur profile',pts:12,i:''}
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
var BB_COIN='<span class="coin">B</span>';
function bbPtsPill(){return '<button type="button" class="pts-pill" onclick="location.href=\'shop.html\'" title="Ur Bombopoints. Click to spend dem!">'+BB_COIN+'<b class="pts-n">'+bbFmt(BB_PTS)+'</b></button>'}

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
  o.innerHTML='<div class="st-box gift-box"><div class="gift-ico"></div><div class="gift-t"><b>'+esc(g.fromName||'Someone')+'</b> gifted you</div><div class="gift-n">'+BB_COIN+' '+bbFmt(g.amount)+'</div><div class="gift-s">Bombopoints'+(list.length>1?' &middot; gift '+(i+1)+' of '+list.length:'')+'</div><button type="button" class="gift-claim">CLAIM!</button><button type="button" class="gift-later">Later</button><div class="shop-msg" id="gift-msg"></div></div>';
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
var FB_LABEL={none:['Add Frend','add',''],sent:['Sent. Cancel?','cancel','outline'],incoming:['Accept dis frend','accept','green'],friends:['Frends','unfriend','outline']};
function bbFBtn(uid,name){return '<button type="button" class="btn fbtn" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'" disabled>...</button>'}
function bbFBtnSet(b){bbFriendState(b.dataset.uid).then(function(s){var L=FB_LABEL[s];b.dataset.act=L[1];b.className='btn fbtn '+L[2];b.innerHTML=L[0];b.disabled=false}).catch(function(){b.textContent='?'})}
function bbFBtnFill(root){(root||document).querySelectorAll('.fbtn:not([data-act])').forEach(bbFBtnSet)}
function bbFBtnClick(e,after){var b=e.target.closest('.fbtn');if(!b||b.disabled)return false;var a=b.dataset.act,id=b.dataset.uid,p;
  if(a==='add')p=bbSendReq(id);else if(a==='cancel')p=bbCancel(id);else if(a==='accept')p=bbAccept(id,b.dataset.name);
  else if(a==='unfriend'){if(!confirm('Remove '+b.dataset.name+' from your friends?'))return true;p=bbUnfriend(id)}else return true;
  b.disabled=true;p.then(function(){b.removeAttribute('data-act');bbFBtnSet(b);if(after)after()}).catch(function(err){alert(err.message);bbFBtnSet(b)});return true}
function bbReqRow(id,x){return '<div class="rq" data-uid="'+esc(id)+'" data-name="'+esc(x.name)+'">'+bbAvU(id,x.name,38,'user.html?uid='+encodeURIComponent(id))+'<a class="rn" href="user.html?uid='+encodeURIComponent(id)+'">'+esc(x.name||'Unknown')+'</a><button type="button" class="btn" data-rq="accept">Yes</button><button type="button" class="btn outline" data-rq="decline">Nah</button></div>'}
function bbReqClick(e){var b=e.target.closest('[data-rq]');if(!b)return;var r=b.closest('.rq');b.disabled=true;
  (b.dataset.rq==='accept'?bbAccept(r.dataset.uid,r.dataset.name):bbDecline(r.dataset.uid)).catch(function(err){alert(err.message);b.disabled=false})}
function bbFriendTile(id,x){var u='user.html?uid='+encodeURIComponent(id);return '<div class="fr">'+bbAvU(id,x.name,78,u)+'<a class="fn" href="'+u+'">'+esc(x.name||'Unknown')+'</a><a class="mini" href="chat.html?uid='+encodeURIComponent(id)+'">Chat</a></div>'}

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
var BB_INB_TXT={friendreq:'sent u a frend request',friendacc:'accepted ur frend request',chat:'sent u a message'};
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

/* ====================== TOP BAR + LEFT MENU ====================== */
function bbNav(user){var a=document.getElementById('auth-area');if(!user||!a)return;
  a.innerHTML='<button type="button" class="tbtn" onclick="bbToggleInbox(event)">Inbox<span class="ib-badge" style="display:none"></span></button>'+bbPtsPill()+'<a href="user.html?uid='+esc(user.uid)+'" class="nav-me">'+bbAvU(user.uid,user.displayName,28)+'<span>'+esc(user.displayName||'Noob')+'</span></a>';
  var me=document.querySelector('#mn [data-me]');if(me)me.href='user.html?uid='+encodeURIComponent(user.uid);
  bbWalletListen(user);bbInboxListen(user);bbPaintInbox();bbGiftCheck(user);
  document.querySelectorAll('.av[data-d=fail]').forEach(function(e){e.removeAttribute('data-d')});bbFill();
  var ad=document.getElementById('mn-admin');if(ad)ad.style.display=user.uid===OWNER_UID?'block':'none';
  bbEnsureProfile(user)}
/* Repairs accounts that can log in but have no profile document or no display name */
function bbEnsureProfile(user){if(window._bbEP===user.uid)return;window._bbEP=user.uid;
  db.collection('users').doc(user.uid).get().then(function(d){
    if(d.exists){if(!user.displayName&&d.data().username)user.updateProfile({displayName:d.data().username}).then(function(){location.reload()});return}
    bbSetupModal(user)}).catch(function(e){bbBanner('Cant read ur profile ('+(e.code||e.message)+'). Publish de Rules in Firebase (Firestore > Rules) and refresh.')})}
function bbBanner(t){if(document.getElementById('bb-ban'))return;var d=document.createElement('div');d.id='bb-ban';d.style.cssText='position:fixed;left:0;right:0;bottom:0;background:#d11;color:#fff;padding:10px 16px;font:600 14px Arial,sans-serif;z-index:10000;text-align:center';d.textContent=t;document.body.appendChild(d)}
function bbSetupModal(user){var o=document.createElement('div');o.className='st-modal';o.id='setup-pop';
  o.innerHTML='<div class="st-box" style="padding:22px;gap:10px"><h3 style="font-size:22px">Finish ur acount</h3><p style="font-size:14px;color:#bbb;line-height:1.4">Ur login works but ur noob has no name yet. Pick one:</p><input class="txt" id="sp-name" maxlength="23" placeholder="Ur noob name"><div class="shop-msg" id="sp-msg"></div><button class="btn" id="sp-go" type="button">Save</button></div>';
  document.body.appendChild(o);var msg=o.querySelector('#sp-msg');
  o.querySelector('#sp-go').onclick=function(){var n=o.querySelector('#sp-name').value.trim(),l=n.toLowerCase(),b=this;
    if(!/^[a-zA-Z0-9\u00e6\u00f8\u00e5\u00c6\u00d8\u00c5_ .\-]{3,23}$/.test(n)){msg.className='shop-msg bad';msg.textContent='3 to 23 letters, numbers, spaces or . - _';return}
    b.disabled=true;msg.className='shop-msg';msg.textContent='Saving...';
    db.collection('usernames').doc(l).get().then(function(s){if(s.exists&&s.data().uid!==user.uid)throw new Error('taken');
      var w=db.batch();w.set(db.collection('users').doc(user.uid),{username:n,usernameLower:l,bio:'',look:'noob',createdAt:new Date().toISOString()});
      if(!s.exists)w.set(db.collection('usernames').doc(l),{uid:user.uid});return w.commit()})
    .then(function(){return user.updateProfile({displayName:n})}).then(function(){location.reload()})
    .catch(function(e){b.disabled=false;msg.className='shop-msg bad';msg.textContent=e.message==='taken'?'Dat name is taken. Try another.':'Could not save: '+e.message})}}

(function(){var tb=document.getElementById('topbar');if(!tb)return;
  var lg=document.getElementById('logo');
  if(lg)lg.innerHTML='<img class="bb-logo" src="bomboblox.png" alt="BOMBOBLOX" onerror="this.replaceWith(document.createTextNode(\'BOMBOBLOX\'))">';
  var au=document.getElementById('auth-area');if(!au)return;
  var tl=document.createElement('nav');tl.className='tl';tl.innerHTML='<a href="index.html">Home</a><a href="index.html#game">De Game</a><a href="friends.html">Frenz</a><a href="chat.html">Chat</a><a href="shop.html#shop">De Shop</a>';tb.insertBefore(tl,au);
  var sw=document.createElement('form');sw.id='search-wrap';sw.innerHTML='<input type="text" id="search-input" placeholder="Serch for de frenz" autocomplete="off"><button id="search-btn" type="submit">GO</button>';
  sw.onsubmit=function(e){e.preventDefault();location.href='friends.html?tab=find&q='+encodeURIComponent(document.getElementById('search-input').value.trim())};tb.insertBefore(sw,au);
  var main=document.querySelector('main');if(!main)return;
  var here=location.pathname.split('/').pop()||'index.html',pg=document.createElement('div');pg.id='pg';main.parentNode.insertBefore(pg,main);
  var items=[['index.html','Home'],['#','My Profile','data-me'],['friends.html','Frenz'],['chat.html','Chat'],['shop.html','Avatar'],['shop.html#shop','De Shop'],['admin.html','Admin','id="mn-admin" class="adm" style="display:none"']];
  var mn=document.createElement('nav');mn.id='mn';
  mn.innerHTML=items.map(function(x){var on=x[1]==='My Profile'?here==='user.html':x[1]==='De Shop'?(here==='shop.html'&&location.hash==='#shop'):x[1]==='Avatar'?(here==='shop.html'&&location.hash!=='#shop'):here===x[0];
    return '<a href="'+x[0]+'" '+(x[2]==='data-me'?'data-me':(x[2]||''))+(on?' class="on"':'')+'>'+x[1]+'</a>'}).join('');
  pg.appendChild(mn);pg.appendChild(main)})();
