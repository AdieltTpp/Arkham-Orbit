const {metrics,systems}=window.healthData;
const viewer=new AnatomyViewer(document.querySelector('#body'));
let selected=null,scenario='normal',offline=false;
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
function currentMetric(metric){
 const result={...metric,status:'Muestra de demo',level:''};
 if(scenario==='attention'&&metric.id==='sleep'){result.value='4.5';result.status='△ Revisar descanso';result.level='warning'}
 if(scenario==='critical'&&['heart','pressure'].includes(metric.id)){result.value=metric.id==='heart'?'142':'160/100';result.status='! Escenario crítico';result.level='critical'}
 if(metric.id==='mood')result.value=read('orbita-mood','Bien');
 return result;
}
function renderMetrics(){document.querySelector('#metrics').innerHTML=metrics.map(currentMetric).map(m=>`<button class="metric ${m.level} ${selected===m.id?'selected':''}" data-indicator="${m.id}" aria-pressed="${selected===m.id}"><span class="metric-label">${m.name}</span><span class="reading">${m.value}<small>${m.unit}</small></span><span class="metric-status">${m.status}</span></button>`).join('')}
function renderSystems(active){document.querySelector('#systems').innerHTML=Object.entries(systems).map(([id,s])=>`<button class="system ${active===id?'active':''}" data-system="${id}" aria-pressed="${active===id}"><b aria-hidden="true">${s.symbol}</b>${s.name}</button>`).join('')}
function select(id,isSystem=false){
 selected=isSystem?null:id;const metric=isSystem?null:currentMetric(metrics.find(m=>m.id===id));const key=isSystem?id:metric.system,system=systems[key];
 viewer.select(key,scenario==='critical'&&key==='cardio');document.querySelector('#anatomy-title').textContent=system.heading;
 document.querySelector('#detail').innerHTML=`<button class="close" id="close-detail" aria-label="Cerrar detalle">×</button><p class="eyebrow">${metric?'INDICADOR':'SISTEMA'}</p><h2>${metric?metric.name:system.heading}</h2>${metric?`<div class="detail-value">${metric.value} <small>${metric.unit}</small></div><p>${metric.source}<br>Muestra de demostración · 14:32</p>`:''}<p>${metric?metric.note:system.description}</p>${scenario==='critical'&&key==='cardio'?'<p><strong>Alerta simulada.</strong> Solicitar apoyo de la tripulación. Procedimiento clínico pendiente de validación.</p>':''}<div class="detail-label">SEGUIMIENTO</div><ul>${system.actions.map(a=>`<li>${a}</li>`).join('')}</ul><button class="action" id="followup">${system.button}</button><p id="followup-status" role="status"></p>`;
 document.querySelector('#close-detail').onclick=()=>{selected=null;viewer.select(null);document.querySelector('#anatomy-title').textContent='Tu cuerpo, conectado.';document.querySelector('#detail').innerHTML='<div class="empty-detail"><span>◎</span><h2>Explora una lectura</h2><p>Toca un indicador o un sistema para ver su contexto y las acciones de seguimiento.</p></div>';renderMetrics();renderSystems(null)};
 document.querySelector('#followup').onclick=()=>{if(key==='mood'){openModule('games');return}const records=read('orbita-records',[]);records.push({system:key,at:new Date().toISOString()});document.querySelector('#followup-status').textContent=save('orbita-records',records)?'Actividad registrada en este dispositivo.':'Almacenamiento local no disponible.'};
 renderMetrics();renderSystems(key);
}
document.querySelector('#metrics').onclick=event=>{const button=event.target.closest('[data-indicator]');if(button)select(button.dataset.indicator)};
document.querySelector('#systems').onclick=event=>{const button=event.target.closest('[data-system]');if(button)select(button.dataset.system,true)};
document.querySelector('#reset').onclick=()=>{viewer.angle=0;viewer.requestDraw()};
document.querySelector('#scenario').onchange=event=>{scenario=event.target.value;const alert=document.querySelector('#alert');alert.hidden=scenario!=='critical';alert.textContent='! DEMOSTRACIÓN · Alerta cardiovascular simulada. Revisar el panel de seguimiento.';renderMetrics();if(scenario==='critical')select('heart');else if(scenario==='attention')select('sleep');else select('heart')};
document.querySelector('#connection').onclick=event=>{offline=!offline;event.currentTarget.textContent=offline?'○ Modo sin enlace · Local':'● Enlace con Tierra';event.currentTarget.setAttribute('aria-pressed',String(offline));event.currentTarget.title='Simulación del estado del enlace. El prototipo se ejecuta localmente.'};
const dialog=document.querySelector('#dialog'),content=document.querySelector('#dialog-content');
document.querySelector('#close-dialog').onclick=()=>{dialog.close();stopAudio()};dialog.addEventListener('close',stopAudio);
document.querySelector('.modules').onclick=event=>{const button=event.target.closest('[data-module]');if(button)openModule(button.dataset.module)};
let audioContext=null;
function stopAudio(){if(audioContext){audioContext.close();audioContext=null}}
function openModule(name){
 if(name==='games'){
  content.innerHTML='<p class="eyebrow">BIENESTAR COGNITIVO</p><h2>Un momento para ti</h2><p>¿Cómo te sientes hoy?</p><div class="choices" id="moods"></div><p>Toca el símbolo iluminado cinco veces. Registramos tiempo y aciertos para explorar la interacción.</p><button class="action" id="start-game">Comenzar actividad</button><div class="game-board" id="game-board"></div><p id="module-status" role="status"></p>';
  const moods=['Bien','Neutral','Bajo'];document.querySelector('#moods').innerHTML=moods.map(m=>`<button class="${read('orbita-mood','Bien')===m?'picked':''}">${m}</button>`).join('');
  document.querySelector('#moods').onclick=event=>{if(event.target.tagName!=='BUTTON')return;const mood=event.target.textContent;save('orbita-mood',mood);document.querySelectorAll('#moods button').forEach(b=>b.classList.toggle('picked',b.textContent===mood));renderMetrics()};
  document.querySelector('#start-game').onclick=()=>{let count=0,errors=0,target=Math.floor(Math.random()*9),start=performance.now();const board=document.querySelector('#game-board');const paint=()=>{board.innerHTML=Array.from({length:9},(_,i)=>`<button class="${i===target?'target':''}" aria-label="${i===target?'Símbolo iluminado':'Casilla vacía'}" data-cell="${i}">${i===target?'✦':'·'}</button>`).join('')};paint();document.querySelector('#module-status').textContent='Actividad en curso';board.onclick=event=>{const b=event.target.closest('[data-cell]');if(!b)return;if(Number(b.dataset.cell)!==target){errors++;return}count++;if(count===5){const seconds=((performance.now()-start)/1000).toFixed(1);board.innerHTML='';document.querySelector('#module-status').textContent=`5 aciertos · ${errors} errores · ${seconds} segundos. Actividad de demostración sin evaluación clínica.`;save('orbita-game',{seconds,errors,at:Date.now()});return}target=(target+1+Math.floor(Math.random()*8))%9;paint()}};
 }else if(name==='garden'){
  content.innerHTML='<p class="eyebrow">AGRICULTURA ESPACIAL</p><h2>Tu jardín a bordo</h2><div class="plant"><i></i><b></b><em></em></div><p>Microverdes · Bandeja A<br>Observa el cultivo y registra la tarea realizada según el protocolo de tu misión.</p><div class="choices"><button data-care="Observación">Observé el cultivo</button><button data-care="Riego">Registré el riego</button></div><p id="module-status" role="status"></p>';
  const previous=read('orbita-garden',null);document.querySelector('#module-status').textContent=previous?`${previous.action} · ${new Date(previous.at).toLocaleString('es')}`:'Sin actividades registradas.';
  content.querySelector('.choices').onclick=event=>{const action=event.target.dataset.care;if(!action)return;save('orbita-garden',{action,at:Date.now()});document.querySelector('#module-status').textContent=`${action} registrada en este dispositivo.`};
 }else{
  content.innerHTML='<p class="eyebrow">CONEXIÓN EMOCIONAL</p><h2>Un poco de casa</h2><p>Abre una foto, un audio o un video de tu dispositivo. El archivo permanece en tu equipo.</p><label class="action" for="memory">Elegir recuerdo</label><input id="memory" type="file" accept="image/*,audio/*,video/*" style="display:block;margin-top:20px"><div id="memory-view" style="margin-top:20px"></div><p>Los mensajes generativos requieren autorización familiar y una etiqueta visible. Esta demo permite reproducir archivos locales.</p><button class="action" id="sound">Reproducir sonido suave</button><p id="module-status"></p>';
  let url=null;document.querySelector('#memory').onchange=event=>{const file=event.target.files[0];if(!file)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);const element=document.createElement(file.type.startsWith('image/')?'img':file.type.startsWith('video/')?'video':'audio');element.src=url;element.style.width='100%';if(element.tagName==='IMG')element.alt='Recuerdo seleccionado';else element.controls=true;document.querySelector('#memory-view').replaceChildren(element)};dialog.addEventListener('close',()=>{if(url)URL.revokeObjectURL(url)},{once:true});
  document.querySelector('#sound').onclick=event=>{if(audioContext){stopAudio();event.target.textContent='Reproducir sonido suave';return}audioContext=new(window.AudioContext||window.webkitAudioContext)();const gain=audioContext.createGain();gain.gain.value=.025;gain.connect(audioContext.destination);[174,261,348].forEach(f=>{const oscillator=audioContext.createOscillator();oscillator.frequency.value=f;oscillator.connect(gain);oscillator.start()});event.target.textContent='Detener sonido'};
 }
 dialog.showModal();
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio()});
renderMetrics();renderSystems(null);
