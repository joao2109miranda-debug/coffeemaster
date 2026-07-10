import { WHATSAPP_NUMBER } from 'config';

const ProductCard = ({ product }) => {
  const handleWhats = () => {
    const msg = `Olá! Tenho interesse na máquina "${product.name}". Ela está disponível?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="product-card">
      <div className="product-thumb">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="thumb-empty" />
        )}
      </div>

      <div className="product-info">
        <h4>{product.name}</h4>
        <span className={product.available ? 'avail-badge avail-on' : 'avail-badge avail-off'}>
          {product.available ? 'Máquina Disponível' : 'Máquina Indisponível'}
        </span>

        <p className="mt-2 mb-1">{product.description}</p>

        <h6 className="color-1 h7 link mt-2">Especificações</h6>
        <p className="mt-1">{product.specification}</p>

        <button className="btn mt-2 btn-click" onClick={handleWhats}>
          Verificar disponibilidade
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
