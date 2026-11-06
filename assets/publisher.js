/* B for Biology static page publisher: no server, no stored credentials. */
(function(){
const BASE='https://bforbiology.github.io/';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=x=>{const s=String(x||'').trim();return /^(https?:\/\/|assets\/)/i.test(s)?s:'';};
const lessonPath=id=>'lessons/'+encodeURIComponent(id)+'/index.html';
const textBody=s=>String(s||'').split(/\n\s*\n/).filter(Boolean).map(b=>{b=b.trim();if(/^# /.test(b))return '<h2>'+esc(b.slice(2))+'</h2>';if(/^\*\*[^*]+\*\*$/.test(b))return '<h3>'+esc(b.slice(2,-2))+'</h3>';return '<p>'+esc(b).replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')+'</p>';}).join('');
const nav='<header class="topbar"><div class="container nav"><a class="logo" href="/"><span class="logo-icon">✳</span><span>B <em>for</em> Biology</span></a><nav><a href="/">Home</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></nav><a class="btn btn-outline small" href="/">Explore lessons</a></div></header>';
const footer='<footer><div class="container footer-inner"><div class="logo">✳ B for Biology</div><div class="site-footer-links"><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy</a><a href="/disclaimer.html">Disclaimer</a></div><small>© B for Biology</small></div></footer>';
function generate(item){
 const id=String(item.id||'');if(!/^[a-z0-9_-]+$/i.test(id))throw Error('Invalid resource ID: '+id);
 const title=String(item.title||'Untitled');const desc=String(item.summary||('Biology resource for Class '+item.classLevel)).slice(0,155);
 const url=BASE+'lessons/'+id+'/';let c='<p class="section-kicker">CLASS '+esc(item.classLevel)+' · '+esc(item.type).toUpperCase()+'</p><h1>'+esc(title)+'</h1><p>'+esc(desc)+'</p><div class="lesson-tags"><span>'+esc(item.chapter||'Biology')+'</span>'+(item.tags||[]).map(t=>'<span>'+esc(t)+'</span>').join('')+'</div>';
 if(item.body)c+='<div class="lesson-body">'+textBody(item.body)+'</div>';
 let pdf=safe(item.pdfUrl);if(pdf)c+='<div class="lesson-action"><a class="btn btn-primary" target="_blank" rel="noopener" href="'+esc(pdf.startsWith('http')?pdf:'/'+pdf)+'">Open PDF notes</a></div>';
 if(item.type==='image'){let src=safe(item.imageUrl||item.cover);if(src)c+='<img class="lesson-media" loading="lazy" src="'+esc(src.startsWith('http')?src:'/'+src)+'" alt="'+esc(title)+'">';}
 if(item.type==='video'){
  const v=String(item.videoUrl||'');const m=v.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if(m)c+='<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/'+m[1]+'" title="'+esc(title)+'" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
  else if(safe(v))c+='<p><a href="'+esc(v)+'" target="_blank" rel="noopener noreferrer">Open lesson video</a></p>';
 }
 if(item.type==='quiz'&&Array.isArray(item.questions)&&item.questions.length){c+='<form id="lessonQuiz">';item.questions.forEach((q,i)=>{c+='<fieldset class="quiz-question"><legend><strong>'+(i+1)+'. '+esc(q.question)+'</strong></legend>';q.options.forEach((o,j)=>{c+='<label class="quiz-choice"><input type="radio" required name="q'+i+'" value="'+j+'"> '+esc(o)+'</label>'});c+='</fieldset>'});c+='<button class="btn btn-primary" type="submit">Check my answers</button><p role="status" id="score"></p></form>';let a=JSON.stringify(item.questions.map(q=>q.answer));c+='<script>document.getElementById("lessonQuiz").addEventListener("submit",function(e){e.preventDefault();const a='+a+';const f=new FormData(this);const s=a.filter((x,i)=>Number(f.get("q"+i))===x).length;document.getElementById("score").textContent="Score: "+s+" / "+a.length;});<\/script>';}
 c+='<p><a href="/">← Explore more Biology resources</a></p>';
 const meta={'@context':'https://schema.org','@type':'LearningResource',name:title,description:desc,educationalLevel:'Class '+item.classLevel,url,inLanguage:['en','hi']};
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="'+esc(desc)+'"><meta name="robots" content="index,follow"><title>'+esc(title)+' | B for Biology</title><link rel="canonical" href="'+url+'"><meta property="og:type" content="article"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+url+'"><link rel="stylesheet" href="/assets/style.css"><link rel="icon" href="/assets/favicon.svg"><script type="application/ld+json">'+JSON.stringify(meta).replace(/</g,'\\u003c')+'<\/script></head><body>'+nav+'<main class="container site-page"><article class="paper"><div class="breadcrumbs"><a href="/">Home</a> / Class '+esc(item.classLevel)+' / '+esc(item.chapter||'Biology')+'</div>'+c+'</article></main>'+footer+'</body></html>';
}
function sitemap(items){const urls=[BASE,BASE+'about.html',BASE+'contact.html',BASE+'privacy.html',BASE+'disclaimer.html',...items.map(item=>BASE+'lessons/'+encodeURIComponent(item.id)+'/')];let now=new Date().toISOString().slice(0,10);return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+esc(u)+'</loc><lastmod>'+now+'</lastmod></url>').join('\n')+'\n</urlset>\n'}
window.BFBPublisher={generate,sitemap,lessonPath};
})();
