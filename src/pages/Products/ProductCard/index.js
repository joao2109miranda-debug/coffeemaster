import { WHATSAPP_NUMBER } from 'config';
import { toSafeHtml } from 'utils/sanitize';

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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
          {product.brand ? (
            <span className="avail-badge" style={{ background: 'rgba(227,83,83,.12)', color: '#E35353', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              {product.brand}
            </span>
          ) : null}
          <span className={product.available ? 'avail-badge avail-on' : 'avail-badge avail-off'}>
            {product.available ? 'Máquina Disponível' : 'Máquina Indisponível'}
          </span>
        </div>

        <div className="product-rich-text mt-2 mb-1" dangerouslySetInnerHTML={{ __html: toSafeHtml(product.description) }} />

        <h6 className="color-1 h7 link mt-2">Especificações</h6>
        <div className="product-rich-text mt-1" dangerouslySetInnerHTML={{ __html: toSafeHtml(product.specification) }} />

        <button className="btn mt-2 btn-click" onClick={handleWhats}>
          Verificar disponibilidade
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
