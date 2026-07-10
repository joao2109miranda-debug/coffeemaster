// Carousel/index.js
import React, { useEffect, useState } from 'react';

// Link
import { Link } from 'react-router-dom';

const Carousel = ({ images }) => {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.innerWidth > 960) {
        setContador((prevContador) => (prevContador + 1) % images.length);
      }
    }, 7000);

    return () => clearInterval(intervalId);
  }, [images]);

  useEffect(() => {
    const box = document.querySelector(".carr-container");

    box.classList.add('fade-out');

    setTimeout(() => {
      // Atualiza a imagem
      box.style.transform = `translateX(${-contador * 1216}px)`;

      // Remove a classe 'fade-out' após um pequeno intervalo
      setTimeout(() => {
        box.classList.remove('fade-out');
      }, 500);
    }, 500);
  }, [contador]);

  return (
    <div className="grid-12 flex-center">
      <div className="carrousel">
        <div className="carr-container">
          <div className="overlay"></div>
          {images.map((image, index) => (
            <img key={index} src={image} className="img-hero pagelimit" alt={`Carousel Image ${index + 1}`} />
          ))}
        </div>
      </div>

      <h1 className="h0-hero">CoffeeMaster</h1>
      <p className="p-hero">
        O seu negócio com as melhores <br></br>máquinas de café.
      </p>
      <Link to="/products" className="btn-hero">Conheça nossos produtos</Link>
    </div>
  );
};

export default Carousel;