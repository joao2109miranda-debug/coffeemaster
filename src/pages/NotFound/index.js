
// Header e Footer
import Header from "pages/Header";
import Footer from "pages/Footer";

// Images
import Logo from '../../svg/icon-logo.svg';

// Link
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <>
        
            <Header />

            <section class="container-notfound">
                <div class="row flex-center">
                    <img src={Logo} class="icon-l" alt="" />
                </div>

                <div class="row">
                    <div class="grid-4 disappear"></div>
                    <div class="grid-4">

                        <h1 class="h0 text-center color-primary">404</h1>
                        <h5 class="text-center">Página não encontrada!</h5>
                        <p class="text-center mt-1">
                            A página que você tá procurando não existe 
                            ou foi removida. Clique para voltar 
                            para o site.
                        </p>

                        <Link to="/" class="btn w-100 mt-3">Voltar p/ home</Link>
                    </div>
                    <div class="grid-4 disappear"></div>
                </div>
            </section>

            <Footer />

        </>
    );
}

export default NotFound;