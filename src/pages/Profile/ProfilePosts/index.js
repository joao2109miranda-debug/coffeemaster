import { useNavigate, Link } from 'react-router-dom';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import Context from 'pages/Context';
import { useContext, useState } from 'react';
import supabase from 'services/supabase';

const initialValuePost = {
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
  const [form, setForm] = useState(initialValuePost);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handlePost = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!user) {
      setError('Você precisa estar logado para publicar.');
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from('posts')
      .insert({ ...form, user_id: user.id })
      .select('id')
      .single();
    setSaving(false);

    if (error) {
      console.error('Erro ao adicionar o post:', error);
      setError('Não foi possível publicar o post. Tente novamente.');
      return;
    }
    navigate(`/posts/${data.id}`);
  };

  return (
    <>
      <Header />

      <div className="page-wrap">
        <div className="page-head flex-space" style={{ alignItems: "center" }}>
          <div>
            <h6 className="uppercase color-primary">GERENCIAR POSTS</h6>
            <h3>Adicionar novo post</h3>
          </div>
          <Link to="/profile" className="link">← Voltar ao perfil</Link>
        </div>

        <form onSubmit={handlePost} className="admin-form">
          <p className="mt-1 mb-2">Preencha os campos abaixo para adicionar um novo post ao blog.</p>
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
          <div className="flex-end-row mr-2 mt-3">
            <button type="submit" className="btn" disabled={saving}>{saving ? "Publicando..." : "Adicionar"}</button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default ProfilePosts;
