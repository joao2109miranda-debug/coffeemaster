import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { useState } from 'react';
import supabase from '../../services/supabase';
import BlogLogo from '../../svg/icon-logo.svg';

const initialState = {
  email: '',
  password: ''
};


const Login = () => {
  const [form, setForm] = useState(initialState);
  const [danger, setDanger] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setDanger('');
    setSuccess('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setDanger('E-mail ou senha incorretos! Tente novamente.');
      return;
    }

    setSuccess('Login feito com sucesso! Aguarde...');
    navigate('/profile');
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
                <label htmlFor="email" className="mb-2"><h6>E-mail</h6> </label>
                <input type="email" id="email" name="email" className="mt-1" onChange={onChange} placeholder="Digite seu e-mail" value={form.email} />
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
              <button className="btn w-100 mt-5" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
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
