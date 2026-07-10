// Header e Footer
import Header from "pages/Header";
import Footer from "pages/Footer";

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Context from "pages/Context";
import supabase from "services/supabase";
import ProductCard from "./ProductCard";

const Products = () => {
  const { user } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Erro ao buscar produtos:", error);
        else setProducts(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setIsAdmin(!!(data && data.is_admin)));
  }, [user]);

  return (
    <>
      <Header />

      <div className="page-wrap">
        <div className="page-head flex-space" style={{ alignItems: "flex-end" }}>
          <div>
            <h6 className="uppercase color-primary">PRODUTOS</h6>
            <h3>Os melhores produtos para os melhores negócios.</h3>
          </div>
          {isAdmin && (
            <Link to="/profile/products" className="btn-outline btn-sm">Gerenciar produtos</Link>
          )}
        </div>

        {loading ? (
          <p className="text-center">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="text-center">Nenhum produto cadastrado ainda.</p>
        ) : (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;
