
// Header e Footer
import Header from "pages/Header";
import Footer from "pages/Footer";

import bannerAbout from '../../img/img-about-banner.png'
import person from '../../svg/person.svg'

const About = () => {
    return (
        <>
                <Header />

                <div className="page-wrap about-page-head">
                    <div className="page-head"><h6 className="uppercase color-primary">SOBRE</h6><h3>Sobre nós</h3></div>
                </div>

                <section className="container">
                    <div className="banner-about">
                        <div className="img-banner-about">
                            <img className="img-banner-about-className" src={bannerAbout} alt=""/>
                        </div>
                    </div>
                </section>

                <section className="container-about-2">
                    <div className="banner-about-2">
                        <div className="grid-3 about-grid flex-center">
                            <img src={person} className="about-person" alt="" />
                            <h5 className="about-name">Emily Grace</h5>
                            <h6 className="about-desc">
                                Amante de tecnologia e
                                entusiasta de esportes.</h6>
                        </div>
                
                        <div className="grid-7 about-story about-grid flex-center">
                            <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Sed hendrerit condimentum orci non tristique. 
                            Proin a massa at diam fermentum fringilla a eu purus.
                            Duis hendrerit sed lectus mattis pretium.</h6>
                            <br></br>
                            <h6>Curabitur ut augue elit. Praesent in quam commodo, tincidunt lacus eu, faucibus enim.
                            Morbi ultrices ex at iaculis ultrices. Cras luctus elit eu tempus fermentum.
                            Morbi eu vestibulum dui. Maecenas volutpat luctus turpis, vel rhoncus orci consectetur a.
                            Aliquam nec molestie nisl, faucibus tristique leo.</h6>
                        </div>
                    </div>
                </section>

            <Footer />

        </>
    );
}

export default About;
