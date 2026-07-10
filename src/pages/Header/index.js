import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Context from 'pages/Context';
import supabase from 'services/supabase';
import Logo from '../../svg/icon-logo.svg'

const Header = () => {
  const { user } = useContext(Context);
  const [nameUser, setNameUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Erro ao buscar informações do usuário', error);
            return;
          }
          if (data) setNameUser(data.name);
        });
    } else {
      setNameUser('');
    }
  }, [user]);

  const handleLogout = async (event) => {
    event.preventDefault();
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    const bx = document.querySelector('.bx');
    const menuMobile = document.querySelector('.menu-mobile');

    const handleClick = () => {
      bx.classList.toggle('activebx');
      menuMobile.classList.toggle('showmenu');
    };

    bx.addEventListener('click', handleClick);

    return () => {
      bx.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <header className="py-1 px-2">
        <nav>
          <div className="logo">
            <Link to="/"><img src={Logo} alt="Logo" /></Link>
          </div>
          <ul className="menu">
            <li><Link to="/about" className="p-1">Sobre</Link></li>
            <li><Link to="/products" className="p-1">Produtos</Link></li>
            <li><Link to="/allposts" className="p-1">Blog</Link></li>
            <li><Link to="/contact" className="p-1">Contato</Link></li>
          </ul>
        </nav>
        <div className="flex-start-row">
          <div className="bx"></div>
          {!user ? (
            <>
              <div className="cta-desktop ml-3">
                <Link to="/login" className="btn">Acessar</Link>
              </div>
            </>
          ) : (
            <>
              <div className="cta-desktop ml-3">
                <Link to="/profile" className="link">{nameUser}</Link>
                <span> &nbsp; | &nbsp;</span>
                <a href="#" onClick={handleLogout} className="link">Sair</a>
              </div>
              <div className="cta-mobile mr-1">
                <Link to="/profile" className="link acesso">{nameUser}</Link>
                <span> &nbsp; | &nbsp;</span>
                <a href="#" onClick={handleLogout} className="link">Sair</a>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="relative">
        <div className="menu-mobile">
          <ul className="nav-mobile">
            <li><Link to="/about" className="link-menu-mobile">Sobre</Link></li>
            <li><Link to="/products" className="link-menu-mobile">Produtos</Link></li>
            <li><Link to="/allposts" className="link-menu-mobile">Blog</Link></li>
            <li><Link to="/contact" className="link-menu-mobile">Contato</Link></li>
            <li><Link to="/login" className="link-menu-mobile acess">Acessar</Link></li>

          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
