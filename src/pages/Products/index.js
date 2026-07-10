// Header e Footer
import Header from "pages/Header";
import Footer from "pages/Footer";

import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Context from "pages/Context";
import supabase from "services/supabase";
import ProductCard from "./ProductCard";

const BRANDS = [
  { key: "all",     label: "Todos" },
  { key: "astoria", label: "Astoria" },
  { key: "jura",    label: "JURA" },
  { key: "bunn",    label: "Bunn" },
];

const AVAIL = [
  { key: "any", label: "Todos" },
  { key: "on",  label: "Disponíveis" },
  { key: "off", label: "Indisponíveis" },
];

const Products = () => {
  const { user } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [avail, setAvail] = useState("any");
  const [sortDesc, setSortDesc] = useState(false); // false = mais antigos primeiro

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

  // Contagem por marca (para os chips)
  const countsByBrand = useMemo(() => {
    const c = { all: products.length, astoria: 0, jura: 0, bunn: 0 };
    products.forEach((p) => { if (p.brand && c[p.brand] !== undefined) c[p.brand]++; });
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (brand !== "all" && p.brand !== brand) return false;
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

        {/* Barra de busca */}
        <div className="filter-bar">
          <div className="filter-search">
            <span className="icon-search">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, descrição ou especificação..."
            />
          </div>
          <button type="button" className="filter-sort" onClick={() => setSortDesc((v) => !v)} title="Ordenar">
            <span>⇅</span>
            <span>{sortDesc ? "Mais recentes" : "Mais antigos"}</span>
          </button>
        </div>

        {/* Chips de marca */}
        <div className="chip-row" role="tablist" aria-label="Filtrar por marca">
          {BRANDS.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`chip ${brand === b.key ? "active" : ""}`}
              onClick={() => setBrand(b.key)}
              role="tab"
              aria-selected={brand === b.key}
            >
              <span>{b.label}</span>
              <span className="chip-count">{countsByBrand[b.key] || 0}</span>
            </button>
          ))}
        </div>

        {/* Chips de disponibilidade */}
        <div className="chip-row" role="tablist" aria-label="Filtrar por disponibilidade">
          {AVAIL.map((a) => (
            <button
              key={a.key}
              type="button"
              className={`chip ${avail === a.key ? "active" : ""}`}
              onClick={() => setAvail(a.key)}
              role="tab"
              aria-selected={avail === a.key}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="results-meta">
          {loading ? "Carregando..." : `${filtered.length} produto(s) encontrado(s)`}
        </div>

        {!loading && filtered.length === 0 ? (
          <p className="text-center mt-3">Nenhum produto corresponde aos filtros.</p>
        ) : (
          filtered.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;
