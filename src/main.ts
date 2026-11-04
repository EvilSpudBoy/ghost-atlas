import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
type Cell={lat:number;lon:number;pop:number;deaths:number};
type Frame={year:number;cells:Cell[]};
type Dataset={metadata:{source:string;status:string;method:string};frames:Frame[]};
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<header><h1>👻 Ghost Atlas</h1><p>12,000 years of humanity, living and dead</p></header><section class="controls"><label>Layer <select id="layer"><option value="deaths">Accumulated ghosts</option><option value="pop">Living population</option><option value="ratio">Ghosts per living person</option></select></label><label>Year <strong id="year-label"></strong><input id="year" type="range" min="0" max="0" value="0"/></label><button id="play">▶ Play</button></section><div id="map"></div><section class="stats"><div id="totals"></div><div id="detail">Click a circle for cell details.</div></section><footer id="source"></footer>`;
const map=L.map('map',{worldCopyJump:true}).setView([18,10],2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:9,attribution:'© OpenStreetMap contributors'}).addTo(map);
const layerSelect=document.querySelector<HTMLSelectElement>('#layer')!;
const yearSlider=document.querySelector<HTMLInputElement>('#year')!;
const yearLabel=document.querySelector<HTMLElement>('#year-label')!;
const totals=document.querySelector<HTMLElement>('#totals')!;
const detail=document.querySelector<HTMLElement>('#detail')!;
const source=document.querySelector<HTMLElement>('#source')!;
const play=document.querySelector<HTMLButtonElement>('#play')!;
const circles=L.layerGroup().addTo(map);
let dataset:Dataset;let timer:number|undefined;
const fmt=(n:number)=>Math.round(n).toLocaleString('en-US');
const formatYear=(y:number)=>y<0?`${Math.abs(y).toLocaleString()} BCE`:`${y} CE`;
function draw(){const frame=dataset.frames[Number(yearSlider.value)];yearLabel.textContent=formatYear(frame.year);circles.clearLayers();const metric=layerSelect.value;let totalPop=0,totalDeaths=0;
for(const cell of frame.cells){totalPop+=cell.pop;totalDeaths+=cell.deaths;const value=metric==='pop'?cell.pop:metric==='deaths'?cell.deaths:cell.pop>0?cell.deaths/cell.pop:0;if(value<=0)continue;
const radius=metric==='ratio'?Math.min(23,3+Math.sqrt(value)*2):Math.min(24,3+Math.sqrt(value/1000));
const color=metric==='pop'?'#46c4d7':metric==='ratio'?'#c99cff':'#ffad59';
L.circleMarker([cell.lat,cell.lon],{radius,color,weight:1,fillColor:color,fillOpacity:.45}).on('click',()=>{detail.textContent=`Cell center ${cell.lat.toFixed(1)}°, ${cell.lon.toFixed(1)}° — Living: ${fmt(cell.pop)}; accumulated deaths: ${fmt(cell.deaths)}; ghosts per living: ${cell.pop?(cell.deaths/cell.pop).toFixed(1):'undefined'}.`;}).addTo(circles);
}totals.textContent=`Living: ${fmt(totalPop)} · Accumulated ghosts: ${fmt(totalDeaths)} · ${dataset.metadata.status}`;}
async function start(){try{const response=await fetch(`${import.meta.env.BASE_URL}data/atlas.json`);if(!response.ok)throw new Error(`HTTP ${response.status}`);dataset=await response.json() as Dataset;yearSlider.max=String(dataset.frames.length-1);yearSlider.value=String(dataset.frames.length-1);source.textContent=`Source: ${dataset.metadata.source}. ${dataset.metadata.method}`;draw();}catch(e){source.textContent=`Could not load atlas data: ${String(e)}`;}}
layerSelect.addEventListener('change',draw);yearSlider.addEventListener('input',draw);play.addEventListener('click',()=>{if(timer!==undefined){window.clearInterval(timer);timer=undefined;play.textContent='▶ Play';return;}play.textContent='⏸ Pause';timer=window.setInterval(()=>{yearSlider.value=String((Number(yearSlider.value)+1)%dataset.frames.length);draw();},750);});start();