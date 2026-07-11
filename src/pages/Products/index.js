// Header e Footer
import Header from "pages/Header";
import Footer from "pages/Footer";

import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Context from "pages/Context";
import supabase from "services/supabase";
import ProductCard from "./ProductCard";
import FilterToolbar from "components/Filters/FilterToolbar";
import Pagination from "components/Pagination";
import Skeleton from "components/Skeleton";

const AVAIL = [
  { key: "any", label: "Todos" },
  { key: "on", label: "Disponíveis" },
  { key: "off", label: "Indisponíveis" },
];
const PRODUCTS_PER_PAGE = 6;

const prettyBrand = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const Products = () => {
  const { user } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [avail, setAvail] = useState("any");
  const [sortDesc, setSortDesc] = useState(false);
  const [page, setPage] = useState(1);

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
    if (!user) { setIsAdmin(false); return; }
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setIsAdmin(!!(data && data.is_admin)));
  }, [user]);

  const countsByBrand = useMemo(() => {
    const c = { all: products.length };
    products.forEach((p) => {
      const b = p.brand?.trim();
      if (b) c[b] = (c[b] || 0) + 1;
    });
    return c;
  }, [products]);

  const brandOptions = useMemo(() => [
    { key: "all", label: "Todos", count: countsByBrand.all || 0 },
    ...Object.keys(countsByBrand)
      .filter((k) => k !== "all")
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((k) => ({ key: k, label: prettyBrand(k), count: countsByBrand[k] || 0 })),
  ], [countsByBrand]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (brand !== "all" && p.brand?.trim() !== brand) return false;
      if (avail === "on" && !p.available) return false;
      if (avail === "off" && p.available) return false;
      if (q && !(`${p.name} ${p.description || ""} ${p.specification || ""}`.toLowerCase().includes(q))) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sortDesc ? tb - ta : ta - tb;
    });
    return list;
  }, [products, query, brand, avail, sortDesc]);

  useEffect(() => setPage(1), [query, brand, avail, sortDesc]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const visibleProducts = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  return (
    <>
      <Header />

      <div className="page-wrap">
        <div className="page-head flex-space">
          <div>
            <h6 className="uppercase color-primary">PRODUTOS</h6>
            <h3>Os melhores produtos para os melhores negócios.</h3>
          </div>
          {isAdmin && (
            <Link to="/profile/products" className="btn-outline btn-sm">Gerenciar produtos</Link>
          )}
        </div>

        <FilterToolbar
          search={{
            value: query,
            onChange: setQuery,
            placeholder: "Buscar por nome, descrição ou especificação...",
          }}
          inlineFilter={{
            options: [
              { key: "recent", label: "Recentes" },
              { key: "old", label: "Antigos" },
            ],
            value: sortDesc ? "recent" : "old",
            onChange: (k) => setSortDesc(k === "recent"),
          }}
          groups={[
            { label: "Marca", options: brandOptions, value: brand, onChange: setBrand },
            { label: "Disponibilidade", options: AVAIL, value: avail, onChange: setAvail },
          ]}
          meta={loading ? "Carregando..." : `${filtered.length} produto(s) encontrado(s)`}
        />

        {loading ? <Skeleton variant="row" count={3} /> : null}
        {!loading && filtered.length === 0 ? (
          <p className="text-center mt-3">Nenhum produto corresponde aos filtros.</p>
        ) : (
          !loading && visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
        )}
        {!loading ? <Pagination page={page} totalPages={totalPages} onChange={setPage} /> : null}
      </div>

      <Footer />
    </>
  );
};

export default Products;
