import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { useState, useContext } from 'react';
import api from '../../services/api';
import Context from 'pages/Context';
import BlogLogo from '../../svg/icon-logo.svg';

const initialState = {
  user: '',
  password: ''
};


const Login = () => {
  const [form, setForm] = useState(initialState);
  const [danger, setDanger] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setToken, setIdUser } = useContext(Context);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      console.log("Enviando requisição de login para o servidor...");

      const response = await api.post('/login', {
        user: form.user,
        password: form.password,

      });

      console.log("Resposta do servidor recebida:", response);

      if (response.status >= 200 && response.status < 300) {
        if (response.data.token) {
          setDanger('');
          setSuccess('Login feito com sucesso! Aguarde...');
          setToken(response.data.token);
          setIdUser(response.data.id);
          sessionStorage.setItem('token', response.data.token);
          navigate('/profile');
        } else {
          setDanger('Credenciais inválidas!');
        }
      } else {
        const errorMessage = getErrorMessage(response);
        console.error(`Erro na requisição: ${response.status} - ${errorMessage}`);
        setDanger('Usuário ou senha incorretos! Tente novamente!');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Erro durante o login:', errorMessage);
      setDanger('Erro ao fazer o login.');
    }
  };

  const getErrorMessage = (error) => {
    if (error.response) {
      if (error.response.data && error.response.data.error) {
        return error.response.data.error;
      }
      return error.response.data;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Unknown error occurred';
    }
  };

  const onChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      <Header />
      <section className="container-login">
        <div className="row flex-center">
          <img src={BlogLogo} className="icon-l" alt="" />
        </div>
        <div className="row">
          <div className="grid-3 disappear"></div>
          <div className="grid-6">
            <form onSubmit={handleLogin}>
              <h5 className="text-center">
                Olá, faça o login para continuar.
              </h5>
              <div className="mt-4">
                <label htmlFor="user" className="mb-2"><h6>Nome de usuário </h6> </label>
                <input type="text" id="user" name="user" className="mt-1" onChange={onChange} placeholder="Digite seu usuário" value={form.user} />
              </div>
              <div className="mt-3">
                <label htmlFor="password" ><h6>Senha</h6></label>
                <input type="password" id="password" name="password" className="mt-1" onChange={onChange} placeholder="Digite sua senha" value={form.password} />
              </div>
              {danger ? (
                <div className="card-danger p-2 mt-3">
                  <h6 className="h7 color-red">{danger}</h6>
                </div>
              ) : null}
              {success ? (
                <div className="card-success p-2 mt-3">
                  <h6 className="h7 color-green">{success}</h6>
                </div>
              ) : null}
              <button className="btn w-100 mt-5">Entrar</button>
            </form>
          </div>
          <div className="grid-3 disappear"></div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
