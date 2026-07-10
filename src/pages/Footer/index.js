import Logo from '../../svg/icon-logo.svg'

// Link
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <>
            <footer className="bg-section bt-black">
                <section className="container pb-0 ">
                    <div className="row flex-center">
                        <Link to="/"><img src={Logo} className="icon-l" alt="" /></Link>
                    </div>

                    <div className="row pb-3 bb-black">
                        <div className="grid-3">
                            <h4>Fale conosco</h4>
                            <div className="flex-start-column mt-2">
                                <Link to="/contact" className="color-gray link-footer">email@email.com.br</Link>
                                <Link to="/contact" className="color-gray link-footer">Canal de Suporte</Link>
                            </div>
                            
                        </div>

                        <div className="grid-3">
                            <h4>Produtos</h4>
                            <div className="flex-start-column mt-2">
                                <Link to="/products" className="color-gray link-footer">Astoria</Link>
                                <Link to="/products" className="color-gray link-footer">JURA</Link>
                                <Link to="/products" className="color-gray link-footer">Bunn</Link>
                            </div>
                        </div>

                        <div className="grid-6">
                            <h4 className="mb-2">Quer ser avisado dos novos posts do blog?</h4>
                            <p>
                                Cadastre seu e-mail para receber novidades, notícias e artigos sobre o mundo do café!
                            </p>
                            <div className="flex-start-row mt-2">
                                <input type="text" name="search" id="" placeholder="Digite seu e-mail aqui" />
                                <Link to="/"><button className="btn ml-2 btn-click">Cadastrar</button></Link>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="grid-9">
                            <p>2024 | Todos os direitos reservados. Projeto desenvolvido por <a href="https://w.app/digiconnecta" target="_blank">Digiconnecta.</a> </p>
                        </div>

                        <div className="grid-3">
                            <img src="svg/icon-facebook.svg" className="icon-s" alt="" />
                            <img src="svg/icon-instagram.svg" className="icon-s ml-2" alt="" />
                            <img src="svg/icon-twitter.svg" className="icon-s ml-2" alt="" />
                        </div>
                    </div>

                </section>
            </footer>
        </>
    );
}

export default Footer