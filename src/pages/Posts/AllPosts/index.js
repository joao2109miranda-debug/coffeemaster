import React, { useEffect, useMemo, useState } from 'react';
import supabase from '../../../services/supabase';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import CardAllPosts from '../../Home/Card/CardAllPosts/index';
import FilterToolbar from 'components/Filters/FilterToolbar';

const POSTS_PER_PAGE = 12;

const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('post_categories').select('id, name').order('name').then(({ data, error }) => {
      if (error) console.error('Erro ao buscar categorias:', error);
      else setCategories(data || []);
    });
  }, []);

  useEffect(() => setVisiblePosts(POSTS_PER_PAGE), [search, categoryId, sort]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select('*, profiles(name, surname, username, image_profile)')
        .order('date', { ascending: sort === 'old' })
        .order('created_at', { ascending: sort === 'old' })
        .limit(visiblePosts);

      if (categoryId) query = query.eq('category_id', categoryId);
      const text = search.trim().replace(/[%,()]/g, '');
      if (text) query = query.or(`title.ilike.%${text}%,resume.ilike.%${text}%,content.ilike.%${text}%`);

      const { data, error } = await query;
      if (error) console.error('Erro ao buscar posts:', error);
      else setAllPosts(data || []);
      setLoading(false);
    };
    loadPosts();
  }, [visiblePosts, search, categoryId, sort]);

  const categoryOptions = useMemo(() => [
    { key: '', label: 'Todas' },
    ...categories.map((c) => ({ key: String(c.id), label: c.name })),
  ], [categories]);

  return (
    <>
      <Header />
      <section className="page-wrap all-posts-page">
        <div className="page-head">
          <h6 className="uppercase color-primary">BLOG</h6>
          <h3>Conteúdos para o seu negócio.</h3>
        </div>

        <FilterToolbar
          search={{
            value: search,
            onChange: setSearch,
            placeholder: 'Buscar por título, resumo ou conteúdo...',
          }}
          inlineFilter={{
            options: [
              { key: 'recent', label: 'Recentes' },
              { key: 'old', label: 'Antigos' },
            ],
            value: sort,
            onChange: setSort,
          }}
          groups={[{ label: 'Categoria', options: categoryOptions, value: categoryId, onChange: setCategoryId }]}
          meta={loading ? 'Carregando posts...' : `${allPosts.length} post(s)`}
        />

        {!loading && allPosts.length === 0 ? <p className="text-center mt-3">Nenhum post corresponde aos filtros.</p> : null}
        {!loading && allPosts.length > 0 ? (
          <div className="blog-post-grid">
            {allPosts.map((post) => <CardAllPosts key={post.id} content={post} />)}
          </div>
        ) : null}
      </section>

      {!loading && allPosts.length >= visiblePosts ? (
        <div className="text-center flex-center-column mt-1 mb-6">
          <button type="button" className="btn" onClick={() => setVisiblePosts((value) => value + POSTS_PER_PAGE)}>Ver mais posts</button>
        </div>
      ) : null}
      <Footer />
    </>
  );
};

export default AllPosts;
