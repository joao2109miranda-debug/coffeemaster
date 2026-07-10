import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "pages/Header";
import Footer from "pages/Footer";
import Context from "pages/Context";
import supabase from "services/supabase";

const emptyForm = {
  id: null,
  name: "",
  available: true,
  description: "",
  specification: "",
  image_url: "",
};

const ProductAdmin = () => {
  const { user } = useContext(Context);
  const [isAdmin, setIsAdmin] = useState(null); // null = verificando
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Verifica permissão de admin
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
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
  };

  const editProduct = (p) => {
    setForm({
      id: p.id,
      name: p.name || "",
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
    setSaving(true);
    try {
      const imageUrl = await uploadIfNeeded();
      const payload = {
        name: form.name.trim(),
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
        <section className="container"><p>Verificando permissão...</p></section>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <section className="container">
          <h3>Acesso restrito</h3>
          <p className="mt-2">Você não tem permissão para gerenciar produtos.</p>
          <Link to="/products" className="btn mt-3">Voltar para produtos</Link>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="container">
        <div className="flex-space">
          <h3>{form.id ? "Editar produto" : "Novo produto"}</h3>
          <Link to="/products" className="link">Ver página pública</Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-2">
          <div className="row p-0">
            <div className="grid-8 p-0">
              <label htmlFor="name"><h6 className="mb-1">Nome (Título)</h6></label>
              <input type="text" id="name" name="name" value={form.name} onChange={onChange} placeholder="Ex.: Astoria Calypso" />
            </div>
            <div className="grid-4 p-0">
              <label htmlFor="available"><h6 className="mb-1">Disponibilidade da máquina</h6></label>
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
              <label htmlFor="file"><h6 className="mb-1">Anexar imagem</h6></label>
              <input type="file" id="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
            </div>
            <div className="grid-6 p-0">
              <label htmlFor="image_url"><h6 className="mb-1">...ou colar URL da imagem</h6></label>
              <input type="text" id="image_url" name="image_url" value={form.image_url} onChange={onChange} placeholder="https://..." />
            </div>
          </div>

          {error ? <div className="card-danger p-2 mt-2"><h6 className="h7 color-red">{error}</h6></div> : null}
          {msg ? <div className="card-success p-2 mt-2"><h6 className="h7 color-green">{msg}</h6></div> : null}

          <div className="flex-end-row mt-3">
            {form.id ? (
              <button type="button" className="link mr-3" onClick={resetForm}>Cancelar edição</button>
            ) : null}
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Salvando..." : form.id ? "Salvar alterações" : "Criar produto"}
            </button>
          </div>
        </form>
      </section>

      <section className="container mt-4">
        <h3 className="mb-2">Produtos cadastrados ({products.length})</h3>
        {products.length === 0 ? (
          <p>Nenhum produto ainda.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="card p-2 mb-2 flex-space">
              <div className="flex-start-row">
                {p.image_url ? <img src={p.image_url} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, marginRight: 12 }} /> : null}
                <div>
                  <h5>{p.name}</h5>
                  <h6 className={p.available ? "color-1" : "color-gray"}>
                    {p.available ? "Disponível" : "Indisponível"}
                  </h6>
                </div>
              </div>
              <div className="flex-start-row">
                <button type="button" className="link mr-3" onClick={() => editProduct(p)}>Editar</button>
                <button type="button" className="link color-red" onClick={() => handleDelete(p)}>Excluir</button>
              </div>
            </div>
          ))
        )}
      </section>

      <Footer />
    </>
  );
};

export default ProductAdmin;
