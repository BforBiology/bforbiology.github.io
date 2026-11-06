const $=s=>document.querySelector(s);let items=[];let gh=null;const key='bfb_draft_v1';
const text=(id,s)=>{$(id).textContent=s};
const encodeUTF8=s=>btoa(Array.from(new TextEncoder().encode(s),x=>String.fromCharCode(x)).join(''));
const decodeUTF8=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),x=>x.charCodeAt(0)));
function validItems(list){return Array.isArray(list)&&list.every(x=>x&&typeof x.id==='string'&&typeof x.title==='string'&&['note','image','video','quiz'].includes(x.type)&&['11','12'].includes(String(x.classLevel)))}
function draw(){let tbody=$('#rows');tbody.replaceChildren();items.forEach(item=>{const tr=document.createElement('tr');for(const value of [item.title,item.type,'Class '+item.classLevel]){let td=document.createElement('td');td.textContent=value;tr.append(td)}let actions=document.createElement('td');for(let [label,fn] of [['Edit',()=>loadForm(item)],['Delete',()=>{if(confirm('Delete '+item.title+'?')){items=items.filter(x=>x.id!==item.id);saveDraft();draw()}}]]){let b=document.createElement('button');b.className='btn btn-outline small';b.textContent=label;b.onclick=fn;actions.append(b)}tr.append(actions);tbody.append(tr)});}
function saveDraft(){localStorage.setItem(key,JSON.stringify(items));}
function loadForm(x){for(const f of ['title','type','classLevel','chapter','summary','body','cover','videoUrl','imageUrl','pdfUrl'])$('#'+f).value=x[f]||'';$('#editId').value=x.id;$('#tags').value=(x.tags||[]).join(', ');$('#questions').value=x.questions?JSON.stringify(x.questions,null,2):'';$('#editor').scrollIntoView({behavior:'smooth'});}
function resetForm(){$('#editor').reset();$('#editId').value='';}
$('#clearEditor').onclick=resetForm;
$('#editor').onsubmit=e=>{e.preventDefault();let quiz=[];try{let txt=$('#questions').value.trim();if($('#type').value==='quiz'){quiz=JSON.parse(txt||'[]');if(!Array.isArray(quiz)||!quiz.length||!quiz.every(q=>q.question&&Array.isArray(q.options)&&q.options.length>=2&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length))throw Error('Each quiz question needs a question, at least two options, and a valid numeric answer.')}}catch(err){text('#saveStatus','Quiz format error: '+err.message);return}let id=$('#editId').value||('resource-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7));let x={id,type:$('#type').value,classLevel:$('#classLevel').value,title:$('#title').value.trim(),chapter:$('#chapter').value.trim(),summary:$('#summary').value.trim(),tags:$('#tags').value.split(',').map(x=>x.trim()).filter(Boolean),body:$('#body').value.trim(),cover:$('#cover').value.trim(),videoUrl:$('#videoUrl').value.trim(),imageUrl:$('#imageUrl').value.trim(),pdfUrl:$('#pdfUrl').value.trim()};if(x.type==='quiz')x.questions=quiz;let at=items.findIndex(y=>y.id===id);if(at<0)items.unshift(x);else items[at]=x;saveDraft();draw();resetForm();text('#saveStatus','✓ Saved as local draft. Click “Publish all to GitHub” when ready.');};
async function api(path,options={}){if(!gh)throw Error('Connect to GitHub first');let url='https://api.github.com/repos/'+encodeURIComponent(gh.owner)+'/'+encodeURIComponent(gh.repo)+'/contents/'+path.split('/').map(encodeURIComponent).join('/')+'?ref='+encodeURIComponent(gh.branch);let r=await fetch(url,{...options,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+gh.token,'X-GitHub-Api-Version':'2022-11-28',...options.headers}});let json=await r.json().catch(()=>({}));if(!r.ok)throw Error(json.message||('GitHub API error '+r.status));return json;}
async function put(path,base64,message){let sha;try{let original=await api(path);sha=original.sha}catch(e){if(!e.message.includes('Not Found'))throw e}let body={message,content:base64,branch:gh.branch};if(sha)body.sha=sha;return await api(path,{method:'PUT',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}})}
$('#owner').value='BforBiology';$('#repo').value='bforbiology.github.io';
$('#connect').onclick=async()=>{let owner=$('#owner').value.trim(),repo=$('#repo').value.trim(),branch=$('#branch').value.trim()||'main',token=$('#token').value.trim();if(!owner||!repo||!token)return text('#connectionStatus','Enter username, repository, and token.');gh={owner,repo,branch,token};text('#connectionStatus','Connecting…');try{let result=await api('data/content.json');let remote=JSON.parse(decodeUTF8(result.content));if(!validItems(remote))throw Error('The repository contains invalid content.json data');if(localStorage.getItem(key)&&!confirm('Local draft exists. Replace it with content from GitHub?')){text('#connectionStatus','Connected. Local draft retained.');return}items=remote;saveDraft();draw();text('#connectionStatus',`✓ Connected to ${owner}/${repo} (${branch}). ${items.length} resources loaded.`)}catch(e){text('#connectionStatus','Connection failed: '+e.message+' Check repository name, branch, and token permissions.');gh=null}};
$('#disconnect').onclick=()=>{gh=null;$('#token').value='';text('#connectionStatus','Disconnected. Token forgotten from this tab.');};
$('#publish').onclick=async()=>{
 if(!gh)return text('#publishStatus','Connect to GitHub before publishing.');
 if(!confirm('Publish '+items.length+' resources, their individual pages and the sitemap to the public website?'))return;
 const pub=window.BFBPublisher;if(!pub)return text('#publishStatus','Publisher script missing. Reload this page.');
 $('#publish').disabled=true;
 let completed=[];let failed=[];
 // Publish each resource page before publishing JSON and sitemap; this avoids broken homepage links.
 try{
  const oldManifest=await api('data/generated-pages.json').then(r=>JSON.parse(decodeUTF8(r.content))).catch(()=>[]);
  for(let i=0;i<items.length;i++){
   const it=items[i];text('#publishStatus','Publishing lesson pages '+(i+1)+' / '+items.length+'…');
   try{await put(pub.lessonPath(it.id),encodeUTF8(pub.generate(it)),'Publish learning page: '+it.title);completed.push(it.id)}
   catch(e){failed.push(it.title+': '+e.message);break}
  }
  if(failed.length)throw Error('Page generation failed. '+failed.join('; '));
  text('#publishStatus','Publishing resource library…');
  await put('data/content.json',encodeUTF8(JSON.stringify(items,null,2)+'\n'),'Publish resource library from Creator Studio');
  text('#publishStatus','Updating sitemap…');
  await put('sitemap.xml',encodeUTF8(pub.sitemap(items)),'Update sitemap with learning pages');
  const active=new Set(items.map(x=>x.id));
  const removed=Array.isArray(oldManifest)?oldManifest.filter(id=>!active.has(id)&&/^[a-z0-9_-]+$/i.test(id)):[];
  for(let id of removed){
   const path=pub.lessonPath(id);
   try{const r=await api(path);await api(path,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Remove deleted lesson '+id,sha:r.sha,branch:gh.branch})})}
   catch(e){failed.push('Old lesson page '+id+': '+e.message)}
  }
  if(!failed.length)await put('data/generated-pages.json',encodeUTF8(JSON.stringify(items.map(x=>x.id),null,2)+'\n'),'Update generated lesson manifest');
  text('#publishStatus',failed.length?'✓ Library and sitemap published, but some deleted pages may remain: '+failed.join('; '):'✓ Published '+items.length+' lesson pages, content library and sitemap. Your public site will update after GitHub Pages deployment.');
 }catch(e){text('#publishStatus','Publishing stopped: '+e.message+'. '+completed.length+' lesson pages may already be updated; verify your repository before retrying. Download a backup if needed.');}
 finally{$('#publish').disabled=false;}
};
$('#upload').onclick=async()=>{if(!gh)return text('#uploadStatus','Connect to GitHub first.');let file=$('#uploadFile').files[0];if(!file)return text('#uploadStatus','Choose a file.');let ext=file.name.split('.').pop().toLowerCase();if(!['pdf','png','jpg','jpeg','webp','gif','svg','mp4','webm'].includes(ext))return text('#uploadStatus','Unsupported file type.');if(file.size>8*1024*1024)return text('#uploadStatus','File exceeds the 8 MB studio limit. Upload large videos to YouTube and link them here.');text('#uploadStatus','Uploading '+file.name+'…');try{let bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));let clean=file.name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9._-]+/g,'-').slice(-75);let path='assets/uploads/'+Date.now()+'-'+clean;await put(path,btoa(binary),'Upload learning asset '+clean);text('#uploadStatus','✓ Uploaded! Paste this path into the appropriate field: '+path);const f=ext==='pdf'?'#pdfUrl':(['png','jpg','jpeg','webp','gif','svg'].includes(ext)?'#imageUrl':'#videoUrl');if($(f)&&!$(f).value)$(f).value=path;try{await navigator.clipboard.writeText(path)}catch(e){} }catch(e){text('#uploadStatus','Upload failed: '+e.message)}};
$('#export').onclick=()=>{let b=new Blob([JSON.stringify(items,null,2)],{type:'application/json'});let u=URL.createObjectURL(b);let a=document.createElement('a');a.href=u;a.download='bforbiology-content-backup.json';a.click();URL.revokeObjectURL(u)};
$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=async()=>{let file=$('#importFile').files[0];if(!file)return;try{let list=JSON.parse(await file.text());if(!validItems(list))throw Error('Invalid content structure.');if(confirm('Replace your local draft with '+list.length+' imported resources?')){items=list;saveDraft();draw();text('#publishStatus','Backup imported locally. Publish to update the public website.')}}catch(e){text('#publishStatus','Import failed: '+e.message)}$('#importFile').value=''};
(async()=>{try{if(localStorage.getItem(key)){items=JSON.parse(localStorage.getItem(key));if(!validItems(items))throw Error('Invalid local data')}else{let r=await fetch('data/content.json');items=await r.json();if(!validItems(items))throw Error('Invalid file');saveDraft()}draw()}catch(e){text('#connectionStatus','Open the site via GitHub Pages or a local web server (not file://) to load resources. '+e.message)}})();
