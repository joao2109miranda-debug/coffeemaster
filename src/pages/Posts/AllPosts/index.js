// AllPosts.js

// React e Hooks
import React, { useState, useEffect } from 'react';

// Supabase
import supabase from '../../../services/supabase';

// Componentes
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import CardAllPosts from '../../Home/Card/CardAllPosts/index';

const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(3);

  useEffect(() => {
    // Recarrega os posts sempre que o número de posts visíveis muda
    supabase
      .from('posts')
      .select('*, profiles(name, surname, username, image_profile)')
      .order('date', { ascending: false })
      .limit(visiblePosts)
      .then(({ data, error }) => {
        if (error) {
          console.error('Erro ao buscar posts:', error);
          return;
        }
        setAllPosts(data || []);
      });
  }, [visiblePosts]);

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 3);
  };

  return (
    <>
      <Header />

      <section className="container-svc">
        <div className="row flex-center flex-wrap">
          {allPosts.map(posts => (
            <CardAllPosts key={posts.id} content={posts} />
          ))}
        </div>
      </section>

      {allPosts.length >= visiblePosts && (
        <div className="text-center flex-center-column mt-1 mb-6">
          <a className="btn btn-click" onClick={loadMorePosts}>
            Ver mais posts
          </a>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AllPosts;
