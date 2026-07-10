import '@fortawesome/fontawesome-free/css/all.min.css';

// Hero/index.js
import React from 'react';
import Carousel from './Carousel';
import image01 from "../../../img/gradient-01.jpg";
import image02 from "../../../img/gradient-03.jpg";
import image03 from "../../../img/gradient-04.jpg";

const Hero = () => {
  const carouselImages = [image01, image02, image03];

  return (
    <>
      <a href="" target="_blank" className="whatsapp-link">
        <i className="fab fa-whatsapp mt-1"></i>
      </a>

      <section className="container-hero flex-center">
        <Carousel images={carouselImages} />
      </section>
    </>
  );
};

export default Hero;
