'use client';
import { useEffect, useState } from 'react';
import SuppliesModule, { defaultSupplies, type Supplies } from './SuppliesModule';
import { SOSIcon, SOSIconSprite } from './SOSIcon';

type Item={id:string;label:string;checked:boolean};
type Contact={id:string;name:string;phone:string;role:string};
type Plan={meetingPoint:string;outsideContact:string;notes:string};
type Data={kit:Item[];contacts:Contact[];plan:Plan;supplies:Supplies};
const defaults:Data={kit:[
{id:'agua',label:'Água potável para 72 horas',checked:false},
{id:'alimentos',label:'Alimentos não perecíveis',checked:false},
{id:'lanterna',label:'Lanterna e pilhas de reserva',checked:false},
{id:'radio',label:'Rádio portátil',checked:false},
{id:'medicamentos',label:'Medicamentos pessoais e prescrições',checked:false},
{id:'primeiros',label:'Kit de primeiros socorros',checked:false},
{id:'documentos',label:'Cópias de documentos importantes',checked:false},
{id:'energia',label:'Carregador portátil',checked:false},
{id:'higiene',label:'Itens de higiene',checked:false},
{id:'roupas',label:'Roupas adequadas e cobertor',checked:false}
],contacts:[],plan:{meetingPoint:'',outsideContact:'',notes:''},supplies:defaultSupplies};
const academy=[
{title:'Como montar um kit de 72 horas',body:'Considere água, alimentação, iluminação, rádio, medicamentos, documentos e itens específicos de crianças, idosos e animais. Revise a validade e adapte quantidades ao clima e às recomendações da Defesa Civil.'},
{title:'Plano de comunicação familiar',body:'Defina dois pontos de encontro: um próximo de casa e outro fora do bairro. Escolha um contato fora da região e combine como informar localização e segurança quando houver falha de comunicação.'},
{title:'Alertas e evacuação',body:'Acompanhe os alertas oficiais da Defesa Civil. Conheça as rotas de saída e evite áreas alagadas, encostas instáveis, fios caídos e estruturas danificadas. Não retorne antes de liberação oficial.'},
{title:'Segurança na natureza',body:'Informe seu itinerário a alguém, verifique previsão e restrições locais, leve água e navegação redundante. Se estiver perdido, evite deslocamentos arriscados e busque auxílio dos serviços responsáveis.'}
];
const inputStyle:React.CSSProperties={padding:'11px 12px',border:'1px solid #b8c9c1',borderRadius:9,width:'100%',boxSizing:'border-box',font:'inherit'};
const buttonStyle:React.CSSProperties={background:'#166449',color:'white',padding:'11px 16px',border:0,borderRadius:9,cursor:'pointer',fontWeight:650};
const panel:React.CSSProperties={background:'white',padding:24,borderRadius:16,boxShadow:'0 3px 20px #0d31200c'};
function uid(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}
function validData(x:unknown):x is Data{if(!x||typeof x!=='object')return false;const d=x as Data;return Array.isArray(d.kit)&&d.kit.every(i=>typeof i.id==='string'&&typeof i.label==='string'&&typeof i.checked==='boolean')&&Array.isArray(d.contacts)&&d.contacts.every(c=>typeof c.id==='string'&&typeof c.name==='string'&&typeof c.phone==='string'&&typeof c.role==='string')&&!!d.plan&&typeof d.plan.meetingPoint==='string'&&typeof d.plan.outsideContact==='string'&&typeof d.plan.notes==='string'}
export default function Home(){
 const [data,setData]=useState<Data>(defaults),[loaded,setLoaded]=useState(false),[tab,setTab]=useState('home');
 const [itemText,setItemText]=useState(''),[name,setName]=useState(''),[phone,setPhone]=useState(''),[role,setRole]=useState(''),[notice,setNotice]=useState('');
 const [mode,setMode]=useState<'family'|'advanced'|null>(null),[moreOpen,setMoreOpen]=useState(false);
 useEffect(()=>{try{const last=localStorage.getItem('sos360:last-area')||localStorage.getItem('sos360.module');if(last==='family'||last==='advanced'){setMode(last);localStorage.setItem('sos360:last-area',last)}}catch{}},[]);
 useEffect(()=>{try{const saved=localStorage.getItem('sos360:v1');if(saved){const parsed:unknown=JSON.parse(saved);if(validData(parsed))setData({...defaults,...parsed,supplies:{...defaultSupplies,...parsed.supplies}})}else{const legacy=localStorage.getItem('sos360:kit72h:v1');if(legacy){const old=JSON.parse(legacy) as Item[];if(Array.isArray(old))setData({...defaults,kit:defaults.kit.map((x,i)=>({...x,checked:Boolean(old[i]?.checked)}))})}}}catch{}setLoaded(true)},[]);
 useEffect(()=>{if(loaded){try{localStorage.setItem('sos360:v1',JSON.stringify(data));setNotice('Dados salvos neste dispositivo')}catch{setNotice('Armazenamento indisponível; exporte uma cópia')}}},[data,loaded]);
 const done=data.kit.filter(i=>i.checked).length;
 const exportData=()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),data},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='sos360-backup.json';a.click();URL.revokeObjectURL(url)};
 const importData=async(file?:File)=>{if(!file)return;if(file.size>1024*1024){setNotice('Arquivo excede 1 MB');return}try{const raw=JSON.parse(await file.text()) as {data?:unknown};if(!validData(raw.data))throw Error();if(raw.data.kit.length>300||raw.data.contacts.length>100)throw Error();setData({...defaults,...raw.data,supplies:{...defaultSupplies,...raw.data.supplies}});setNotice('Backup importado')}catch{setNotice('Arquivo inválido. Nenhuma alteração realizada')}};
 const advanced=mode==='advanced';
 const choose=(value:'family'|'advanced')=>{setMode(value);setTab('home');setMoreOpen(false);try{localStorage.setItem('sos360:last-area',value)}catch{}};
 const go=(id:string)=>{if(id==='more'){setMoreOpen(true);return}setMoreOpen(false);setTab(id);if(typeof window!=='undefined')window.scrollTo({top:0,behavior:'smooth'})};
 const back=()=>{setMode(null);setMoreOpen(false);setTab('home')};
 const familyItems:[string,string,string,string][]=[
  ['⌂','Plano Familiar','Rotas, pontos de encontro e comunicação','family'],
  ['▣','Kit de Emergência (72h)','O que sua família precisa ter em casa','kit'],
  ['◉','Alimentos e Água','Reserva, armazenamento e preparo','supplies'],
  ['✚','Saúde e Primeiros Socorros','Cuidados essenciais e medicamentos','academy'],
  ['⌂','Casa Segura','Energia, água, saneamento e proteção','academy'],
  ['♧','Crianças e Idosos','Cuidados especiais em emergências','academy']
 ];
 const advancedItems:[string,string,string,string][]=[
  ['◈','Navegação e Orientação','Mapas, bússola, GPS e azimute','maps'],
  ['△','Abrigo e Acampamento','Montagem, isolamento e conforto','academy'],
  ['◉','Água no Campo','Captação, filtragem e purificação','academy'],
  ['☷','Alimentação no Ambiente','Obtenção, preparo e conservação','academy'],
  ['⚙','Equipamentos Essenciais','Seleção, uso e manutenção','kit'],
  ['⬡','Autodefesa e Segurança','Prevenção, avaliação de riscos e reação','academy']
 ];
 const shortcuts:[string,string,string][]=[
  ['▣','Kits 72h','kit'],['♧','Plano Familiar','family'],['☎','Contatos SOS','contacts'],
  ['✦','Guias Rápidos','academy'],['⚠','Alertas e Riscos','risks'],['☑','Checklists','kit']
 ];
 const moreIcons:[string,string,string][]=[
  ['⌂','Casa Segura','academy'],['♧','Família','family'],['✚','Saúde','academy'],['◉','Água','supplies'],
  ['☷','Alimentos','supplies'],['△','Abrigo','academy'],['♨','Fogo','academy'],['◈','Navegação','maps'],
  ['▤','Comunicação','contacts'],['▲','Sobrevivência','advanced'],['⬡','Segurança','risks'],['⚠','Alertas','risks'],
  ['☑','Checklists','kit'],['▱','Guias','academy']
 ];
 const photoCards:[string,string,string][]=[
  ['✚','KIT 72H','kit'],['◈','NAVEGAÇÃO','maps'],['◉','ÁGUA','supplies'],['♨','FOGO','academy'],
  ['☷','ALIMENTAÇÃO','supplies'],['△','ABRIGO','academy'],['✚','PRIMEIROS SOCORROS','academy'],
  ['▤','COMUNICAÇÃO','contacts'],['⚠','RISCOS E DESASTRES','risks'],['♧','PREPARAÇÃO FAMILIAR','family']
 ];
 const openItem=(id:string)=>{if(id==='more'){setMoreOpen(true);return}if(id==='advanced'){choose('advanced');return}if(!mode&&id!=='home')choose('family');go(id)};
 return <div className={'sos-experience '+(advanced?'theme-advanced':mode?'theme-family':'theme-neutral')}>
  <SOSIconSprite/>
  <header className="sos-header">
   <button type="button" className="sos-brand" onClick={back} aria-label="SOS360 - escolher tipo de acesso"><img src="/interface/brand/sos360-logo-sem-slogan.png" alt="SOS360" width={190} height={60}/><small>PREPARAÇÃO • PROTEÇÃO • SOBREVIVÊNCIA</small></button>
   <span className="sos-header-pill">{mode===null?'ESCOLHA SUA JORNADA':advanced?'● ADVANCED':'● FAMILY'}</span>
  </header>
  <div className="sos-layout">
  <aside className="sos-side"><p className="sos-side-label">ACESSO RÁPIDO</p><nav aria-label="Navegação do SOS360">{[['⌂','Início','home'],['▤','Academy','academy'],['◈','Mapas','maps'],['☷','Mais','more'],['▣','Kit 72h','kit'],['♧','Plano Familiar','family'],['☎','Contatos','contacts'],['◉','Água e Alimentos','supplies'],['⤓','Backup','backup']].map(([icon,label,id])=><button type="button" key={id} className={tab===id?'selected':''} onClick={()=>openItem(id)}><SOSIcon name={icon}/>{label}</button>)}</nav><small>Dados locais mantidos neste dispositivo até configurar sincronização.</small></aside>
  <main className="sos-content">
   {mode===null?<><section className="sos-welcome"><span className="sos-kicker">SOS360 • PREPARE-SE HOJE</span><h1>Preparação para todos os momentos.</h1><p>Escolha como deseja se preparar. Sua segurança começa com informação clara e um plano prático.</p></section>
    <div className="sos-mode-grid"><button type="button" className="sos-mode sos-mode-family" onClick={()=>choose('family')}><span className="sos-mode-illustration"><SOSIcon name="family"/></span><span className="sos-mode-label">SOS FAMILY</span><strong>Proteja quem você ama.</strong><small>Segurança e preparação para toda a família</small><b>Explorar Family →</b></button><button type="button" className="sos-mode sos-mode-advanced" onClick={()=>choose('advanced')}><span className="sos-mode-illustration"><SOSIcon name="mountain"/></span><span className="sos-mode-label">SOS ADVANCED</span><strong>Aventura com preparo.</strong><small>Técnicas e recursos avançados de sobrevivência</small><b>Explorar Advanced →</b></button></div>
    <div className="sos-section-heading"><h2>Na palma da sua mão</h2><p>Acesso rápido ao que pode fazer diferença em uma emergência.</p></div>
    <div className="sos-shortcuts">{shortcuts.map(([ico,label,id])=><button key={label} type="button" onClick={()=>openItem(id)}><span className="sos-shortcut-icon"><SOSIcon name={ico}/></span><strong>{label}</strong></button>)}</div>
   </>:<><button type="button" className="sos-back" onClick={back}>← Voltar à escolha de acesso</button>
    <section className={'sos-module-hero '+(advanced?'is-advanced':'is-family')}><span className="sos-module-photo" aria-hidden="true"><SOSIcon name={advanced?'mountain':'family'}/></span><div><span className="sos-kicker">SOS360 / {advanced?'ADVANCED':'FAMILY'}</span><h1>{advanced?'ADVANCED':'FAMILY'}</h1><p>{advanced?'Técnicas, equipamentos e estratégias avançadas para explorar com segurança.':'Sua família preparada, segura e protegida.'}</p></div></section>
    <div className="sos-module-list" aria-label={'Recursos do SOS '+(advanced?'Advanced':'Family')}>{(advanced?advancedItems:familyItems).map(([icon,title,subtitle,id])=><button className="sos-module-row" type="button" key={title} onClick={()=>go(id)}><span className="sos-row-icon"><SOSIcon name={icon}/></span><span className="sos-row-text"><strong>{title}</strong><small>{subtitle}</small></span><span aria-hidden="true">›</span></button>)}</div>
    </>}
    {mode!==null&&<div className="sos-working-area">
     {tab!=='home'&&<div className="sos-section-heading"><h2>{({kit:'Kit 72h',family:'Plano Familiar',supplies:'Água e Alimentação',contacts:'Contatos SOS',academy:'SOS Academy',backup:'Backup',maps:'Mapas',risks:'Alertas e Riscos'} as Record<string,string>)[tab]||'SOS360'}</h2><p>{advanced?'SOS Advanced':'SOS Family'} • {tab==='maps'||tab==='risks'?'Área prevista no roadmap':'Ferramenta disponível'}</p></div>}
     {tab==='supplies'&&<SuppliesModule value={data.supplies} onChange={supplies=>setData(d=>({...d,supplies}))}/>}
 {tab==='kit'&&<section className="panel"><div className="metric"><h2>🎒 Kit de emergência 72h</h2><strong>{data.kit.length?Math.round(done/data.kit.length*100):0}%</strong></div><p>Marque o que já está preparado e personalize conforme as pessoas da sua casa.</p><div className="progress" role="progressbar" aria-label="Progresso do kit" aria-valuemin={0} aria-valuemax={data.kit.length} aria-valuenow={done}><div style={{width:(data.kit.length?done/data.kit.length*100:0)+'%'}}/></div><p>{done} de {data.kit.length} itens preparados</p>{data.kit.map(item=><div className="check" key={item.id}><label><input type="checkbox" checked={item.checked} onChange={()=>setData(d=>({...d,kit:d.kit.map(x=>x.id===item.id?{...x,checked:!x.checked}:x)}))}/><span style={{textDecoration:item.checked?'line-through':'none'}}>{item.label}</span></label><button type="button" className="x" aria-label={'Remover '+item.label} onClick={()=>setData(d=>({...d,kit:d.kit.filter(x=>x.id!==item.id)}))}>✕</button></div>)}<form className="row" onSubmit={e=>{e.preventDefault();const label=itemText.trim();if(!label)return;setData(d=>({...d,kit:[...d.kit,{id:uid(),label,checked:false}]}));setItemText('')}}><input className="field" aria-label="Novo item" maxLength={120} value={itemText} onChange={e=>setItemText(e.target.value)} placeholder="Adicionar item personalizado"/><button className="btn">Adicionar</button></form><button type="button" className="btn alt" style={{marginTop:12}} onClick={()=>{if(confirm('Desmarcar todos os itens?'))setData(d=>({...d,kit:d.kit.map(x=>({...x,checked:false}))}))}}>Desmarcar tudo</button></section>}
 {tab==='supplies'&&<SuppliesModule value={data.supplies} onChange={supplies=>setData(d=>({...d,supplies}))}/>}
 {tab==='family'&&<section className="panel"><h2>🏡 Plano de emergência familiar</h2><p>Defina rotas, encontros e comunicações. Revise o plano com todos os moradores.</p>{([['meetingPoint','Pontos de encontro'],['outsideContact','Contato de referência fora da região'],['notes','Rotas, necessidades especiais e observações']] as [keyof Plan,string][]).map(([key,label])=><label key={key}><span className="field-label">{label}</span><textarea className="field" rows={key==='notes'?5:2} maxLength={2000} value={data.plan[key]} onChange={e=>setData(d=>({...d,plan:{...d.plan,[key]:e.target.value}}))}/></label>)}<p>Alterações salvas automaticamente neste navegador.</p></section>}
 {tab==='contacts'&&<section className="panel"><h2>☎️ Contatos de emergência</h2><p>Guarde números de pessoas de confiança. Para situações reais, consulte também os canais oficiais locais.</p><form className="row" onSubmit={e=>{e.preventDefault();if(!name.trim()||!phone.trim())return;setData(d=>({...d,contacts:[...d.contacts,{id:uid(),name:name.trim(),phone:phone.trim(),role:role.trim()}]}));setName('');setPhone('');setRole('')}}><input className="field" aria-label="Nome" required maxLength={100} placeholder="Nome" value={name} onChange={e=>setName(e.target.value)}/><input className="field" aria-label="Telefone" required maxLength={40} placeholder="Telefone" value={phone} onChange={e=>setPhone(e.target.value)}/><input className="field" aria-label="Vínculo" maxLength={100} placeholder="Vínculo ou função" value={role} onChange={e=>setRole(e.target.value)}/><button className="btn">Salvar contato</button></form>{data.contacts.length===0?<p>Nenhum contato cadastrado.</p>:data.contacts.map(c=><div className="contact" key={c.id}><div><strong>{c.name}</strong> {c.role&&<small>({c.role})</small>}<div>{c.phone}</div></div><button type="button" className="x" onClick={()=>setData(d=>({...d,contacts:d.contacts.filter(x=>x.id!==c.id)}))}>Excluir</button></div>)}</section>}
 {tab==='academy'&&<section className="panel"><h2>📚 SOS Academy</h2><p>Guias introdutórios de prevenção. Não substituem treinamento ou orientações dos órgãos oficiais.</p>{academy.map(a=><article className="guide" key={a.title}><h3>{a.title}</h3><p>{a.body}</p></article>)}</section>}
 {tab==='backup'&&<section className="panel"><h2>💾 Backup de dados</h2><p>Os dados ficam armazenados neste aparelho. Exporte regularmente um backup e proteja o arquivo, pois pode conter contatos pessoais.</p><button type="button" className="btn" onClick={exportData}>Exportar JSON</button><label><span className="field-label">Importar backup (substitui os dados atuais)</span><input className="field" aria-label="Importar backup" type="file" accept=".json,application/json" onChange={e=>{void importData(e.target.files?.[0]);e.target.value=''}}/></label></section>}
     {tab==='maps'&&<section className="panel"><h2>◈ Mapas e orientação</h2><p>O módulo de mapas e navegação offline está planejado. Nenhuma rota, localização em tempo real ou navegação está disponível nesta versão.</p><p>Para atividades externas, prepare mapas confiáveis com antecedência e siga as orientações oficiais.</p></section>}
     {tab==='risks'&&<section className="panel"><h2>⚠ Alertas e riscos</h2><p>O acompanhamento de alertas oficiais por região está planejado e ainda não está conectado a serviços da Defesa Civil. Este aplicativo não emite alertas em tempo real.</p><p>Em situações de risco, consulte imediatamente os canais oficiais da sua região.</p></section>}
     {tab==='home'&&<div className="sos-home-tools"><section className="panel"><h2>▣ Meu Kit 72h</h2><div className="metric"><p>Seu progresso de preparação</p><strong>{data.kit.length?Math.round(done/data.kit.length*100):0}%</strong></div><div className={'progress '+(advanced?'green':'')}><div style={{width:(data.kit.length?done/data.kit.length*100:0)+'%'}}/></div><button className={'btn '+(advanced?'adv':'')} onClick={()=>go('kit')}>Abrir checklist →</button></section><section className="panel"><h2>⌂ Plano de emergência</h2><p>Defina pontos de encontro, contatos e rotas de saída.</p><button className="btn alt" onClick={()=>go('family')}>Abrir plano →</button></section></div>}
    </div>}
    <div role="status" className="sos-save-status">{loaded?notice:'Carregando seus dados...'}</div>
    <footer className="sos-disclaimer">SOS360 • Preparação, proteção e sobrevivência. Os dados ficam no navegador. Não substitui serviços de emergência ou orientações oficiais.</footer>
  </main></div>
  <nav className="sos-bottom-nav" aria-label="Navegação inferior">{[['⌂','Início','home'],['▤','Academy','academy'],['◈','Mapas','maps'],['☷','Mais','more']].map(([icon,title,id])=><button key={id} type="button" className={((tab===id)||(moreOpen&&id==='more'))?'active':''} onClick={()=>openItem(id)}><strong><SOSIcon name={icon}/></strong><span>{title}</span></button>)}</nav>
  {moreOpen&&<div className="sos-more-overlay" role="dialog" aria-modal="true" aria-label="Menu Mais"><div className="sos-more-backdrop" aria-hidden="true">⌁ △ ⌁</div><header className="sos-more-header"><strong>✚ SOS360 / MAIS</strong><button type="button" onClick={()=>setMoreOpen(false)} aria-label="Fechar menu Mais">✕</button></header><div className="sos-more-inner"><h2>Tudo que você precisa encontrar</h2><p>Explore os recursos do SOS360 por categoria.</p><div className="sos-icon-grid">{moreIcons.map(([icon,label,id])=><button type="button" key={label} onClick={()=>openItem(id)}><span><SOSIcon name={icon}/></span><small>{label}</small></button>)}</div><h3>Guias de preparação e sobrevivência</h3><div className="sos-photo-grid">{photoCards.map(([icon,label,id],i)=><button type="button" key={label} className={'sos-photo-tile tile-'+(i%5)} onClick={()=>openItem(id)}><span className="sos-photo-glyph" aria-hidden="true"><SOSIcon name={icon}/></span><strong>{label}</strong></button>)}</div><div className="sos-more-actions"><button type="button" onClick={()=>openItem('backup')}>⤓ Backup dos meus dados</button><button type="button" onClick={back}>⇄ Trocar Family / Advanced</button></div></div></div>}
 </div>;
}