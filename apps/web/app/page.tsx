'use client';
import { useEffect, useState } from 'react';
type KitItem = { id: string; label: string; checked: boolean };
const initial: KitItem[] = [
 {id:'water',label:'Água potável (reserva por pessoa)',checked:false},
 {id:'food',label:'Alimentos não perecíveis',checked:false},
 {id:'light',label:'Lanterna e pilhas',checked:false},
 {id:'radio',label:'Rádio portátil',checked:false},
 {id:'meds',label:'Medicamentos de uso contínuo',checked:false},
 {id:'firstaid',label:'Kit básico de primeiros socorros',checked:false},
 {id:'docs',label:'Cópias de documentos e contatos',checked:false},
 {id:'power',label:'Carregador portátil',checked:false},
 {id:'hygiene',label:'Itens de higiene',checked:false},
 {id:'clothes',label:'Roupas e proteção climática',checked:false}
];
export default function Home() {
 const [items,setItems]=useState<KitItem[]>(initial);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem('sos360:kit72h:v1');if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length===initial.length&&parsed.every((x:KitItem)=>typeof x.checked==='boolean'))setItems(initial.map((x,i)=>({...x,checked:parsed[i].checked})));}}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem('sos360:kit72h:v1',JSON.stringify(items))},[items,ready]);
 const done=items.filter(x=>x.checked).length;
 return <main style={{maxWidth:980,margin:'auto',padding:'40px 20px',lineHeight:1.5}}>
 <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><strong style={{fontSize:24}}>🛡️ SOS360 <small style={{fontSize:12,color:'#54735f'}}>BETA</small></strong><span>Preparação para famílias e aventuras</span></header>
 <section style={{padding:'56px 0 32px'}}><h1 style={{fontSize:'clamp(32px,6vw,54px)',marginBottom:12}}>Prepare-se hoje.<br/>Sobreviva amanhã.</h1><p style={{fontSize:19,maxWidth:700}}>Organize seu kit de emergência de 72 horas e acompanhe seu progresso. Os dados desta demonstração ficam somente neste navegador.</p></section>
 <section style={{background:'white',borderRadius:18,padding:24,boxShadow:'0 6px 30px #132a2812'}}>
 <h2 style={{marginTop:0}}>Meu kit de emergência — 72 horas</h2><p>Checklist inicial para revisão e personalização conforme as necessidades da família.</p>
 <div role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={items.length} aria-label="Progresso do kit" style={{height:12,borderRadius:8,background:'#e4ebe7',overflow:'hidden'}}><div style={{height:'100%',width:(done/items.length*100)+'%',background:'#2b8057'}}/></div>
 <p><strong>{done} de {items.length}</strong> itens preparados ({Math.round(done/items.length*100)}%)</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:10}}>{items.map(item=><label key={item.id} style={{display:'flex',gap:12,alignItems:'center',padding:12,border:'1px solid #dbe6e0',borderRadius:10,cursor:'pointer'}}><input type="checkbox" checked={item.checked} onChange={()=>setItems(current=>current.map(x=>x.id===item.id?{...x,checked:!x.checked}:x))} style={{width:19,height:19}}/><span style={{textDecoration:item.checked?'line-through':'none'}}>{item.label}</span></label>)}</div>
 <button onClick={()=>{if(window.confirm('Reiniciar checklist do kit?'))setItems(initial)}} style={{marginTop:20,border:'1px solid #8aa99a',background:'white',borderRadius:8,padding:'10px 16px',cursor:'pointer'}}>Reiniciar checklist</button>
 </section>
 <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginTop:28}}>{[['SOS Família','Planos e contatos de emergência','Em desenvolvimento'],['SOS Academy','Guias e treinamentos revisados','Em desenvolvimento'],['SOS Advanced','Bushcraft e aventuras','Em desenvolvimento']].map(([title,desc,status])=><article key={title} style={{background:'white',borderRadius:12,padding:20}}><h3>{title}</h3><p>{desc}</p><small>{status}</small></article>)}</section>
 <footer style={{marginTop:40,fontSize:13,color:'#52615b'}}>Beta demonstrativa. Não substitui orientações oficiais ou serviços de emergência. Em perigo imediato, acione os serviços locais competentes.</footer>
 </main>;
}