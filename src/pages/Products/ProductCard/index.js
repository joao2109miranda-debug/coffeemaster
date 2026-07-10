import { WHATSAPP_NUMBER } from 'config';

const ProductCard = ({ product }) => {
  const handleWhats = () => {
    const msg = `Olá! Tenho interesse na máquina "${product.name}". Ela está disponível?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid-12 flex-center-prod">
      <div className="grid-4-prod">
        {product.image_url ? (
          <img src={product.image_url} className="rounded-img" alt={product.name} />
        ) : (
          <div className="rounded-img" />
        )}
      </div>
      <div className="grid-5">
        <h5>{product.name}</h5>
        <h6 className={product.available ? 'color-1 link' : 'color-gray link'}>
          {product.available ? 'Máquina Disponível' : 'Máquina Indisponível'}
        </h6>

        <p className="mt-1 mb-1">{product.description}</p>

        <h6 className="color-1 h7 link">Especificações</h6>
        <p className="mt-1">{product.specification}</p>

        <button className="btn mt-2 btn-click" onClick={handleWhats}>
          Verificar disponibilidade
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
