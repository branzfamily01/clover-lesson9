const fs=require('fs'),vm=require('vm');
global.window=global;
for(const f of ['lesson-data.js','lesson09-output-v1.js','lesson-data-v1.js','lesson09-learning-v1.js']) vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
const D=window.LESSON_DATA; const err=[]; const allowed=new Set(['blank','choice','order','translate','write']);
const expectedSections={'1':15,'2':7,'3':5,'4':5,'5':8};
if(!Array.isArray(D)||D.length!==40) err.push(`item count: ${D&&D.length}`);
const counts={};
(D||[]).forEach((x,n)=>{
  counts[x.section]=(counts[x.section]||0)+1;
  for(const k of ['id','key','question','answer','completed']) if(!String(x[k]||'').trim()) err.push(`${n+1} missing ${k}`);
  if(x.id!==`clover.lesson9.${x.key}`) err.push(`${x.key} bad stable id ${x.id}`);
  if(!allowed.has(x.format)) err.push(`${x.id} bad format ${x.format}`);
  if(!Array.isArray(x.hints)||x.hints.length<2) err.push(`${x.id} hints`);
  if((x.hints||[]).some(h=>!h||!String(h.en||'').trim()||!String(h.jp||'').trim())) err.push(`${x.id} bilingual hints`);
  if(!Array.isArray(x.correct)||!x.correct.length) err.push(`${x.id} why/correct`);
  if(!Array.isArray(x.wrong)||!x.wrong.length) err.push(`${x.id} wrong analysis`);
  if(!Array.isArray(x.outputChunks)||!x.outputChunks.length) err.push(`${x.id} output chunks`);
  if(String(x.completed||'').split(/\s+/).length>=6 && x.outputChunks.length<2) err.push(`${x.id} Back Up must use phrase chunks`);
  if((x.outputChunks||[]).some(c=>String(c||'').trim().split(/\s+/).length<2)) err.push(`${x.id} Back Up has isolated single-word chunk`);
  if(!Array.isArray(x.mapPath)||x.mapPath.length<2) err.push(`${x.id} mapPath`);
  if((x.format==='order'||x.format==='write') && String(x.audioQ||'').trim()) err.push(`${x.id} stage0 answer leakage risk`);
});
for(const [s,n] of Object.entries(expectedSections)) if(counts[s]!==n) err.push(`section ${s} count ${counts[s]} != ${n}`);
const exact={
 '1-(1)':'Special features help camels survive in the desert.',
 '1-(2)':'The traffic accident seems to have been the result of bad road repairs.',
 '3-(2)':'You ought to have visited my friend in Sydney.',
 '5-(3)':'Before you go to a foreign country where your language is not spoken, you cannot realize how inconvenient it is to be unable to make yourself understood.',
 '5-(8)':'What impressed me most is that Mother Teresa devoted herself to the people in the slum.'
};
for(const [k,v] of Object.entries(exact)){const q=(D||[]).find(x=>x.key===k);if(!q||q.completed!==v)err.push(`${k} authoritative completed mismatch`);}
if(!window.LESSON_FINAL_CHECK||!Array.isArray(window.LESSON_FINAL_CHECK.sections)||window.LESSON_FINAL_CHECK.sections.length<5) err.push('Final Check sections');
const teacher=fs.readFileSync('index.html','utf8'),student=fs.readFileSync('student-index.html','utf8');
for(const html of [['index.html',teacher],['student-index.html',student]]){
  for(const req of ['lesson-data.js','lesson09-output-v1.js','lesson-data-v1.js','lesson-references-v1.js','lesson09-learning-v1.js','lesson09-v1.css','_engine/v1/engine.js','_engine/v1/audio.js']) if(!html[1].includes(req)) err.push(`${html[0]} missing ${req}`);
  for(const legacy of ['payload.part00.b64','payload.part01.b64','app.js','layout-fix.js','styles.css']) if(html[1].includes(`src="${legacy}"`)||html[1].includes(`href="${legacy}"`)) err.push(`${html[0]} still loads legacy ${legacy}`);
}
if(!teacher.includes('_teacher/v1/teacher.js')) err.push('teacher entry missing shared teacher layer');
if(student.includes('_teacher/v1/teacher.js')||student.includes('teacherMode":true')||student.includes('teaching.v1')) err.push('student teacher leak');
const css=fs.readFileSync('lesson09-v1.css','utf8');
for(const req of ['data-lesson-stage="output"','question-card{display:none','final-stage','concept-map-drawer','data-long="1"','data-lesson-stage="answer"] .choice-grid']) if(!css.includes(req)) err.push(`lesson css missing ${req}`);
const enhance=fs.readFileSync('lesson09-enhance-v1.js','utf8');
for(const req of ['lesson:render','where-am-i','question-viz','buildMap','clueTerms','q.completed||q.answer||q.question']) if(!enhance.includes(req)) err.push(`enhance missing ${req}`);
const exp=JSON.parse(fs.readFileSync('student-export.json','utf8'));
if(exp.policy!=='allowlist') err.push('student export must be allowlist');
if(exp.status!=='ready'||exp.releaseGate!=='student-production-explicit-approval-required') err.push('ready release gate missing');
for(const req of ['lesson-data.js','lesson09-output-v1.js','lesson-data-v1.js','lesson-references-v1.js','lesson09-learning-v1.js','lesson09-enhance-v1.js','lesson09-v1.css','student-index.html']) if(!exp.files.includes(req)) err.push(`student export missing ${req}`);
if(exp.files.some(x=>/source-lock|teacher/i.test(x))) err.push('student export teacher/source lock leak');
const meta=JSON.parse(fs.readFileSync('lesson-meta.json','utf8')); if(meta.status!=='ready'||meta.lessonId!=='clover.lesson9'||meta.itemCount!==40) err.push('lesson meta ready/id/count');
const lock=JSON.parse(fs.readFileSync('source-lock.json','utf8')); if(!lock.authoritative?.some(x=>/L09_本文/.test(x.name))||!lock.authoritative?.some(x=>/L09_解答/.test(x.name))) err.push('source lock authoritative');
if(err.length){console.error(err.join('\n'));process.exit(1);} console.log('Clover Lesson 9 validation OK:',D.length,'items; phrase Back Up; completed English after Check; Engine v1; student allowlist; ready; production gated.');
