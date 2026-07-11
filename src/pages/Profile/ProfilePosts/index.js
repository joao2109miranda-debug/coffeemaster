import { Link } from 'react-router-dom';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import Context from 'pages/Context';
import { useContext, useState, useEffect, useCallback } from 'react';
import supabase from 'services/supabase';
import RichTextEditor from 'components/RichTextEditor';
import { sanitizeHtml } from 'utils/sanitize';

const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const emptyForm = {
  id: null,
  date: '',
  image_url: '',
  category: '',
  title: '',
  resume: '',
  content: '',
  duration: '5',
  views: 10,
  status: 1,
};

const ProfilePosts = () => {
  const { user } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('is_admin').eq('id', user.id).single()
      .then(({ data, error: profileError }) => {
        if (profileError) console.error(profileError);
        setIsAdmin(Boolean(data?.is_admin));
      });
  }, [user]);

  const loadCategories = useCallback(async () => {
    const { data, error: categoryError } = await supabase
      .from('post_categories')
      .select('id, name')
      .order('name');
    if (categoryError) console.error(categoryError);
    else setCategories(data || []);
  }, []);

  const load = useCallback(async () => {
    if (!user) return;
    let query = supabase
      .from('posts')
      .select('id, user_id, title, slug, category, category_id, date, image_url, resume, views, created_at, is_featured, profiles(name, surname, username)')
      .order('created_at', { ascending: false });
    if (!isAdmin) query = query.eq('user_id', user.id);
    const { data, error: postsError } = await query;
    if (postsError) console.error(postsError);
    else setPosts(data || []);
  }, [user, isAdmin]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { load(); }, [load]);

  const onChange = (event) => {
    const { value, name } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => { setForm(emptyForm); setFile(null); };

  const uploadImage = async () => {
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('post-images').upload(path, file, { upsert: true });
    if (upErr) throw upErr;
    return supabase.storage.from('post-images').getPublicUrl(path).data.publicUrl;
  };

  const ensureUniqueSlug = async (base) => {
    const root = base || 'post';
    for (let n = 1; n <= 50; n++) {
      const candidate = n === 1 ? root : `${root}-${n}`;
      // eslint-disable-next-line no-await-in-loop
      const { data } = await supabase.from('posts').select('id').eq('slug', candidate).limit(1);
      if (!data || data.length === 0) return candidate;
    }
    return `${root}-${Date.now()}`;
  };

  const editPost = async (post) => {
    const { data, error: postError } = await supabase.from('posts').select('*').eq('id', post.id).single();
    if (postError) { console.error(postError); return; }
    setForm({
      id: data.id,
      date: data.date || '',
      image_url: data.image_url || '',
      category: data.category || '',
      title: data.title || '',
      resume: data.resume || '',
      content: data.content || '',
      duration: data.duration || '5',
      views: data.views || 10,
      status: data.status ?? 1,
    });
    setFile(null);
    setMsg('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resolveCategory = async () => {
    const name = form.category.trim();
    if (!name) throw new Error('A categoria é obrigatória.');
    const existing = categories.find((category) => category.name.toLocaleLowerCase() === name.toLocaleLowerCase());
    if (existing) return existing;
    if (!isAdmin) throw new Error('Selecione uma categoria já cadastrada.');

    const { data, error: categoryError } = await supabase
      .from('post_categories')
      .insert({ name })
      .select('id, name')
      .single();
    if (categoryError) throw categoryError;
    setCategories((current) => [...current, data].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')));
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMsg('');
    if (!user) { setError('Você precisa estar logado.'); return; }
    if (!form.title.trim()) { setError('O título é obrigatório.'); return; }

    setSaving(true);
    try {
      const category = await resolveCategory();
      const imageUrl = file ? await uploadImage() : form.image_url;
      const payload = {
        date: form.date || null,
        image_url: imageUrl,
        category: category.name,
        category_id: category.id,
        title: form.title.trim(),
        resume: form.resume,
        content: sanitizeHtml(form.content),
        duration: form.duration,
        views: Number(form.views) || 0,
        status: Number(form.status) || 1,
      };

      let resultError;
      if (form.id) {
        // Mantém o slug estável ao editar (não quebra links existentes)
        ({ error: resultError } = await supabase.from('posts').update(payload).eq('id', form.id));
      } else {
        const slug = await ensureUniqueSlug(slugify(form.title));
        ({ error: resultError } = await supabase.from('posts').insert({ ...payload, user_id: user.id, slug }));
      }
      if (resultError) throw resultError;

      setMsg(form.id ? 'Post atualizado!' : 'Post publicado!');
      resetForm();
      load();
    } catch (saveError) {
      console.error(saveError);
      setError(`Não foi possível salvar o post. ${saveError.message || ''}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm(`Excluir o post "${post.title}"?`)) return;
    const { error: deleteError } = await supabase.from('posts').delete().eq('id', post.id);
    if (deleteError) { setError('Não foi possível excluir o post.'); return; }
    if (form.id === post.id) resetForm();
    load();
  };

  const setFeatured = async (post) => {
    if (post.is_featured) return;
    setError('');
    const { error: featuredError } = await supabase.rpc('set_featured_post', { p_post_id: post.id });
    if (featuredError) { setError(`Não foi possível definir o destaque. ${featuredError.message || ''}`); return; }
    setMsg(`"${post.title}" é o post em destaque.`);
    load();
  };

  const fmtDate = (value) => { try { return new Date(value).toLocaleDateString('pt-BR'); } catch { return value; } };
  const authorName = (post) => [post.profiles?.name, post.profiles?.surname].filter(Boolean).join(' ') || post.profiles?.username;

  return (
    <>
      <Header />
      <div className="page-wrap">
        <div className="page-head flex-space">
          <div>
            <h6 className="uppercase color-primary">GERENCIAR POSTS</h6>
            <h3>{form.id ? 'Editar post' : 'Novo post'}</h3>
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
              <input id="category" name="category" list="post-categories" value={form.category} onChange={onChange} placeholder={isAdmin ? 'Digite ou selecione' : 'Selecione uma categoria'} required />
              <datalist id="post-categories">{categories.map((category) => <option key={category.id} value={category.name} />)}</datalist>
            </div>
            <div className="grid-6 p-0">
              <label htmlFor="title"><h6 className="mb-1">Título</h6></label>
              <input type="text" name="title" id="title" value={form.title} onChange={onChange} required />
            </div>
          </div>
          <div className="row p-0"><div className="grid-12 p-0">
            <label htmlFor="resume"><h6 className="mb-1">Resumo do post</h6></label>
            <input type="text" name="resume" id="resume" value={form.resume} onChange={onChange} />
          </div></div>
          <div className="row p-0">
            <div className="grid-4 p-0">
              <h6 className="mb-1">Anexar imagem</h6>
              <div className="file-field">
                <label className="file-btn" htmlFor="post-file"><span>📎 Escolher arquivo</span></label>
                <input type="file" id="post-file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
                <span className="file-name">{file ? file.name : 'Nenhum arquivo escolhido'}</span>
              </div>
            </div>
            <div className="grid-4 p-0">
              <label htmlFor="image_url"><h6 className="mb-1">...ou colar URL</h6></label>
              <input type="text" name="image_url" id="image_url" value={form.image_url} onChange={onChange} placeholder="https://..." />
            </div>
            <div className="grid-4 p-0">
              <label htmlFor="duration"><h6 className="mb-1">Duração de leitura</h6></label>
              <select name="duration" id="duration" value={form.duration} onChange={onChange}>
                <option value="5">5 min.</option><option value="7">7 min.</option><option value="10">10 min.</option><option value="15">15 min.</option>
              </select>
            </div>
          </div>
          <div className="row p-0"><div className="grid-12 p-0">
            <h6 className="mb-1">Conteúdo</h6>
            <RichTextEditor value={form.content} onChange={(html) => setForm((c) => ({ ...c, content: html }))} placeholder="Escreva o conteúdo do post..." />
          </div></div>

          {error ? <div className="card-danger p-2 mt-2"><h6 className="h7 color-red">{error}</h6></div> : null}
          {msg ? <div className="card-success p-2 mt-2"><h6 className="h7 color-green">{msg}</h6></div> : null}
          <div className="flex-end-row mt-3" style={{ alignItems: 'center', gap: '16px' }}>
            {form.id ? <button type="button" className="link-btn" onClick={resetForm} style={{ color: '#999a9b' }}>Cancelar edição</button> : null}
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Salvando...' : form.id ? 'Salvar alterações' : 'Publicar'}</button>
          </div>
        </form>

        <h3 className="mb-2 mt-4">{isAdmin ? 'Todos os posts' : 'Meus posts'} ({posts.length})</h3>
        {posts.length === 0 ? <p>Nenhum post encontrado.</p> : posts.map((post) => (
          <div key={post.id} className="manage-row">
            <div className="m-left">
              {post.image_url ? <img src={post.image_url} alt="" className="m-thumb" /> : null}
              <div>
                <h5 style={{ margin: 0 }}>{post.title || '(sem título)'}</h5>
                <span className="color-gray" style={{ fontSize: 13 }}>{post.category} · {fmtDate(post.date)} · {post.views || 0} visualizações{isAdmin && authorName(post) ? ` · ${authorName(post)}` : ''}</span>
              </div>
            </div>
            <div className="m-actions">
              {isAdmin ? <button type="button" className={`featured-toggle ${post.is_featured ? 'active' : ''}`} onClick={() => setFeatured(post)} title={post.is_featured ? 'Post em destaque' : 'Definir como destaque'} aria-label={post.is_featured ? 'Post em destaque' : 'Definir como destaque'}>★</button> : null}
              <Link to={`/posts/${post.slug || post.id}`} className="btn-outline btn-sm">Ver</Link>
              <button type="button" className="btn-outline btn-sm" onClick={() => editPost(post)}>Editar</button>
              <button type="button" className="btn-danger btn-sm" onClick={() => handleDelete(post)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePosts;
