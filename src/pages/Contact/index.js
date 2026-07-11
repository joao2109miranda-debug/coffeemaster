
import Header from '../Header';
import Footer from '../Footer';

import IconFacebook from '../../svg/icon-facebook.svg';
import IconInstagram from '../../svg/icon-instagram.svg';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from 'config';

const Contact = () => {

  function onSubmit(event){
    event.preventDefault();
  }

  return (
    <>
      <Header />
      <section className="page-wrap contact-page-head">
        <div className="page-head"><h6 className="uppercase color-primary">CONTATO</h6><h3>Entre em contato</h3></div>
      </section>
      <section className="container-contact">
          <div className="row">
            <div className="grid-6">
              <p>
                Informe na mensagem com o maior detalhamento possível o serviço sobre o qual deseja falar.
              </p>
              <form onSubmit={onSubmit}>
                <input type="text" name="name" className="mt-2" placeholder="Nome" />
                <input type="email" name="email" className="mt-2"placeholder="E-mail" />
                <textarea name="content" rows="8" className="mt-2"placeholder="Mensagem"></textarea>
                <button className="btn mt-2">Enviar</button>
              </form>
            </div>
            <div className="grid-1 disappear"></div>
            <div className="grid-5">
              <h5 className="mt-4">Outros</h5>

              <h6 className="color-primary mt-4">Info.</h6>
              <p>Equipamentos para cafés especiais: máquinas de café espresso profissionais WEGA, automática (Jura) e equipamentos Bunn. Contato: Fabiano Freire</p>

              <h6 className="color-primary mt-4">E-mail</h6>
              <p><a href="mailto:contato@coffeemaster.com.br" className="contact-external">contato@coffeemaster.com.br <span aria-hidden="true">↗</span></a></p>

              <h6 className="color-primary mt-4">WhatsApp</h6>
              <p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="contact-external">
                  {WHATSAPP_DISPLAY} <span aria-hidden="true">↗</span>
                </a>
              </p>

              <h6 className="color-primary mt-4">Redes sociais</h6>
              <div className="mt-2">
                <a href="https://www.instagram.com/coffeemaster_minas_gerais"><img src={IconInstagram} className="icon-s" alt="" /></a>
                <img src={IconFacebook} className="icon-s ml-2" alt="" />
                  </div>
            </div>
          </div>
      </section>
      <Footer />
    </>
  );
}
  
export default Contact;
