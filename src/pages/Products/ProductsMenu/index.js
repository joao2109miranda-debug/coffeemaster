import React, { useEffect } from 'react';
import juraf50 from '../../../img/cafeteira-cappuccino-automatica-jura-f50.jpg';  // Certifique-se de ajustar o caminho correto

const ProductsMenu = () => {
  useEffect(() => {
    const brandsMenu = document.getElementById('brands-menu');
    const brandTabs = brandsMenu.getElementsByClassName('brand-tab');

    // Adicione a classe 'active' à aba Astoria inicialmente
    const astoriaTab = document.querySelector('[data-target="astoria"]');
    astoriaTab.classList.add('active');

    // Função para mostrar ou ocultar conteúdos com base na marca selecionada
    function updateContentVisibility(brand) {
      const allContents = document.querySelectorAll('.tab-content .flex-center-prod');
      allContents.forEach(function (content) {
        content.style.display = 'none';
      });

      // Mostra os conteúdos específicos da marca selecionada
      const brandContents = document.querySelectorAll('.' + brand + '-content');
      brandContents.forEach(function (content) {
        content.style.display = 'flex';
      });
    }

    const handleTabClick = (event) => {
      event.preventDefault();

      for (let j = 0; j < brandTabs.length; j++) {
        if (brandTabs[j] !== event.currentTarget) {
          brandTabs[j].classList.remove('active');
        }
      }

      event.currentTarget.classList.add('active');
      const targetId = event.currentTarget.getAttribute('data-target');
      updateContentVisibility(targetId);
    };

    for (let i = 0; i < brandTabs.length; i++) {
      brandTabs[i].addEventListener('click', handleTabClick);
    }

    // Mostra os conteúdos iniciais (marcados como Astoria)
    updateContentVisibility('astoria');

    // Remover os event listeners ao desmontar o componente
    return () => {
      for (let i = 0; i < brandTabs.length; i++) {
        brandTabs[i].removeEventListener('click', handleTabClick);
      }
    };
  }, []); // Este efeito só é executado uma vez após a montagem do componente

  return (
    <div className="container-products-page">
      <div className="row">
        <h6 className="uppercase color-primary text-center">PRODUTOS</h6>
        <h3 className="text-center">Os melhores produtos para os melhores negócios.</h3>
      </div>

      <div className="row">
        <div className="grid-12 flex-center">
          <ul className="grid-6 navtabs flex-center" id="brands-menu">
            <li className="active p-1"><a href="#" className="brand-tab" data-target="astoria">Astoria</a></li>
            <li className="p-1"><a href="#" className="brand-tab" data-target="jura">JURA</a></li>
            <li className="p-1"><a href="#" className="brand-tab" data-target="bunn">Bunn</a></li>
          </ul>
        </div>
      </div>

      {/* ----------[ PRODUTOS ASTORIA ]---------- */}
      <div className="container-svc-main">
        <div id="astoria" className="tab-content active">
          <div className="grid-12 flex-center-prod astoria-content">
            <div className="grid-4-prod">
              <img src={juraf50} className="rounded-img" alt="" />
            </div>
            <div className="grid-5">
              <h5>ASTORIA AVANT</h5>
              <h6 className="color-1 link">Máquina Disponível</h6>
              <p className="mt-1 mb-1">Avant é uma máquina de café pronta para se adaptar a todas as situações. Estilo com linhas elegantes e modernas, projeto elegante, decorado com detalhes cromados brilhantes que complementam o caráter com gosto muito refinado. Dentro, toda a experiência e tecnologia da Astoria oferecem alta confiabilidade e elevada confiança para um resultado final de excelente qualidade das bebidas fornecidas.</p>
              <h6 className="color-1 h7 link">Especificações</h6>
              <p className="mt-1">- Entrada automática de água; // - Lança de Vapor; // Sistema de fornecimento de água quente; // Programação de 4 doses por grupo; // Voltagem: 220V</p>
              
              <button className="btn mt-2 btn-click">Verificar disponibilidade</button>
            </div>
          </div>

          <div className="grid-12 flex-center-prod astoria-content">
            <div className="grid-4-prod">
              <img src={juraf50} className="rounded-img" alt="" />
            </div>
            <div className="grid-5">
              <h5>ASTORIA CALYPSO</h5>
              <h6 className="color-1 link">Máquina Disponível</h6>
              <p className="mt-1 mb-1">Calypso é a máquina tradicional que garante uma extraordinária qualidade na extração do café, combinando tecnologia e estilo. Calypso é precisa, confiável e o seu design com traços simples e elegantes torna-a perfeita para qualquer tipo de decoração: torna cada pausa para café um verdadeiro momento de prazer. Uma máquina de dois grupos compacta ideal para quem precisa de espaço.</p>
              <h6 className="color-1 h7 link">Especificações</h6>
              <p className="mt-1">- Entrada automática de água; // - Lança de Vapor; // Sistema de fornecimento de água quente; // Programação de 6 doses por grupo; // Voltagem: 220V</p>
              
              <button className="btn mt-2 btn-click">Verificar disponibilidade</button>
            </div>
          </div>


        {/* ----------[ PRODUTOS JURA ]---------- */}
          <div className="grid-12 flex-center-prod jura-content">
            <div className="grid-4-prod">
              <img src={juraf50} className="rounded-img" alt="" />
            </div>
            <div className="grid-5">
              <h5>JURA</h5>
              <h6 className="color-1 link">Máquina Disponível</h6>
              <p className="mt-1 mb-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <h6 className="color-1 h7 link">Especificações</h6>
              <p className="mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <button className="btn mt-2 btn-click">Verificar disponibilidade</button>
            </div>
          </div>
          
        {/* ----------[ PRODUTOS BUNN ]---------- */}
          <div className="grid-12 flex-center-prod bunn-content">
            <div className="grid-4-prod">
              <img src={juraf50} className="rounded-img" alt="" />
            </div>
            <div className="grid-5">
              <h5>BUNN</h5>
              <h6 className="color-1 link">Máquina Disponível</h6>
              <p className="mt-1 mb-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <h6 className="color-1 h7 link">Especificações</h6>
              <p className="mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare urna pharetra ut ac, pellentesque. Ultricies habitasse pretium purus viverra. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <button className="btn mt-2 btn-click">Verificar disponibilidade</button>
            </div>
          </div>





        </div>




      </div>
    </div>
  );
};

export default ProductsMenu;