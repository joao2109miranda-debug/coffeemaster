import { useNavigate, Link } from 'react-router-dom';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import Context from 'pages/Context';
import { useContext, useState } from 'react';
import supabase from 'services/supabase';

const ProfileSettings = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');
    if (password.length < 6) {
      setPwErr('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setPwErr('As senhas não coincidem.');
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPw(false);
    if (error) {
      setPwErr('Não foi possível alterar a senha. ' + (error.message || ''));
      return;
    }
    setPassword('');
    setConfirm('');
    setPwMsg('Senha alterada com sucesso!');
  };

  const deleteAccount = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm('Tem certeza? Esta ação é permanente e não pode ser desfeita.')) return;
    setDeleting(true);
    const { error } = await supabase.rpc('delete_own_account');
    if (error) {
      setDeleting(false);
      console.error('Erro ao excluir conta:', error);
      alert('Não foi possível excluir a conta. Rode supabase/account.sql no Supabase para habilitar esta função.');
      return;
    }
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      <Header />

      <div className="page-wrap">
        <div className="page-head flex-space" style={{ alignItems: "center" }}>
          <div>
            <h6 className="uppercase color-primary">CONFIGURAÇÕES</h6>
            <h3>Conta e segurança</h3>
          </div>
          <Link to="/profile" className="link">← Voltar ao perfil</Link>
        </div>

        <p className="mb-3">{user && user.email}</p>

        {/* Alterar senha */}
        <form onSubmit={changePassword} className="admin-form" style={{ maxWidth: 480 }}>
          <h5 className="mb-2">Alterar senha</h5>
          <label htmlFor="password"><h6 className="mb-1">Nova senha</h6></label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
          <label htmlFor="confirm" className="mt-2"><h6 className="mb-1">Confirmar nova senha</h6></label>
          <input type="password" id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {pwErr ? <div className="card-danger p-2 mt-2"><h6 className="h7 color-red">{pwErr}</h6></div> : null}
          {pwMsg ? <div className="card-success p-2 mt-2"><h6 className="h7 color-green">{pwMsg}</h6></div> : null}
          <div className="mt-3">
            <button type="submit" className="btn" disabled={savingPw}>{savingPw ? "Salvando..." : "Salvar nova senha"}</button>
          </div>
        </form>

        {/* Zona de perigo */}
        <div className="mt-4" style={{ maxWidth: 480, paddingTop: 24, borderTop: "1px solid #2c1a19" }}>
          <h5 className="mb-1" style={{ color: "#e57373" }}>Excluir conta</h5>
          <p className="mb-2">Remove permanentemente sua conta e o acesso. Esta ação não pode ser desfeita.</p>
          <button type="button" className="btn-danger" onClick={deleteAccount} disabled={deleting}>
            {deleting ? "Excluindo..." : "Excluir minha conta"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProfileSettings;
