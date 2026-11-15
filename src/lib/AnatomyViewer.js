/* Procedural 3D mesh, projected and shaded on a 2D canvas only on demand. */
export class AnatomyViewer {
 constructor(canvas) {
  this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.angle=0; this.system=null; this.critical=false; this.pending=false;
  this.parts=[]; this.createBody();
  this.events = new AbortController();
  this.observer = new ResizeObserver(()=>this.requestDraw());
  this.observer.observe(canvas);
  let previous=null;
  const options = { signal: this.events.signal };
  canvas.addEventListener('pointerdown',event=>{previous=event.clientX;canvas.setPointerCapture(event.pointerId)},options);
  canvas.addEventListener('pointermove',event=>{if(previous===null)return;this.angle+=(event.clientX-previous)*.012;previous=event.clientX;this.requestDraw()},options);
  const stop=()=>{previous=null};canvas.addEventListener('pointerup',stop,options);canvas.addEventListener('pointercancel',stop,options);
  canvas.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home'].includes(event.key))return;event.preventDefault();this.angle=event.key==='Home'?0:this.angle+(event.key==='ArrowLeft'?-.2:.2);this.requestDraw()},options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.frame);this.pending=false}else this.requestDraw()},options);
 }
 ellipsoid(x,y,z,rx,ry,rz,kind='body') {
  const lat=12,lon=16;
  for(let a=0;a<lat;a++)for(let b=0;b<lon;b++){
   const point=(i,j)=>{const u=Math.PI*i/lat,v=2*Math.PI*j/lon;return [x+rx*Math.sin(u)*Math.cos(v),y+ry*Math.cos(u),z+rz*Math.sin(u)*Math.sin(v)]};
   this.parts.push({points:[point(a,b),point(a+1,b),point(a+1,b+1),point(a,b+1)],kind});
  }
 }
 createBody(){
  this.ellipsoid(0,-2.4,0,.34,.45,.29);this.ellipsoid(0,-1.91,0,.15,.22,.15);
  this.ellipsoid(0,-1.22,0,.61,.67,.27);this.ellipsoid(0,-.52,0,.41,.54,.23);this.ellipsoid(0,-.04,0,.47,.35,.25);
  for(const side of [-1,1]){
   this.ellipsoid(side*.65,-1.1,0,.19,.57,.19);this.ellipsoid(side*.83,-.29,.015,.14,.48,.14);this.ellipsoid(side*.91,.25,.02,.13,.22,.075);
   this.ellipsoid(side*.27,.65,0,.24,.71,.23);this.ellipsoid(side*.29,1.68,0,.16,.55,.15);this.ellipsoid(side*.29,2.22,.12,.16,.14,.3);
   this.ellipsoid(side*.22,-1.25,.27,.2,.39,.1,'lungs');
   for(let rib=0;rib<5;rib++)this.ellipsoid(side*.27,-1.61+rib*.145,.29,.28,.025,.045,'bone');
   this.ellipsoid(side*.27,.62,.23,.045,.66,.045,'bone');this.ellipsoid(side*.29,1.68,.16,.035,.48,.035,'bone');
   for(let i=0;i<4;i++)this.ellipsoid(side*(.43-i*.08),-1.65+i*.28,.32,.035,.04,.025,'immune');
  }
  this.ellipsoid(0,-.84,.29,.035,1.03,.035,'bone');
  this.ellipsoid(.1,-1.23,.39,.13,.2,.08,'cardio');
  this.ellipsoid(-.16,-.62,.29,.25,.14,.08,'liver');this.ellipsoid(.14,-.47,.32,.17,.2,.07,'nutrition');
  for(let i=0;i<4;i++)this.ellipsoid(0,-.18+i*.075,.28,.25,.04,.055,'nutrition');
  this.ellipsoid(0,-2.53,.22,.26,.21,.12,'mood');
 }
 select(system,critical=false){this.system=system;this.critical=critical;this.requestDraw()}
 requestDraw(){if(this.pending||document.hidden)return;this.pending=true;this.frame=requestAnimationFrame(()=>{this.pending=false;this.draw()})}
 dispose(){this.events.abort();this.observer.disconnect();cancelAnimationFrame(this.frame);this.pending=false}
 draw(){
  const rect=this.canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);
  const ctx=this.ctx;ctx.scale(dpr,dpr);const scale=Math.min(rect.height/6.6,rect.width/3.8),cx=rect.width/2,cy=rect.height/2+22;
  const c=Math.cos(this.angle),s=Math.sin(this.angle);
  const polygons=this.parts.map(part=>{const points=part.points.map(([x,y,z])=>[x*c+z*s,y,z*c-x*s]);return {...part,points,depth:points.reduce((sum,p)=>sum+p[2],0)/4}}).sort((a,b)=>a.depth-b.depth);
  for(const polygon of polygons){
   const p=polygon.points,ux=p[1][0]-p[0][0],uy=p[1][1]-p[0][1],uz=p[1][2]-p[0][2],vx=p[2][0]-p[0][0],vy=p[2][1]-p[0][1],vz=p[2][2]-p[0][2];
   const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,length=Math.hypot(nx,ny,nz)||1;
   const light=.65+.27*Math.abs((nx*-.4+ny*-.4+nz*.8)/length);
   let base=polygon.kind==='body'?[121,155,171]:polygon.kind==='bone'?[199,218,220]:[153,123,120];
   if(polygon.kind==='lungs')base=[108,146,163];
   if(polygon.kind===this.system)base=this.critical?[255,80,83]:[71,211,205];
   ctx.fillStyle=`rgb(${base.map(v=>Math.round(v*light)).join(',')})`;ctx.beginPath();p.forEach((point,index)=>{const x=cx+point[0]*scale,y=cy+point[1]*scale;index?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.fill();
  }
 }
}
