import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

import Context from '../../pages/Context';
import { useContext, useState, useEffect } from 'react';
import api from '../../services/api';

const Profile = () => {
  // Importar o contexto e puxar os dados da API
  const { token, idUser } = useContext(Context);

  const initialValuePost = {
    id_user: idUser,
    date: "",
    imageUrl: "",
    category: "tecnologia",
    title: "",
    resume: "",
    content: "",
    duration: "5",
    star: "4",
    views: "10",
    status: true,
  }

  // Variáveis de estado
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [user, setUser] = useState('');
  const [img_profile, setImgProfile] = useState('');
  const [form, setForm] = useState(initialValuePost);

  // Utilizar useNavigate para acessar a função de navegação
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && idUser) {
        try {
          const response = await api.get(`/users/${idUser}`);
          if (response.data) {
            const userData = response.data;
            setName(userData.name);
            setSurname(userData.surname);
            setUser(userData.user);
            setImgProfile(userData.image_profile);
          } else {
            console.log('Nenhum usuário encontrado ou resposta da API vazia');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
    };
  
    fetchUserData();
  }, []);

  function onChange(event){
    // Desestruturação do nome e valor da propriedade do campo
    const { value, name } = event.target;

    // Pega o valor antigo e adiciona o novo que veio
    setForm({ ...form, [name]: value});
  }

  // Função para cadastrar um novo post
  function handlePost(ev){
    ev.preventDefault();

    api.post('/posts/', form)
    .then((response) => {
      if(response.status === 201 && response.statusText === "Created"){
        // Utilize navigate para navegar para a nova rota
        navigate(`/posts/${response.data.id}`);
      }

      console.log(response);
    })
    .catch((error) => {
      console.error('Erro ao adicionar o post:', error);
    });
  }

  return (
    <>
      <Header />

      <section className="container-profile">
        <div className="row">
          <div className="grid-6">
            <div className="flex-start-row">
              <div className="profile-big">
                <img src={img_profile} className="profile-img" alt="" />
              </div>
              <div className="ml-2">
                {name && surname && user ? (
                  <>
                    <h3 className="color-white">{name} {surname}</h3>
                    <h6 className="color-gray">@{user}</h6>
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
              <input type="date" name="date" id="date" onChange={onChange} />
            </div>
            <div className="grid-3 p-0">
              <label htmlFor="category"><h6 className="mb-1">Categoria</h6></label>
              <select name="category" id="category" onChange={onChange}>
                <option value="tecnologia" selected>Tecnologia</option>
                <option value="games">Games</option>
                <option value="fotografia">Fotografia</option>
                <option value="cinema">Cinema</option>
              </select>
            </div>
            <div className="grid-6 p-0">
              <label htmlFor="title"><h6 className="mb-1">Título</h6></label>
              <input type="text" name="title" id="title" onChange={onChange} />
            </div>
          </div>
          <div className="row p-0">
            <div className="grid-12 p-0">
              <label htmlFor="resume"><h6 className="mb-1">Resumo do post</h6></label>
              <input type="text" name="resume" id="resume" onChange={onChange} />
            </div>
          </div>
          <div className="row p-0">
            <div className="grid-8 p-0">
              <label htmlFor="imageUrl"><h6 className="mb-1">URL da imagem</h6></label>
              <input type="text" name="imageUrl" id="imageUrl" onChange={onChange} />
            </div>
            <div className="grid-4 p-0">
              <label htmlFor="duration"><h6 className="mb-1">Duração de leitura</h6></label>
              <select name="duration" id="duration" onChange={onChange}>
                <option value="5" selected>5 min.</option>
                <option value="7">7 min.</option>
                <option value="10">10 min.</option>
                <option value="15">15 min.</option>
              </select>
            </div>
          </div>
          <div className="row p-0">
            <div className="grid-12 p-0">
              <label htmlFor="content"><h6 className="mb-1">Conteúdo</h6></label>
              <textarea name="content" id="content" rows="8" onChange={onChange}></textarea>
            </div>
          </div>
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
