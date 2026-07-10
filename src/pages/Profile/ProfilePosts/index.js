import { useNavigate, Link } from 'react-router-dom';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import Context from 'pages/Context';
import { useContext, useState, useEffect, useCallback } from 'react';
import supabase from 'services/supabase';

const emptyForm = {
  id: null,
  date: "",
  image_url: "",
  category: "tecnologia",
  title: "",
  resume: "",
  content: "",
  duration: "5",
  views: 10,
  status: 1,
};

const ProfilePosts = () => {
  const { user } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, category, date, image_url, resume, views, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setPosts(data || []);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const onChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => setForm(emptyForm);

  const editPost = async (p) => {
    // Busca o post completo (conteúdo é grande)
    const { data, error } = await supabase.from('posts').select('*').eq('id', p.id).single();
    if (error) { console.error(error); return; }
    setForm({
      id: data.id,
      date: data.date || "",
      image_url: data.image_url || "",
      category: data.category || "tecnologia",
      title: data.title || "",
      resume: data.resume || "",
      content: data.content || "",
      duration: data.duration || "5",
      views: data.views || 10,
      status: data.status ?? 1,
    });
    setMsg('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    setMsg('');
    if (!user) { setError('Você precisa estar logado.'); return; }

    setSaving(true);
    const payload = {
      date: form.date || null,
      image_url: form.image_url,
      category: form.category,
      title: form.title,
      resume: form.resume,
      content: form.content,
      duration: form.duration,
      views: Number(form.views) || 0,
      status: Number(form.status) || 1,
    };

    let resErr, newId;
    if (form.id) {
      ({ error: resErr } = await supabase.from('posts').update(payload).eq('id', form.id));
      newId = form.id;
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({ ...payload, user_id: user.id })
        .select('id')
        .single();
      resErr = error;
      newId = data && data.id;
    }
    setSaving(false);

    if (resErr) {
      console.error('Erro ao salvar post:', resErr);
      setError('Não foi possível salvar o post. ' + (resErr.message || ''));
      return;
    }

    setMsg(form.id ? 'Post atualizado!' : 'Post publicado!');
    if (!form.id && newId) {
      // Redireciona para o post recém-criado
      navigate(`/posts/${newId}`);
      return;
    }
    resetForm();
    load();
  };

  const handleDelete = async (p) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm(`Excluir o post "${p.title}"?`)) return;
    const { error } = await supabase.from('posts').delete().eq('id', p.id);
    if (error) {
      console.error(error);
      setError('Não foi possível excluir o post.');
      return;
    }
    if (form.id === p.id) resetForm();
    load();
  };

  const fmtDate = (v) => { try { return new Date(v).toLocaleDateString('pt-BR'); } catch { return v; } };

  return (
    <>
      <Header />

      <div className="page-wrap">
        <div className="page-head flex-space" style={{ alignItems: "center" }}>
          <div>
            <h6 className="uppercase color-primary">GERENCIAR POSTS</h6>
            <h3>{form.id ? "Editar post" : "Novo post"}</h3>
          </div>
          <Link to="/profile" className="link">← Voltar ao perfil</Link>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="row p-0">
            <div className="grid-3 p-0">
              <label htmlFor="date"><h6 className="mb-1">Data</h6></label>
              <input type="date" name="date" id="date" value={form.date} onChange={onChange} />
            </div>
            <div className="grid-3 p-0">
              <label htmlFor="category"><h6 className="mb-1">Categoria</h6></label>
              <select name="category" id="category" value={form.category} onChange={onChange}>
                <option value="tecnologia">Tecnologia</option>
                <option value="games">Games</option>
                <option value="fotografia">Fotografia</option>
                <option value="cinema">Cinema</option>
              </select>
            </div>
            <div className="grid-6 p-0">
              <label htmlFor="title"><h6 className="mb-1">Título</h6></label>
              <input type="text" name="title" id="title" value={form.title} onChange={onChange} />
            </div>
          </div>
          <div className="row p-0">
            <div className="grid-12 p-0">
              <label htmlFor="resume"><h6 className="mb-1">Resumo do post</h6></label>
              <input type="text" name="resume" id="resume" value={form.resume} onChange={onChange} />
            </div>
          </div>
          <div className="row p-0">
            <div className="grid-8 p-0">
              <label htmlFor="image_url"><h6 className="mb-1">URL da imagem</h6></label>
              <input type="text" name="image_url" id="image_url" value={form.image_url} onChange={onChange} placeholder="https://..." />
            </div>
            <div className="grid-4 p-0">
              <label htmlFor="duration"><h6 className="mb-1">Duração de leitura</h6></label>
              <select name="duration" id="duration" value={form.duration} onChange={onChange}>
                <option value="5">5 min.</option>
                <option value="7">7 min.</option>
                <option value="10">10 min.</option>
                <option value="15">15 min.</option>
              </select>
            </div>
          </div>
          <div className="row p-0">
            <div className="grid-12 p-0">
              <label htmlFor="content"><h6 className="mb-1">Conteúdo</h6></label>
              <textarea name="content" id="content" rows="8" value={form.content} onChange={onChange}></textarea>
            </div>
          </div>

          {error ? <div className="card-danger p-2 mt-2"><h6 className="h7 color-red">{error}</h6></div> : null}
          {msg ? <div className="card-success p-2 mt-2"><h6 className="h7 color-green">{msg}</h6></div> : null}

          <div className="flex-end-row mt-3" style={{ alignItems: "center", gap: "16px" }}>
            {form.id ? (
              <button type="button" className="link-btn" onClick={resetForm} style={{ color: "#999a9b" }}>Cancelar edição</button>
            ) : null}
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Salvando..." : form.id ? "Salvar alterações" : "Publicar"}
            </button>
          </div>
        </form>

        <h3 className="mb-2 mt-4">Meus posts ({posts.length})</h3>
        {posts.length === 0 ? (
          <p>Você ainda não publicou nenhum post.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="manage-row">
              <div className="m-left">
                {p.image_url ? <img src={p.image_url} alt="" className="m-thumb" /> : null}
                <div>
                  <h5 style={{ margin: 0 }}>{p.title || '(sem título)'}</h5>
                  <span className="color-gray" style={{ fontSize: 13 }}>
                    {p.category} · {fmtDate(p.date)} · {p.views || 0} visualizações
                  </span>
                </div>
              </div>
              <div className="m-actions">
                <Link to={`/posts/${p.id}`} className="btn-outline btn-sm">Ver</Link>
                <button type="button" className="btn-outline btn-sm" onClick={() => editPost(p)}>Editar</button>
                <button type="button" className="btn-danger btn-sm" onClick={() => handleDelete(p)}>Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProfilePosts;
