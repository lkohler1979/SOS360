'use client';
import { useEffect, useRef, useState } from 'react';

type CloudResponse = {
  email?: string; error?: string; message?: string;
  data?: unknown; version?: number;
};
type Props = {
  data: unknown;
  onReceive: (remote: unknown) => boolean;
};
async function callCloud(path: string, method: 'GET' | 'POST' | 'PUT' = 'GET', body?: unknown): Promise<CloudResponse> {
  const response = await fetch('/api/cloud/' + path, {
    method, credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const payload: CloudResponse = await response.json().catch(() => ({ error: 'invalid_response' }));
  if (!response.ok) {
    if (response.status === 409 && path === 'state') {
      throw new Error('Há alterações feitas em outro dispositivo. Faça um backup e recarregue a versão da nuvem antes de continuar.');
    }
    throw new Error(payload.message || payload.error || 'O serviço não respondeu.');
  }
  return payload;
}

export default function CloudSyncPanel({ data, onReceive }: Props) {
  const [account, setAccount] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [linked, setLinked] = useState(false);
  const [version, setVersion] = useState(0);
  const [snapshot, setSnapshot] = useState('');
  const inFlight = useRef(false);

  useEffect(() => {
    void callCloud('me').then(r => {
      if (r.email) setAccount(r.email);
    }).catch(() => {});
  }, []);

  async function onLogin(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setStatus('');
    try {
      const result = await callCloud('auth/' + mode, 'POST', { email: email.trim(), password });
      setPassword('');
      setAccount(result.email || email.trim().toLowerCase());
      setLinked(false);
      setStatus('Conta conectada. Escolha se deseja enviar seus dados locais ou baixar o planejamento da conta.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally { setBusy(false); }
  }

  async function link() {
    setBusy(true); setStatus('');
    try {
      const remote = await callCloud('state');
      if (remote.data == null) {
        if (!window.confirm('Esta conta está vazia. Enviar as informações deste dispositivo para o banco de dados?')) return;
        const saved = await callCloud('state', 'PUT', { data, version: 0 });
        setVersion(saved.version ?? 1);
        setSnapshot(JSON.stringify(data));
        setLinked(true);
        setStatus('Dados enviados à conta. Sincronização automática habilitada.');
        return;
      }
      if (!window.confirm('Baixar os dados da conta e SUBSTITUIR o planejamento local? Exporte um backup antes, caso precise preservar as alterações deste dispositivo.')) return;
      if (!onReceive(remote.data)) throw new Error('Os dados da conta não passaram na validação. Dados locais preservados.');
      setSnapshot(JSON.stringify(remote.data));
      setVersion(remote.version ?? 0);
      setLinked(true);
      setStatus('Dados recebidos da nuvem. Sincronização automática habilitada.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Falha ao sincronizar.');
    } finally { setBusy(false); }
  }

  useEffect(() => {
    const serialized = JSON.stringify(data);
    if (!account || !linked || serialized === snapshot || inFlight.current) return;
    const timeout = window.setTimeout(async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      setStatus('Salvando alterações no banco de dados...');
      try {
        const result = await callCloud('state', 'PUT', { data, version });
        setSnapshot(serialized);
        setVersion(result.version ?? version + 1);
        setStatus('Alterações sincronizadas com sucesso.');
      } catch (error) {
        setLinked(false);
        setStatus(error instanceof Error ? error.message : 'Erro de sincronização. Dados locais preservados.');
      } finally {
        inFlight.current = false;
      }
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [data, account, linked, snapshot, version]);

  async function logout() {
    setBusy(true);
    try {
      await callCloud('auth/logout', 'POST');
      setAccount(''); setPassword(''); setLinked(false); setSnapshot(''); setVersion(0);
      setStatus('Você saiu da conta. O planejamento local continua neste dispositivo.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível sair.');
    } finally { setBusy(false); }
  }

  return <section className="panel">
    <h2>☁️ Conta SOS360 e sincronização</h2>
    <p>Salve o kit, os suprimentos, os contatos e o plano familiar em sua conta para acessar em outros dispositivos.</p>
    {!account
      ? <form onSubmit={event => { void onLogin(event); }} style={{ maxWidth: 460 }}>
          <label><span className="field-label">E-mail</span><input className="field" autoComplete="email" type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label><span className="field-label">Senha (mínimo de 12 caracteres para criar uma conta)</span><input className="field" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} type="password" required minLength={mode === 'register' ? 12 : 1} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /></label>
          <div className="row" style={{ marginTop: 15 }}>
            <button className="btn" disabled={busy}>{mode === 'register' ? 'Criar conta' : 'Entrar'}</button>
            <button type="button" className="btn alt" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>{mode === 'login' ? 'Criar uma conta' : 'Já tenho conta'}</button>
          </div>
        </form>
      : <div>
          <p><strong>Conta:</strong> {account}</p>
          <p><strong>Sincronização:</strong> {linked ? 'Ativa — mudanças são enviadas automaticamente' : 'Aguardando vinculação dos dados deste dispositivo'}</p>
          <div className="row">
            <button className="btn" type="button" disabled={busy || inFlight.current} onClick={() => void link()}>{linked ? 'Atualizar dados da conta' : 'Vincular dados à nuvem'}</button>
            <button className="btn alt" type="button" disabled={busy || inFlight.current} onClick={() => void logout()}>Sair</button>
          </div>
          <p>Se a conta já tiver informações, a primeira vinculação solicitará sua confirmação antes de substituir qualquer dado local. Alterações conflitantes interrompem o envio automático.</p>
        </div>}
    <p role="status" aria-live="polite">{status}</p>
    <div className="supply-note"><strong>Importante</strong><p>Faça backup antes de trocar de aparelho ou vincular a conta. A sincronização precisa de internet. Até configurar o PostgreSQL, o acesso à conta ficará indisponível; seus dados locais continuarão salvos.</p></div>
  </section>;
}
