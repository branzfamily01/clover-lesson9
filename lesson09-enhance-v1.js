(()=>{
'use strict';
const refs=window.LESSON_REFERENCES||null;
const toolbar=document.querySelector('.toolbar');
const stageEl=document.getElementById('stage');
if(!toolbar||!stageEl)return;
const esc=(s='')=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function isWord(ch){return !!ch&&/[A-Za-z0-9_]/.test(ch);}
function clueTerms(q){
 const f=String(q?.focus||''), text=String(q?.question||''), low=text.toLowerCase();
 let c=[];
 if(/help|SVOC|文型|骨格/.test(f)) c=['help','camels','me','awake','your relationship','let','yourself','understood','have others'];
 else if(/完了|時間|助動詞/.test(f)) c=['to have been','Whenever','would','need','three years ago','for three years','have visited','had walked','when'];
 else if(/関係|節|譲歩|接続/.test(f)) c=['why','culture','whose','as','Though','What','that','until'];
 else if(/否定|数量|比較|限定詞/.test(f)) c=['all Tom’s','of them','little','if','30 minutes','no less than','less than'];
 else if(/動名詞|不定詞|分詞|省略/.test(f)) c=['without','only to','if trained','feel like'];
 else if(/語彙|熟語|前置詞/.test(f)) c=['stand up for','ran into','call off','made believe','come up with','Gradually','formerly','reach'];
 else if(/語順/.test(f)) c=['so','that','not only','but','What','is','to'];
 return c.filter(x=>low.includes(x.toLowerCase()));
}
function ranges(text,terms=[]){const src=String(text||''),low=src.toLowerCase(),all=[];for(const raw of [...terms].filter(Boolean).map(String).sort((a,b)=>b.length-a.length)){const n=raw.toLowerCase();let from=0;while(n&&from<src.length){const s=low.indexOf(n,from);if(s<0)break;const e=s+n.length,left=!isWord(raw[0])||s===0||!isWord(src[s-1]),right=!isWord(raw[raw.length-1])||e===src.length||!isWord(src[e]);if(left&&right)all.push({s,e,len:e-s});from=s+Math.max(1,n.length);}}all.sort((a,b)=>a.s-b.s||b.len-a.len);const picked=[];for(const x of all){if(!picked.some(p=>x.s<p.e&&x.e>p.s))picked.push(x);}return picked.sort((a,b)=>a.s-b.s);}
function highlight(text,terms=[]){const src=String(text||''),rs=ranges(src,terms);if(!rs.length)return esc(src);let out='',pos=0;for(const r of rs){out+=esc(src.slice(pos,r.s));out+=`<mark class="hint-mark">${esc(src.slice(r.s,r.e))}</mark>`;pos=r.e;}return out+esc(src.slice(pos));}
function renderQuestion(q,state){
 const node=document.querySelector('.question');if(!node||!q)return;
 const stage=String(state?.stage||'problem'),isHint=stage.startsWith('hint:');
 const after=['answer','reason','wrong','translation','output'].includes(stage);
 const shown=after?(q.completed||q.answer||q.question):(q.question||'');
 node.innerHTML=highlight(shown,isHint?clueTerms(q):[]);
}
function visualFor(q){
 const f=String(q?.focus||'');
 if(/SVOC|文型|骨格|help|keep|make|let/.test(f))return {kind:'formula',title:'O と C の小さな文',tokens:[{text:'V',role:'modal'},{text:'O',role:'verb'},{text:'C',role:''}],note:'O is C / O does C / O is done を復元。'};
 if(/完了不定詞|現在完了|過去完了|ought to have|時間/.test(f))return {kind:'timeline',title:'基準時から前後を見る',items:[{label:'EARLIER',sub:'have / had / to have + p.p.'},{label:'REFERENCE',sub:'主節・現在・過去'},{label:'JUDGMENT',sub:'seem / ought to など'}]};
 if(/関係|what節|that節/.test(f))return {kind:'flow',title:'節の中身を検査',nodes:['先行詞/節の役割','→','後ろは完全? 不完全?','→','欠けた役割','→','関係詞/接続詞']};
 if(/否定|数量|比較|限定詞/.test(f))return {kind:'decision',title:'集合と数を見る',rows:[{condition:'0',result:'none'},{condition:'追加1まとまり',result:'another'},{condition:'多さを強調',result:'no less than'}]};
 if(/助動詞/.test(f))return {kind:'formula',title:'助動詞の層',tokens:[{text:'modal',role:'modal'},{text:'V 原形',role:'verb'},{text:'have p.p. = 過去評価',role:''}],note:'事実ではなく話し手の判断を重ねる。'};
 if(/動名詞|分詞|不定詞|省略/.test(f))return {kind:'flow',title:'準動詞の判断',nodes:['文中の役割','→','能動 / 受動','→','時間関係','→','必要なら省略を復元']};
 if(/語彙|熟語|前置詞/.test(f))return {kind:'flow',title:'句動詞は文脈で読む',nodes:['目的語','→','場面','→','句全体の意味','→','同義語']};
 return {kind:'flow',title:'判断の順序',nodes:['shape','→','role','→','meaning','→','context']};
}
function visual(v){if(!v||!v.kind)return'';const title=v.title?`<div class="viz-title">${esc(v.title)}</div>`:'';if(v.kind==='flow')return `${title}<div class="viz-flow">${(v.nodes||[]).map(x=>`<span class="${x==='→'?'arrow':''}">${esc(x)}</span>`).join('')}</div>`;if(v.kind==='timeline')return `${title}<div class="viz-timeline">${(v.items||[]).map(x=>`<article><b>${esc(x.label)}</b><span>${esc(x.sub||'')}</span></article>`).join('<i>→</i>')}</div>`;if(v.kind==='formula')return `${title}<div class="viz-formula">${(v.tokens||[]).map(x=>`<span class="${esc(x.role||'')}">${esc(x.text)}</span>`).join('<i>＋</i>')}</div>${v.note?`<p class="viz-note">${esc(v.note)}</p>`:''}`;if(v.kind==='decision')return `${title}<div class="viz-decision">${(v.rows||[]).map(x=>`<div><b>${esc(x.condition)}</b><i>→</i><strong>${esc(x.result)}</strong></div>`).join('')}</div>`;return'';}
function enhance(state){
 const q=window.LessonEngine?.getCurrent?.();
 const inQ=state.slideIndex>=0&&state.slideIndex<(window.LESSON_DATA||[]).length;
 if(inQ){stageEl.dataset.lessonStage=state.stage||'problem';stageEl.dataset.long=String((['answer','reason','wrong','translation','output'].includes(state.stage)?q?.completed:q?.question)||'').length>155?'1':'0';stageEl.dataset.dense=(q?.wrong||[]).length>=4?'1':'0';}else{delete stageEl.dataset.lessonStage;delete stageEl.dataset.long;delete stageEl.dataset.dense;}
 if(!q)return;renderQuestion(q,state);document.querySelectorAll('.where-am-i,.question-viz').forEach(n=>n.remove());if(!inQ)return;
 const after=['answer','reason','wrong','translation','output'].includes(state.stage);
 if(after&&Array.isArray(q.mapPath)&&q.mapPath.length){const n=document.createElement('div');n.className='where-am-i';n.innerHTML=`<span>Now</span>${q.mapPath.map((x,i)=>`<b>${esc(x)}</b>${i<q.mapPath.length-1?'<i>›</i>':''}`).join('')}`;document.querySelector('.topline')?.insertAdjacentElement('afterend',n);}
 if(state.stage==='reason'){const p=document.querySelector('.stage-panel');if(p){const n=document.createElement('div');n.className='question-viz';n.innerHTML=visual(visualFor(q));p.appendChild(n);}}
}
function refSection(s){const lead=s.lead?`<p class="map-lead">${esc(s.lead)}</p>`:'';if(s.type==='map')return `${lead}<div class="concept-grid">${(s.groups||[]).map(g=>`<article class="concept-card ${g.lesson?'in-lesson':'outside'}"><div class="concept-status">${g.lesson?'LESSON 9':'つながり'}</div><h3>${esc(g.title)}</h3><div class="concept-items">${(g.items||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><p>${esc(g.note||'')}</p></article>`).join('')}</div>`;if(s.type==='compare')return `${lead}<div class="map-compare">${(s.columns||[]).map(c=>`<article><span class="map-badge">${esc(c.badge||'')}</span><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p><strong>${esc(c.meaning||'')}</strong></article>`).join('')}</div>`;if(s.type==='matrix')return `${lead}<div class="matrix-wrap"><table><thead><tr>${(s.headers||[]).map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${(s.rows||[]).map(r=>`<tr>${r.map((x,i)=>`<${i===0?'th':'td'}>${esc(x)}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;if(s.type==='branch')return `${lead}<div class="branch-grid">${(s.rows||[]).map(r=>`<article class="branch-card"><h3>${esc(r.head)}</h3><div class="branch-core">${esc(r.core)}</div><div class="branch-list">${(r.branches||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></article>`).join('')}</div>`;if(s.type==='flow')return `${lead}<div class="big-flow">${(s.nodes||[]).map(x=>`<span class="${x==='→'?'arrow':''}">${esc(x)}</span>`).join('')}</div>`;return lead;}
function buildMap(){if(!refs)return;const btn=document.createElement('button');btn.type='button';btn.className='icon-btn map-btn';btn.textContent='🗺 地図';btn.title='Lesson 9 全体地図';toolbar.insertBefore(btn,document.getElementById('menuBtn')?.nextSibling||toolbar.firstChild);const drawer=document.createElement('div');drawer.className='concept-map-drawer';drawer.hidden=true;drawer.innerHTML=`<div class="concept-map-card" role="dialog" aria-modal="true"><header class="concept-map-head"><div><small>REFERENCE MAP</small><h2>${esc(refs.title||'Lesson Map')}</h2><p>${esc(refs.subtitle||'')}</p></div><button type="button" class="map-close">×</button></header><nav class="map-tabs">${(refs.sections||[]).map((s,i)=>`<button type="button" data-i="${i}" class="${i===0?'active':''}">${esc(s.title)}</button>`).join('')}</nav><main class="concept-map-body"></main></div>`;document.body.appendChild(drawer);const body=drawer.querySelector('.concept-map-body'),tabs=[...drawer.querySelectorAll('[data-i]')];const show=i=>{const s=refs.sections?.[i];if(!s)return;tabs.forEach((t,n)=>t.classList.toggle('active',n===i));body.innerHTML=`<section><h2>${esc(s.title)}</h2>${refSection(s)}</section>`;};const close=()=>{drawer.hidden=true;btn.focus();};btn.addEventListener('click',()=>{drawer.hidden=false;show(0);drawer.querySelector('.map-close')?.focus();});drawer.querySelector('.map-close').addEventListener('click',close);drawer.addEventListener('click',e=>{if(e.target===drawer)close();});tabs.forEach(t=>t.addEventListener('click',()=>show(Number(t.dataset.i))));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)close();});}
buildMap();
window.addEventListener('lesson:render',e=>enhance(e.detail||{}));
requestAnimationFrame(()=>enhance(window.LessonEngine?.getState?.()||{}));
})();
