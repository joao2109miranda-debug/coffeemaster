import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "pages/Header";
import Footer from "pages/Footer";
import Context from "pages/Context";
import supabase from "services/supabase";

const emptyForm = {
  id: null,
  name: "",
  brand: "",
  available: true,
  description: "",
  specification: "",
  image_url: "",
};

const ProductAdmin = () => {
  const { user } = useContext(Context);
  const [isAdmin, setIsAdmin] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const brands = [...new Set(
    products.map((product) => product.brand?.trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "pt-BR"));

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

  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error("Erro ao buscar produtos:", error);
    else setProducts(data || []);
  }, []);

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin, loadProducts]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
  };

  const editProduct = (p) => {
    setForm({
      id: p.id,
      name: p.name || "",
      brand: p.brand || "",
      available: !!p.available,
      description: p.description || "",
      specification: p.specification || "",
      image_url: p.image_url || "",
    });
    setFile(null);
    setMsg("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadIfNeeded = async () => {
    if (!file) return form.image_url || null;
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    if (!form.name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }
    if (!form.brand.trim()) {
      setError("A marca do produto é obrigatória.");
      return;
    }
    setSaving(true);
    try {
      const imageUrl = await uploadIfNeeded();
      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        available: form.available,
        description: form.description,
        specification: form.specification,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      let resErr;
      if (form.id) {
        ({ error: resErr } = await supabase.from("products").update(payload).eq("id", form.id));
      } else {
        ({ error: resErr } = await supabase.from("products").insert(payload));
      }
      if (resErr) throw resErr;

      setMsg(form.id ? "Produto atualizado!" : "Produto criado!");
      resetForm();
      loadProducts();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError("Não foi possível salvar o produto. " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm(`Excluir o produto "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      console.error("Erro ao excluir:", error);
      setError("Não foi possível excluir o produto.");
      return;
    }
    if (form.id === p.id) resetForm();
    loadProducts();
  };

  if (isAdmin === null) {
    return (
      <>
        <Header />
        <div className="page-wrap"><p>Verificando permissão...</p></div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <div className="page-wrap">
          <h3>Acesso restrito</h3>
          <p className="mt-2">Você não tem permissão para gerenciar produtos.</p>
          <Link to="/profile" className="btn-outline mt-3" style={{ display: "inline-block" }}>Voltar ao perfil</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="page-wrap">
        <div className="page-head flex-space" style={{ alignItems: "center" }}>
          <div>
            <h6 className="uppercase color-primary">GERENCIAR PRODUTOS</h6>
            <h3>{form.id ? "Editar produto" : "Novo produto"}</h3>
          </div>
          <Link to="/products" className="link">Ver página pública →</Link>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="row p-0">
            <div className="grid-6 p-0">
              <label htmlFor="name"><h6 className="mb-1">Nome (Título)</h6></label>
              <input type="text" id="name" name="name" value={form.name} onChange={onChange} placeholder="Ex.: Astoria Calypso" />
            </div>
            <div className="grid-3 p-0">
              <label htmlFor="brand"><h6 className="mb-1">Marca</h6></label>
              <input
                type="text"
                id="brand"
                name="brand"
                list="product-brands"
                value={form.brand}
                onChange={onChange}
                placeholder="Digite ou selecione"
                required
              />
              <datalist id="product-brands">
                {brands.map((existingBrand) => (
                  <option key={existingBrand} value={existingBrand} />
                ))}
              </datalist>
            </div>
            <div className="grid-3 p-0">
              <label htmlFor="available"><h6 className="mb-1">Disponibilidade</h6></label>
              <select
                id="available"
                name="available"
                value={form.available ? "true" : "false"}
                onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
              >
                <option value="true">Disponível</option>
                <option value="false">Indisponível</option>
              </select>
            </div>
          </div>

          <div className="row p-0">
            <div className="grid-12 p-0">
              <label htmlFor="description"><h6 className="mb-1">Descrição</h6></label>
              <textarea id="description" name="description" rows="4" value={form.description} onChange={onChange} placeholder="Descreva a máquina..."></textarea>
            </div>
          </div>

          <div className="row p-0">
            <div className="grid-12 p-0">
              <label htmlFor="specification"><h6 className="mb-1">Especificação</h6></label>
              <textarea id="specification" name="specification" rows="4" value={form.specification} onChange={onChange} placeholder="Ex.: - Entrada automática de água; // Lança de Vapor; // Voltagem: 220V"></textarea>
            </div>
          </div>

          <div className="row p-0">
            <div className="grid-6 p-0">
              <h6 className="mb-1">Anexar imagem</h6>
              <div className="file-field">
                <label className="file-btn" htmlFor="file">
                  <span>📎 Escolher arquivo</span>
                </label>
                <input type="file" id="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
                <span className="file-name">{file ? file.name : "Nenhum arquivo escolhido"}</span>
              </div>
            </div>
            <div className="grid-6 p-0">
              <label htmlFor="image_url"><h6 className="mb-1">...ou colar URL da imagem</h6></label>
              <input type="text" id="image_url" name="image_url" value={form.image_url} onChange={onChange} placeholder="https://..." />
            </div>
          </div>

          {error ? <div className="card-danger p-2 mt-2"><h6 className="h7 color-red">{error}</h6></div> : null}
          {msg ? <div className="card-success p-2 mt-2"><h6 className="h7 color-green">{msg}</h6></div> : null}

          <div className="flex-end-row mt-3" style={{ alignItems: "center", gap: "16px" }}>
            {form.id ? (
              <button type="button" className="link-btn" onClick={resetForm} style={{ color: "#999a9b" }}>Cancelar edição</button>
            ) : null}
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Salvando..." : form.id ? "Salvar alterações" : "Criar produto"}
            </button>
          </div>
        </form>

        <h3 className="mb-2 mt-4">Produtos cadastrados ({products.length})</h3>
        {products.length === 0 ? (
          <p>Nenhum produto ainda.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="manage-row">
              <div className="m-left">
                {p.image_url ? <img src={p.image_url} alt="" className="m-thumb" /> : null}
                <div>
                  <h5 style={{ margin: 0 }}>{p.name}</h5>
                  <span className={p.available ? "avail-badge avail-on" : "avail-badge avail-off"}>
                    {p.available ? "Disponível" : "Indisponível"}
                  </span>
                </div>
              </div>
              <div className="m-actions">
                <button type="button" className="btn-outline btn-sm" onClick={() => editProduct(p)}>Editar</button>
                <button type="button" className="btn-danger btn-sm" onClick={() => handleDelete(p)}>Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProductAdmin;
