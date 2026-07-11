import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Context from 'pages/Context';
import supabase from 'services/supabase';
import Logo from '../../svg/icon-logo.svg'

const Header = () => {
  const { user, session, signOut } = useContext(Context);
  const [profile, setProfile] = useState({ name: '', image_profile: '' });
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('name, image_profile')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) { console.error("Erro ao buscar informações do usuário", error); return; }
          if (data) setProfile(data);
        });
    } else {
      setProfile({ name: '', image_profile: '' });
    }
  }, [user]);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao encerrar a sessão:', error);
    }
  };

  // Menu responsivo (hambúrguer)
  useEffect(() => {
    const bx = document.querySelector('.bx');
    const menuMobile = document.querySelector('.menu-mobile');
    if (!bx || !menuMobile) return;

    const handleClick = () => {
      bx.classList.toggle('activebx');
      menuMobile.classList.toggle('showmenu');
    };
    bx.addEventListener('click', handleClick);
    return () => bx.removeEventListener('click', handleClick);
  }, []);

  const userMenu = (
    <div className="user-menu" ref={menuRef}>
      <button type="button" className="user-menu-trigger" onClick={() => setOpen(!open)}>
        <img className="user-avatar" src={profile.image_profile} alt="" />
        <span className="user-name">{profile.name || 'Perfil'}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="user-dropdown">
          <Link to="/profile" onClick={() => setOpen(false)}>👤 &nbsp;Meu perfil</Link>
          <Link to="/profile/settings" onClick={() => setOpen(false)}>⚙️ &nbsp;Configurações</Link>
          <div className="dd-sep" />
          <button type="button" className="dd-danger" onClick={handleLogout}>↪ &nbsp;Sair</button>
        </div>
      )}
    </div>
  );

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
          {!session ? (
            <div className="cta-desktop ml-3">
              <Link to="/login" className="btn">Acessar</Link>
            </div>
          ) : (
            <div className="ml-3">{userMenu}</div>
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
            {!session ? (
              <li><Link to="/login" className="link-menu-mobile acess">Acessar</Link></li>
            ) : (
              <>
                <li><Link to="/profile" className="link-menu-mobile">Meu perfil</Link></li>
                <li><Link to="/profile/settings" className="link-menu-mobile">Configurações</Link></li>
                <li><button type="button" className="link-menu-mobile acess" onClick={handleLogout} style={{background:'none',border:0,width:'100%',textAlign:'left',cursor:'pointer'}}>Sair</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
