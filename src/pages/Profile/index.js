import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

import Context from '../../pages/Context';
import { useContext, useState, useEffect } from 'react';
import supabase from '../../services/supabase';

const Profile = () => {
  // Usuário autenticado (sessão do Supabase)
  const { user } = useContext(Context);

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

  // Dados do perfil para exibição
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [imgProfile, setImgProfile] = useState('');
  const [form, setForm] = useState(initialValuePost);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('name, surname, username, image_profile')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return;
      }
      if (data) {
        setName(data.name);
        setSurname(data.surname);
        setUsername(data.username);
        setImgProfile(data.image_profile);
      }
    };

    fetchUserData();
  }, [user]);

  function onChange(event) {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handlePost(ev) {
    ev.preventDefault();
    setError('');

    if (!user) {
      setError('Você precisa estar logado para publicar.');
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({ ...form, user_id: user.id })
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao adicionar o post:', error);
      setError('Não foi possível publicar o post. Tente novamente.');
      return;
    }

    navigate(`/posts/${data.id}`);
  }

  return (
    <>
      <Header />

      <section className="container-profile">
        <div className="row">
          <div className="grid-6">
            <div className="flex-start-row">
              <div className="profile-big">
                <img src={imgProfile} className="profile-img" alt="" />
              </div>
              <div className="ml-2">
                {name && surname && username ? (
                  <>
                    <h3 className="color-white">{name} {surname}</h3>
                    <h6 className="color-gray">@{username}</h6>
                  </>
                ) : (
                  <p>Carregando dados do usuário...</p>
                )}
              </div>
            </div>
            <p className="mt-3">
              Olá, bom dia! Seja bem-vindo ao blog. Compartilhe conhecimento.
            </p>
          </div>
        </div>
      </section>

      <section className="container">
        <form onSubmit={handlePost}>
          <h3>Adicionar novo post</h3>
          <p className="mt-2">Preencha os campos abaixo para adicionar um novo post ao blog.</p>
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
              <input type="text" name="image_url" id="image_url" value={form.image_url} onChange={onChange} />
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
          {error ? (
            <div className="card-danger p-2 mt-2">
              <h6 className="h7 color-red">{error}</h6>
            </div>
          ) : null}
          <div className="flex-end-row mr-2 mt-2">
            <button type="submit" className="btn">Adicionar</button>
          </div>
        </form>
      </section>

      <Footer />
    </>
  );
}

export default Profile;
