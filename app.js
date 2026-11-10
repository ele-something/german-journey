(() => {
const course = window.GERMAN_JOURNEY_A1;
const $ = (s) => document.querySelector(s);
const storageKey = "germanJourneyA1Progress_v2";
let progress = {};
try { progress = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch (_) { progress = {}; }
let current = null;
const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (_) {} updateProgress(); };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
function articleClass(a){ if(a==="der") return "article-der"; if(a==="die") return "article-die"; if(a==="das") return "article-das"; return "article-plural"; }
function updateProgress(){
 const done = course.lessons.filter(l=>progress[l.id]?.completed).length;
 $("#progress-label").textContent = `${done} / 20 lessons completed`;
 $("#progress-percent").textContent = `${Math.round(done/20*100)}% complete`;
 $("#progress-bar").style.width = `${done/20*100}%`;
 document.querySelectorAll(".lesson-link").forEach(b=>{
   const id=Number(b.dataset.id); b.classList.toggle("done",!!progress[id]?.completed);
   b.querySelector(".lesson-num").textContent = progress[id]?.completed ? "✓" : id;
 });
}
function buildNav(){
 $("#lesson-nav").innerHTML = course.lessons.map(l=>`<button class="lesson-link" data-id="${l.id}"><span class="lesson-num">${l.id}</span><span>${esc(l.title)}</span></button>`).join("");
 document.querySelectorAll(".lesson-link").forEach(b=>b.addEventListener("click",()=>openLesson(Number(b.dataset.id))));
 updateProgress();
}
function card(title,body,extra=""){return `<section class="section-card ${extra}"><h2>${title}</h2>${body}</section>`;}
function openLesson(id){
 const l=course.lessons.find(x=>x.id===id); if(!l)return; current=id;
 $("#welcome").classList.add("hidden"); $("#lesson-view").classList.remove("hidden");
 document.querySelectorAll(".lesson-link").forEach(b=>b.classList.toggle("active",Number(b.dataset.id)===id));
 const grammar=l.grammar.map((g,i)=>`<div class="grammar-point"><strong>${i+1}. ${esc(g[0])}</strong><p>${md(g[1])}</p></div>`).join("");
 const vocab=l.vocab.map(v=>`<tr><td class="word"><span class="${articleClass(v[1])}">${esc(v[1])}</span> ${esc(v[0])}</td><td>${esc(v[2])}</td><td class="translation">${esc(v[3])}</td><td>${esc(v[4])}</td></tr>`).join("");
 const examples=l.examples.map(e=>`<div class="example"><div class="de">${esc(e[0])}</div><div class="en">${esc(e[1])}</div></div>`).join("");
 const dialogue=l.dialogue.map(d=>`<div class="line"><div class="speaker">${esc(d[0])}</div><p>${esc(d[1])}</p></div>`).join("");
 const readqs=l.reading_questions.map(q=>`<div class="qa"><strong>${esc(q[0])}</strong><span>${esc(q[1])}</span></div>`).join("");
 const exercises=l.exercises.map((e,i)=>`<div class="exercise" data-ex="${i}"><p class="exercise-q">${i+1}. ${esc(e[0])}</p><div class="options">${[e[2],e[3],e[4]].map((op,j)=>`<button class="option" data-choice="${j}">${esc(op)}</button>`).join("")}</div><p class="feedback" aria-live="polite"></p><div class="answer"><strong>Answer: ${esc(e[5])}</strong><br>${esc(e[6])}</div></div>`).join("");
 const review=(l.review||[]).map(x=>`<li>${esc(x)}</li>`).join("");
 const done=!!progress[id]?.completed;
 $("#lesson-view").innerHTML=`
 <header class="lesson-header"><div class="lesson-kicker">A1 · LESSON ${String(id).padStart(2,"0")} OF 20</div><h1>${esc(l.title)}</h1><div class="de-title">${esc(l.de)}</div><p class="goal"><strong>Learning goal:</strong> ${esc(l.goal)}</p><div class="complete-row"><span class="section-intro">Work through the sections at your own pace.</span><button id="complete-btn" class="complete-btn ${done?"done":""}">${done?"✓ Lesson completed":"Mark lesson complete"}</button></div></header>
 ${card("1. Grammar explained",grammar)}
 ${card("2. Vocabulary",`<p class="section-intro">Learn nouns together with their article and plural. Article colours: <span class="article-der">der · masculine</span>, <span class="article-die">die · feminine</span>, <span class="article-das">das · neuter</span>. Plural definite article: <span class="article-plural">die</span>.</p><div class="vocab-wrap"><table><thead><tr><th>German</th><th>Plural</th><th>English</th><th>Example</th></tr></thead><tbody>${vocab}</tbody></table></div>`)}
 ${card("3. Useful example sentences",`<div class="example-list">${examples}</div>`)}
 ${card("4. Conversation",`<p class="section-intro">Read the dialogue once for meaning. Then practise both roles aloud.</p><div class="dialogue">${dialogue}</div>`)}
 ${card("5. Reading comprehension",`<h3>${esc(l.reading_title)}</h3><p class="reading-text">${esc(l.reading)}</p><h3>Check your understanding</h3>${readqs}`)}
 ${card("6. Writing task",`<div class="writing-box"><p>${esc(l.writing)}</p><p class="section-intro">After writing, check: verb position · capital letters · noun articles · spelling · full stops.</p></div>`)}
 ${card("7. Speaking practice",`<div class="activity"><h3>Speak aloud</h3><p>${esc(l.speaking)}</p></div>`)}
 ${card("8. Listening and pronunciation",`<div class="activity"><h3>Listening task</h3><p>${esc(l.listening)}</p><p class="section-intro">Tip: Use your browser’s read-aloud feature or a German text-to-speech voice. Audio recordings are not built into this version yet.</p></div>`)}
 ${card("9. Practice and knowledge check",`<p class="section-intro">Choose an answer to see feedback and an explanation. There are ${l.exercises.length} questions in this lesson.</p>${exercises}`)}
 ${card("10. Review before you finish",`<ul>${review}</ul>`)}
 <div class="complete-row"><button class="secondary-btn" id="prev-btn" ${id===1?"disabled":""}>← Previous lesson</button><button id="complete-btn-bottom" class="complete-btn ${done?"done":""}">${done?"✓ Completed":"Mark complete"}</button></div>
 <div class="next-row"><button class="primary-btn" id="next-btn" ${id===20?"disabled":""}>${id===20?"A1 course complete":"Next lesson →"}</button></div>`;
 $("#complete-btn").addEventListener("click",()=>toggleDone(id));
 $("#complete-btn-bottom").addEventListener("click",()=>toggleDone(id));
 $("#prev-btn").addEventListener("click",()=>openLesson(id-1));
 $("#next-btn").addEventListener("click",()=>{if(id<20)openLesson(id+1);});
 document.querySelectorAll(".exercise").forEach((box,i)=>{
   box.querySelectorAll(".option").forEach(btn=>btn.addEventListener("click",()=>{
     const ex=l.exercises[i], choice=Number(btn.dataset.choice);
     const correct=btn.textContent===ex[5];
     box.querySelectorAll(".option").forEach(x=>{x.disabled=true;if(x.textContent===ex[5])x.classList.add("correct");});
     if(!correct)btn.classList.add("wrong");
     box.querySelector(".feedback").textContent=correct?"Correct — well done.":"Not quite. Review the explanation below.";
     box.querySelector(".answer").classList.add("show");
   }));
 });
 window.scrollTo({top:0,behavior:"smooth"});
}
function toggleDone(id){progress[id]=progress[id]||{};progress[id].completed=!progress[id].completed;save();openLesson(id);}
$("#start-btn").addEventListener("click",()=>openLesson(1));
buildNav();
})();