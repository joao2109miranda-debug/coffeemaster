import Logo from '../../svg/icon-logo.svg'
import { useEffect, useState } from 'react';
import supabase from 'services/supabase';

// Link
import { Link } from 'react-router-dom';


const Footer = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        supabase
            .from('products')
            .select('id, name')
            .order('created_at', { ascending: false })
            .limit(4)
            .then(({ data, error }) => {
                if (error) { console.error('Erro ao buscar produtos do rodapé:', error); return; }
                setProducts(data || []);
            });
    }, []);

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
                                <Link to="/contact" className="color-gray link-footer">contato@coffeemaster.com.br</Link>
                                <Link to="/contact" className="color-gray link-footer">Canal de Suporte</Link>
                            </div>
                            
                        </div>

                        <div className="grid-3">
                            <h4>Produtos</h4>
                            <div className="flex-start-column mt-2">
                                {products.map((product) => (
                                    <Link key={product.id} to="/products" className="color-gray link-footer">{product.name}</Link>
                                ))}
                            </div>
                        </div>

                        <div className="grid-6">
                            <h4 className="mb-2">Quer ser avisado dos novos posts do blog?</h4>
                            <p>
                                Cadastre seu e-mail para receber novidades, notícias e artigos sobre o mundo do café!
                            </p>
                            <div className="flex-start-row mt-2 footer-subscribe">
                                <input type="text" name="search" id="" placeholder="Digite seu e-mail aqui" />
                                <Link to="/" className="btn ml-2 btn-click">Cadastrar</Link>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="grid-9 footer-legal">
                            <p>2026 | Todos os direitos reservados. Projeto desenvolvido por <a href="https://w.app/digiconnecta" target="_blank" rel="noopener noreferrer">Digiconnecta.</a> </p>
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
