
const lessons = window.GJ_LESSONS;
const $ = (id) => document.getElementById(id);
const state = JSON.parse(localStorage.getItem('gj-a1-progress') || '{"completed":[],"quizScores":{}}');
let currentLesson = null;
function save(){localStorage.setItem('gj-a1-progress',JSON.stringify(state));renderProgress();renderNav();}
function renderProgress(){
  const n=state.completed.length, pct=Math.round(n/lessons.length*100);
  $('completedCount').textContent=n; $('progressPercent').textContent=pct+'%';
  $('progressBar').style.width=pct+'%'; $('headerProgress').textContent=n+'/20'; $('sideCount').textContent=n+'/20';
  $('progressCaption').textContent=n===20?'A1 complete — wunderbar!':n===0?'Every lesson is a step forward. Start wherever you like.':`${20-n} lessons left in your A1 learning path. Keep going at your own pace.`;
}
function renderNav(){
  $('lessonNav').innerHTML=lessons.map(l=>`<button class="${state.completed.includes(l.id)?'done':''} ${currentLesson?.id===l.id?'selected':''}" data-id="${l.id}"><span class="lesson-num">${state.completed.includes(l.id)?'✓':l.id}</span><span class="lesson-name">${l.title}</span></button>`).join('');
  document.querySelectorAll('#lessonNav button').forEach(b=>b.onclick=()=>openLesson(+b.dataset.id));
}
function renderCards(){
  $('lessonCards').innerHTML=lessons.map(l=>`<button class="lesson-card ${state.completed.includes(l.id)?'completed':''}" data-id="${l.id}"><span class="card-number">${state.completed.includes(l.id)?'✓':String(l.id).padStart(2,'0')}</span><span class="card-copy"><strong>${l.title}</strong><span>${l.goal}</span></span><span class="card-status">${state.completed.includes(l.id)?'✓':'→'}</span></button>`).join('');
  document.querySelectorAll('.lesson-card').forEach(b=>b.onclick=()=>openLesson(+b.dataset.id));
}
function show(view){
  ['dashboardView','lessonView','reviewView'].forEach(id=>$(id).classList.toggle('hidden',id!==view));
  $('courseNav').classList.toggle('active',view==='dashboardView'||view==='lessonView');
  $('reviewNav').classList.toggle('active',view==='reviewView');
}
function articleHTML(word){
  return word.replace(/\b(der)\b/g,'<span class="article-der">der</span>').replace(/\b(die)\b/g,'<span class="article-die">die</span>').replace(/\b(das)\b/g,'<span class="article-das">das</span>');
}
function openLesson(id){
  const l=lessons.find(x=>x.id===id); if(!l)return; currentLesson=l; show('lessonView'); renderNav();
  const vocab=l.vocab.map(v=>`<tr><td>${articleHTML(v[0])}</td><td>${v[1]==='—'?'—':v[1]}</td><td>${v[2]}</td></tr>`).join('');
  const examples=l.examples.map(x=>`<div class="example">${x}</div>`).join('');
  const dialogue=l.dialogue.map(x=>`<div class="dialogue-line">${x}</div>`).join('');
  const practice=l.practice.map(x=>`<div class="practice-item">${x}</div>`).join('');
  const quiz=l.quiz?.length?`<section class="content-card" id="quiz"><h2>Quick check</h2><form id="quizForm">${l.quiz.map((q,i)=>`<div class="quiz-question"><strong>${i+1}. ${q[0]}</strong><div class="quiz-options">${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}</div></div>`).join('')}<button class="primary-btn" type="submit">Check answers</button><div id="quizResult"></div></form></section>`:'';
  $('lessonView').innerHTML=`
    <button class="back-link" id="backBtn">← Back to A1 overview</button>
    <div class="lesson-header"><p class="eyebrow">A1 · LESSON ${String(l.id).padStart(2,'0')}</p><h1>${l.title}</h1><p class="lesson-de">${l.de}</p><p class="lesson-meta">${l.goal}</p><div class="lesson-actions"><button class="primary-btn" id="completeBtn">${state.completed.includes(l.id)?'✓ Completed':'Mark lesson complete'}</button><button class="secondary-btn" id="prevBtn" ${l.id===1?'disabled':''}>← Previous</button><button class="secondary-btn" id="nextBtn" ${l.id===20?'disabled':''}>Next lesson →</button></div></div>
    <div class="lesson-layout"><div class="lesson-sections">
      <section class="content-card"><h2>Grammar and explanation</h2><p>${l.grammar.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</p></section>
      <section class="content-card"><h2>Vocabulary</h2><table class="vocab-table"><thead><tr><th>GERMAN</th><th>PLURAL</th><th>ENGLISH</th></tr></thead><tbody>${vocab}</tbody></table><p class="small-muted" style="margin-top:12px">Article colours: <span class="article-der">der · blue</span> &nbsp; <span class="article-die">die · red</span> &nbsp; <span class="article-das">das · green</span></p></section>
      <section class="content-card"><h2>Examples</h2><div class="example-list">${examples}</div></section>
      <section class="content-card"><h2>Everyday conversation</h2>${dialogue}</section>
      <section class="content-card"><h2>Practice</h2>${practice}</section>
      ${quiz}
    </div><aside class="lesson-aside"><h3>Your A1 journey</h3><strong>${state.completed.length} / 20 complete</strong><div class="mini-progress"><div style="width:${state.completed.length/20*100}%"></div></div><p>Study the explanation, say the examples aloud, then complete the practice and quiz. Mark the lesson complete when you're ready.</p><button class="secondary-btn" id="asideReview">Review vocabulary</button></aside></div>`;
  $('backBtn').onclick=()=>{show('dashboardView');renderCards();};
  $('completeBtn').onclick=()=>{if(!state.completed.includes(l.id))state.completed.push(l.id);save();openLesson(l.id);};
  $('prevBtn').onclick=()=>openLesson(l.id-1); $('nextBtn').onclick=()=>openLesson(l.id+1);
  $('asideReview').onclick=()=>openReview();
  if(l.quiz?.length) $('quizForm').onsubmit=(e)=>{e.preventDefault();let score=0,answered=0;l.quiz.forEach((q,i)=>{const picked=document.querySelector(`input[name="q${i}"]:checked`);if(picked){answered++;if(+picked.value===q[2])score++;}});$('quizResult').innerHTML=`<div class="quiz-result">You scored ${score} / ${l.quiz.length}${answered<l.quiz.length?` · ${l.quiz.length-answered} unanswered`:''}. ${score===l.quiz.length?'Excellent work!':'Review the lesson and try again.'}</div>`;state.quizScores[l.id]=score;save();};
  window.scrollTo({top:0,behavior:'smooth'});
}
function openReview(){
  currentLesson=null;show('reviewView');
  const all=lessons.flatMap(l=>l.vocab.map(v=>({word:v[0],plural:v[1],meaning:v[2],lesson:l.id})));
  $('reviewView').innerHTML=`<button class="back-link" id="reviewBack">← Back to A1 overview</button><p class="eyebrow">A1 VOCABULARY</p><h1 style="font:800 30px Manrope;margin:0 0 8px">Vocabulary review</h1><p class="subheading" style="margin-bottom:22px">Review words from all 20 A1 lessons. Learn nouns together with their article and plural.</p><div class="review-list">${all.map(v=>`<div class="review-row"><div><strong>${articleHTML(v.word)}</strong><div><span>${v.plural==='—'?'':v.plural}</span></div></div><span>${v.meaning} · L${v.lesson}</span></div>`).join('')}</div>`;
  $('reviewBack').onclick=()=>{show('dashboardView');renderCards();};
  window.scrollTo({top:0,behavior:'smooth'});
}
$('courseNav').onclick=()=>{show('dashboardView');renderCards();};
$('reviewNav').onclick=openReview;
$('homeLink').onclick=(e)=>{e.preventDefault();show('dashboardView');renderCards();};
renderProgress();renderNav();renderCards();
