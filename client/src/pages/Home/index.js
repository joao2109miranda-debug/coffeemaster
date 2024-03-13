// Header e Footer
import Header from '../Header'
import Footer from '../Footer'

// Components
import Hero from './Hero';
import Card from './Card';

// API
import api from '../../services/api';

// Images
import Maintenance from '../../svg/icon-maintenance.svg'
import Locationn from '../../svg/icon-loc.svg'
import Sell from '../../svg/icon-sell.svg' 

// Hooks
import { useState, useEffect } from 'react';

// Link
import { Link } from 'react-router-dom';


const Home = () => {
    
     // State variables
     const [card, setCard] = useState([]);

     // Faça isso quando o componente montar
     useEffect(() => {
 
         //Requisição para card
         api.get('/posts?_sort=-date&_limit=3')
         .then((response) => {
             setCard(response.data);
         })
 
     }, [])


    return (
        <>

            <Header />


            <Hero/>

            <div className="bg-section">
                <div className="container-prod">
                    <img src="svg/icon-coffee.svg" className="prod-img ml-2" alt=""/><h3 className="ml-2">Produtos</h3>
                </div>
            
                <section className="container">
                    <div className="row">
                        <div className="grid-6 br-pd">
                            <div className="products-box">
                                <div className="products-name">
                                    <a href="" className="link-title">
                                        <h5>ITALIAN COFFEE CIMBALI M24 SELECT</h5>
                                    </a>
                                    <h6>Disponível para locação e venda</h6>
                                    <div className="spacing-btn">
                                        <a href="" className="btn-prod">Consultar</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid-6">
                            <div className="products-box">
                                <div className="products-name">
                                    <a href="" className="link-title">
                                        <h5>ITALIAN COFFEE ELITE</h5>
                                    </a>
                                    <h6>Disponível para locação e venda</h6>
                                    <div className="spacing-btn">
                                        <a href="" className="btn-prod">Consultar</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid-6">
                            <div className="products-box">
                                <div className="products-name">
                                    <a href="" className="link-title">
                                        <h5>JURA IMPRESSA XF50</h5>
                                    </a>
                                    <h6>Disponível para locação</h6>
                                    <div className="spacing-btn">
                                        <a href="" className="btn-prod">Consultar</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid-6">
                            <div className="products-box">
                                <div className="products-name">
                                    <a href="" className="link-title">
                                        <h5>JURA IMPRESSA XS90 OTC</h5>
                                    </a>
                                    <h6>Disponível para venda</h6>
                                    <div className="spacing-btn">
                                        <a href="" className="btn-prod">Consultar</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="more-products">
                        <a href="" className="link">Veja mais produtos</a>
                    </div>

                </section>
            </div>



            <div className="container-svc">
                <img src="svg/icon-layers.svg" className="svc-img ml-2" alt=""/><h3 className="ml-2">Serviços</h3>    
            </div>
            <section className="container-svc-main flex-center">
                <div className="row-svc flex-center">
                    <div className="grid-4-svc flex-center-column">
                            <img src={Sell} className="svc-main-img mb-4" alt=""/>
                            <h4 className="align-items-center">Venda</h4>
                            <h6 className="svc-desc">Oferecemos uma seleção das
                                melhores e mais reconhecidas
                                marcas de equipamentos do
                                mercado de cafés e cafeterias. </h6>
                    </div>
                </div>
                
                <div className="row-svc row-svc-second flex-center">
                    <div className="grid-4-svc flex-center-column">
                            <img src={Locationn} className="svc-main-img mb-4" alt=""/>
                            <h4 className="align-items-center">Locação</h4>
                            <h6 className="svc-desc">Soluções que atendem às suas necessidades empresariais.
                                Contamos com equipamentos modernos e bem-mantidos.</h6>
                    </div>
                </div>

                <div className="row-svc row-svc-second flex-center">
                    <div className="grid-4-svc flex-center-column">
                            <img src={Maintenance} className="svc-main-img mb-4" alt=""/>
                            <h4 className="align-items-center">Manutenção</h4>
                            <h6 className="svc-desc">
                                Fornecemos soluções para garantir o desempenho operacional ininterrupto de seus equipamentos.</h6>
                    </div>
                </div>
            </section>

            <div className="container flex-center">
                <div>
                    <Link to="/contact" className="btn">Contratar</Link>
                </div>
            </div>



            <div className="bg-section">
                <section className="container">
                    <div className="container-about">
                        <img src="svg/icon-blog.svg" className="about-img ml-2" alt=""></img><h3 className="ml-2">Blog</h3>    
                    </div>
                    <div className="row">

                        {
                            
                        card.map(function(item) {
                            return <Card key={item.id} content={item} />;
                        })
                        
                        }
                        
            
                    </div>

                    <div className="container flex-center">
                        <div>
                            <Link to="/allposts" className="btn">Explorar mais artigos</Link>
                        </div>
                    </div>
                </section>
            </div>


            <Footer />

        </>
    );
}

export default Home;