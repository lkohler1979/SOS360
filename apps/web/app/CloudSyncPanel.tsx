'use client';
import { useEffect, useRef, useState } from 'react';

type Remote = {data:unknown;version:number};
type ResponseData={error?:string;message?:string;email?:string;data?:unknown;version?:number};
type Props={data:unknown;onReceive:(data:unknown)=>boolean};

async function request(path:string,method='GET',payload?:unknown):Promise<ResponseData>{
 const response=await fetch('/api/cloud/'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},body:payload===undefined?undefined:JSON.stringify(payload),cache:'no-store'});
 const result:ResponseData=await response.json().catch(()=>({error:'invalid_response'}));
 if(!response.ok)throw new Error(response.status===409?'Conflito: existem alterações em outro dispositivo. Exporte um backup e recarregue os dados da conta.':result.message||result.error||'Não foi possível completar a operação');
 return result;
}

export default function CloudSyncPanel({data,onReceive}:Props){
 const [email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [account,setAccount]=useState(''),[mode,setMode]=useState<'login'|'register'>('login');
 const [message,setMessage]=useState(''),[working,setWorking]=useState(false);
 const [linked,setLinked]=useState(false),[version,setVersion]=useState(0),[snapshot,setSnapshot]=useState('');
 const busy=useRef(false);
 useEffect(()=>{void request('me').then(r=>{if(r.email)setAccount(r.email)}).catch(()=>{})},[]);
 async function login(e:React.FormEvent){
  e.preventDefault();setWorking(true);setMessage('');
  try{const r=await request('auth/'+mode,'POST',{email,password});setPassword('');setAccount(r.email||email);setLinked(false);setMessage('Conta conectada. Escolha quais dados deseja sincronizar.');}
  catch(e){setMessage(e instanceof Error?e.message:'Erro ao entrar');}
  finally{setWorking(false)}
 }
 async function connect(){
  setWorking(true);setMessage('');
  try{
   const remote=await request('state') as Remote;
   if(remote.data===null||remote.data===undefined){
    if(!window.confirm('A conta ainda não tem dados. Enviar suas informações deste dispositivo para a nuvem?'))return;
    const saved=await request('state','PUT',{data,version:0});
    setVersion(saved.version||1);setSnapshot(JSON.stringify(data));setLinked(true);setMessage('Dados enviados. Sincronização automática ativa.');
   }else{
    if(!window.confirm('Baixar o conteúdo da conta e SUBSTITUIR os dados locais deste dispositivo? Exporte um backup antes, se necessário.'))return;
    if(!onReceive(remote.data))throw new Error('Os dados da conta não passaram na validação.');
    setVersion(remote.version);setSnapshot(JSON.stringify(remote.data));setLinked(true);setMessage('Dados da nuvem baixados. Sincronização automática ativa.');
   }
  }catch(e){setMessage(e instanceof Error?e.message:'Erro de sincronização')}
  finally{setWorking(false)}
 }
 useEffect(()=>{
  if(!linked||!account||JSON.stringify(data)===snapshot||busy.current)return;
  const timer=setTimeout(async()=>{
   if(busy.current)return;
   busy.current=true;setMessage('Salvando alterações na nuvem...');
   try{
    const result=await request('state','PUT',{data,version});
    setSnapshot(JSON.stringify(data));setVersion(result.version||version+1);setMessage('Alterações sincronizadas com sucesso.');
   }catch(e){setLinked(false);setMessage(e instanceof Error?e.message:'Falha ao sincronizar; dados locais preservados.')}
   finally{busy.current=false}
  },950);
  return()=>clearTimeout(timer);
 },[data,version,linked,snapshot,account]);
 async function logout(){setWorking(true);try{await request('auth/logout','POST');setAccount('');setLinked(false);setPassword('');setMessage('Sessão encerrada. Os dados locais permanecem neste dispositivo.')}catch(e){setMessage(e instanceof Error?e.message:'Erro ao sair')}finally{setWorking(false)}}
 return <section className="panel">
  <div className="supplies-intro"><div><span className="overline">SOS360 / SUA CONTA</span><h2>☁️ Sincronização entre dispositivos</h2><p>Conecte uma conta para salvar e recuperar seu planejamento familiar usando o PostgreSQL do SOS360.</p></div><span className="supplies-illustration" aria-hidden="true">🔐</span></div>
  {!account?<form onSubmit={login} style={{maxWidth:460}}>
   <label><span className="field-label">E-mail</span><input className="field" type="email" required maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label><span className="field-label">Senha (mínimo de 12 caracteres)</span><input className="field" type="password" minLength={mode==='register'?12:1} maxLength={128} required autoComplete={mode==='register'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label>
   <div className="row" style={{marginTop:16}}><button className="btn" disabled={working}>{mode==='register'?'Criar conta':'Entrar'}</button><button type="button" className="btn alt" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Criar conta':'Já tenho conta'}</button></div>
  </form>:<div><p><strong>Conta:</strong> {account}</p><p><strong>Status:</strong> {linked?'● Sincronização automática ativa':'○ Dados locais ainda não vinculados'}</p><div className="row"><button className="btn" disabled={working} onClick={()=>void connect()}>{linked?'Recarregar da conta':'Conectar meus dados à conta'}</button><button className="btn alt" disabled={working} onClick={()=>void logout()}>Sair</button></div><p>Na primeira conexão, escolha manter os dados locais ou baixar os dados já salvos. Se houver conflito, a sincronização é interrompida para evitar substituição silenciosa.</p></div>}
  {message&&<p role="status" aria-live="polite">{message}</p>}
  <div className="supply-note"><strong>Privacidade e segurança</strong><p>A sessão usa cookie HttpOnly e conexão HTTPS. Enquanto não conectar uma conta, seus dados ficam apenas no navegador. Faça backups locais regularmente; a sincronização exige internet.</p></div>
 </section>;
