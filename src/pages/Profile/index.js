import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Context from '../../pages/Context';
import { useContext, useState, useEffect } from 'react';
import supabase from '../../services/supabase';

const Profile = () => {
  const { user } = useContext(Context);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', surname: '', username: '', description: '', image_profile: '' });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('name, surname, username, description, image_profile, is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) { console.error(error); return; }
        setProfile(data);
        setForm({
          name: data.name || '',
          surname: data.surname || '',
          username: data.username || '',
          description: data.description || '',
          image_profile: data.image_profile || '',
        });
      });
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const uploadAvatar = async () => {
    if (!file) return form.image_profile || null;
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setSaving(true);
    try {
      const imageUrl = await uploadAvatar();
      const { error: upErr } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          surname: form.surname,
          username: form.username,
          description: form.description,
          image_profile: imageUrl,
        })
        .eq('id', user.id);
      if (upErr) throw upErr;
      setProfile({ ...profile, ...form, image_profile: imageUrl });
      setFile(null);
      setEditing(false);
      setMsg('Perfil atualizado!');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError('Não foi possível salvar. ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const avatar = (profile && profile.image_profile) || form.image_profile;

  return (
    <>
      <Header />

      <div className="page-wrap">
        {/* Cabeçalho do dashboard */}
        <div className="dash-header">
          <img className="dash-avatar" src={avatar} alt="" />
          <div style={{ flex: 1 }}>
            {profile ? (
              <>
                <h3 className="color-white" style={{ margin: 0 }}>{profile.name} {profile.surname}</h3>
                <h6 className="color-gray">@{profile.username}{profile.is_admin ? ' · Administrador da página' : ''}</h6>
              </>
            ) : (
              <p>Carregando perfil...</p>
            )}
          </div>
          <button type="button" className="btn-outline btn-sm" onClick={() => { setEditing(!editing); setMsg(''); setError(''); }}>
            {editing ? 'Fechar' : 'Editar perfil'}
          </button>
        </div>

        {msg ? <div className="card-success p-2 mt-2" style={{ maxWidth: 520 }}><h6 className="h7 color-green">{msg}</h6></div> : null}

        {/* Formulário de edição */}
        {editing && (
          <form onSubmit={saveProfile} className="admin-form profile-edit-form mt-3">
            <div className="profile-edit-grid">
              <section className="profile-edit-panel">
                <h5>Dados do perfil</h5>
                <div className="row p-0">
                  <div className="grid-6 p-0">
                    <label htmlFor="name"><h6 className="mb-1">Nome</h6></label>
                    <input type="text" id="name" name="name" value={form.name} onChange={onChange} />
                  </div>
                  <div className="grid-6 p-0">
                    <label htmlFor="surname"><h6 className="mb-1">Sobrenome</h6></label>
                    <input type="text" id="surname" name="surname" value={form.surname} onChange={onChange} />
                  </div>
                </div>
                <div className="row p-0"><div className="grid-12 p-0">
                  <label htmlFor="username"><h6 className="mb-1">@ (usuário)</h6></label>
                  <input type="text" id="username" name="username" value={form.username} onChange={onChange} />
                </div></div>
                <div className="row p-0">
                  <div className="grid-6 p-0">
                    <h6 className="mb-1">Foto de perfil</h6>
                    <div className="file-field">
                      <label className="file-btn" htmlFor="avatar"><span>📎 Escolher arquivo</span></label>
                      <input type="file" id="avatar" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
                      <span className="file-name">{file ? file.name : 'Nenhum arquivo escolhido'}</span>
                    </div>
                  </div>
                  <div className="grid-6 p-0">
                    <label htmlFor="image_profile"><h6 className="mb-1">...ou colar URL</h6></label>
                    <input type="text" id="image_profile" name="image_profile" value={form.image_profile} onChange={onChange} placeholder="https://..." />
                  </div>
                </div>
              </section>
              <section className="profile-edit-panel profile-signature-panel">
                <h5>Assinatura do autor</h5>
                <p className="color-gray">Exibida ao fim dos seus posts no blog.</p>
                <label htmlFor="description"><h6 className="mb-1">Apresentação profissional</h6></label>
                <textarea id="description" name="description" rows="8" value={form.description} onChange={onChange} placeholder="Ex.: Especialista em cafés especiais e cafeicultura." />
              </section>
            </div>
            {error ? <div className="card-danger p-2 mt-2"><h6 className="h7 color-red">{error}</h6></div> : null}
            <div className="flex-end-row mt-3">
              <button type="submit" className="btn" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        )}

        {/* Cards de ação */}
        {editing ? <div className="profile-actions-divider" aria-hidden="true" /> : null}
        <div className="dash-grid">
          <Link to="/profile/posts" className="dash-card">
            <span className="dash-ico">📝</span>
            <h5>Gerenciar posts</h5>
            <p className="color-gray">Publique novos artigos no blog.</p>
          </Link>

          {profile && profile.is_admin && (
            <Link to="/profile/products" className="dash-card">
              <span className="dash-ico">☕</span>
              <h5>Gerenciar produtos</h5>
              <p className="color-gray">Cadastre, edite e remova máquinas.</p>
            </Link>
          )}

          <Link to="/profile/settings" className="dash-card">
            <span className="dash-ico">⚙️</span>
            <h5>Configurações</h5>
            <p className="color-gray">Senha e exclusão de conta.</p>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
