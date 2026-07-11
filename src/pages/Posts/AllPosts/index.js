import React, { useContext, useEffect, useMemo, useState } from 'react';
import supabase from '../../../services/supabase';
import { Link } from 'react-router-dom';
import Context from 'pages/Context';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import CardAllPosts from '../../Home/Card/CardAllPosts/index';
import FilterToolbar from 'components/Filters/FilterToolbar';
import Pagination from 'components/Pagination';
import Skeleton from 'components/Skeleton';

const POSTS_PER_PAGE = 12;

const AllPosts = () => {
  const { user } = useContext(Context);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from('profiles').select('is_admin').eq('id', user.id).single()
      .then(({ data }) => setIsAdmin(Boolean(data?.is_admin)));
  }, [user]);

  useEffect(() => {
    supabase.from('post_categories').select('id, name').order('name').then(({ data, error }) => {
      if (error) console.error('Erro ao buscar categorias:', error);
      else setCategories(data || []);
    });
  }, []);

  useEffect(() => setPage(1), [search, categoryId, sort]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select('*, profiles(name, surname, username, image_profile)', { count: 'exact' })
        .order('date', { ascending: sort === 'old' })
        .order('created_at', { ascending: sort === 'old' })
        .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

      if (categoryId) query = query.eq('category_id', categoryId);
      const text = search.trim().replace(/[%,()]/g, '');
      if (text) query = query.or(`title.ilike.%${text}%,resume.ilike.%${text}%,content.ilike.%${text}%`);

      const { data, error, count } = await query;
      if (error) console.error('Erro ao buscar posts:', error);
      else {
        setAllPosts(data || []);
        setTotalPages(Math.max(1, Math.ceil((count || 0) / POSTS_PER_PAGE)));
      }
      setLoading(false);
    };
    loadPosts();
  }, [page, search, categoryId, sort]);

  const categoryOptions = useMemo(() => [
    { key: '', label: 'Todas' },
    ...categories.map((c) => ({ key: String(c.id), label: c.name })),
  ], [categories]);

  return (
    <>
      <Header />
      <section className="page-wrap all-posts-page">
        <div className="page-head flex-space">
          <div><h6 className="uppercase color-primary">BLOG</h6><h3>Conteúdos para o seu negócio.</h3></div>
          {isAdmin ? <Link to="/profile/posts" className="btn-outline btn-sm">Gerenciar posts</Link> : null}
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

        {loading ? <Skeleton variant="cards" count={3} /> : null}
        {!loading && allPosts.length === 0 ? <p className="text-center mt-3">Nenhum post corresponde aos filtros.</p> : null}
        {!loading && allPosts.length > 0 ? (
          <div className="blog-post-grid">
            {allPosts.map((post) => <CardAllPosts key={post.id} content={post} />)}
          </div>
        ) : null}
        {!loading ? <Pagination page={page} totalPages={totalPages} onChange={setPage} /> : null}
      </section>
      <Footer />
    </>
  );
};

export default AllPosts;
