// Header e Footer
import Header from '../Header'
import Footer from '../Footer'

// Components
import Hero from './Hero';
import Card from './Card';

// Supabase
import supabase from '../../services/supabase';

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
     const [featuredPost, setFeaturedPost] = useState(null);
     const [recentPosts, setRecentPosts] = useState([]);

     // Faça isso quando o componente montar
     useEffect(() => {
         const loadBlog = async () => {
             const postFields = '*, profiles(name, surname, username, image_profile)';
             const { data: featured, error: featuredError } = await supabase
                 .from('posts')
                 .select(postFields)
                 .eq('is_featured', true)
                 .maybeSingle();

             if (featuredError) {
                 console.error('Erro ao buscar post em destaque:', featuredError);
                 return;
             }

             let recentQuery = supabase
                 .from('posts')
                 .select(postFields)
                 .order('date', { ascending: false })
                 .order('created_at', { ascending: false })
                 .limit(featured ? 3 : 4);
             if (featured) recentQuery = recentQuery.neq('id', featured.id);

             const { data: recent, error: recentError } = await recentQuery;
             if (recentError) {
                 console.error('Erro ao buscar posts recentes:', recentError);
                 return;
             }

             setFeaturedPost(featured || recent[0] || null);
             setRecentPosts(featured ? (recent || []) : (recent || []).slice(1));
         };
         loadBlog();
     }, [])


    return (
        <>

            <Header />


            <Hero/>

            <div className="bg-section">
                <div className="container-prod">
                    <img src="/icons/products.png" className="section-title-icon" alt=""/><h3 className="ml-2">Produtos</h3>
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



            <section className="services-fullscreen">
            <div className="container-svc">
                <img src="/icons/grid.png" className="section-title-icon" alt=""/><h3 className="ml-2">Serviços</h3>
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
            </section>



            <div className="bg-section">
                <div className="container-about blog-section-heading">
                    <img src="/icons/hash.png" className="section-title-icon" alt=""/><h3 className="ml-2">Blog</h3>
                </div>
                <section className="container blog-home-section">
                    {featuredPost ? (
                        <>
                            <h6 className="blog-featured-label">POST EM DESTAQUE</h6>
                            <Card content={featuredPost} variant="featured" />
                        </>
                    ) : null}
                    {recentPosts.length > 0 ? (
                        <div className="blog-recent-section">
                            <h4 className="mb-2">Mais recentes</h4>
                            <div className="blog-post-grid">
                                {recentPosts.map((item) => <Card key={item.id} content={item} variant="grid" />)}
                            </div>
                        </div>
                    ) : null}

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
