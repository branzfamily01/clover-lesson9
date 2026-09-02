(()=>{
'use strict';
const lesson=window.CLOVER_LESSON9;if(!lesson||!Array.isArray(lesson.items))return;
const starters=new Set(['that','who','whom','whose','which','when','where','why','if','because','while','although','though','unless','before','after','with','without','from','for','to','of','in','on','at','by','as','than','instead','and','but','or']);
function tidy(s){return String(s||'').replace(/\s+/g,' ').trim();}
function splitLine(line){
 const words=tidy(line).split(' ').filter(Boolean);if(words.length<=4)return words.length?[words.join(' ')]:[];
 const out=[];let cur=[];
 for(let i=0;i<words.length;i++){
  const w=words[i],bare=w.toLowerCase().replace(/^[“‘(\[]+|[.,!?;:’”\])]+$/g,''),remaining=words.length-i;
  if(cur.length>=2&&starters.has(bare)&&remaining>=2){out.push(cur.join(' '));cur=[];}
  cur.push(w);
  if((/[,;:]$/.test(w)&&cur.length>=2)||cur.length>=5){out.push(cur.join(' '));cur=[];}
 }
 if(cur.length)out.push(cur.join(' '));
 for(let i=out.length-1;i>0;i--){if(out[i].split(/\s+/).length===1){out[i-1]+=' '+out[i];out.splice(i,1);}}
 return out;
}
function make(item){
 if(item.output&&Array.isArray(item.output.phrases)&&item.output.phrases.length)return item.output.phrases.map(tidy).filter(Boolean);
 const lines=String(item.completed||item.answer||'').split(/\n+/).map(tidy).filter(Boolean);let p=lines.flatMap(splitLine).filter(Boolean);
 if(p.length>=2)return p.slice(0,6);
 const s=tidy(item.completed||item.answer||'');const w=s.split(' ').filter(Boolean);
 if(w.length>=6){const cut=Math.ceil(w.length/2);return[w.slice(0,cut).join(' '),w.slice(cut).join(' ')];}
 return[s].filter(Boolean);
}
for(const item of lesson.items){const p=make(item);item.output=Object.assign({},item.output||{},{jp:item.output?.jp||item.translation||(Array.isArray(item.translations)?item.translations.join(' / '):''),phrases:p});}
})();
