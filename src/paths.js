// Pages
import About from 'pages/About'
import Contact from 'pages/Contact'
import Login from 'pages/Login'
import NotFound from 'pages/NotFound'
import Posts from 'pages/Posts'
import Products from 'pages/Products'
import ProductAdmin from 'pages/Products/ProductAdmin'
import Profile from 'pages/Profile'
import ProfilePosts from 'pages/Profile/ProfilePosts'
import ProfileSettings from 'pages/Profile/ProfileSettings'
import Home from 'pages/Home'
import AllPosts from 'pages/Posts/AllPosts'

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Context from 'pages/Context';
import { useContext } from 'react';


// Redireciona para /login se não estiver autenticado
function PrivateRoute({ children }) {
  const { session, loading } = useContext(Context);

  if (loading) return null; // aguarda a sessão carregar antes de decidir

  return session ? children : <Navigate to="/login" />;
}

// Redireciona para /profile se já estiver autenticado (ex.: /login)
function PublicOnlyRoute({ children }) {
  const { session, loading } = useContext(Context);

  if (loading) return null;

  return session ? <Navigate to="/profile" replace /> : children;
}


const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login"
                    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

                <Route path="/profile"
                    element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/profile/posts"
                    element={<PrivateRoute><ProfilePosts /></PrivateRoute>} />
                <Route path="/profile/products"
                    element={<PrivateRoute><ProductAdmin /></PrivateRoute>} />
                <Route path="/profile/settings"
                    element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />

                <Route path="/products" element={<Products />} />
                {/* Rota antiga -> redireciona para a nova localização */}
                <Route path="/products/admin" element={<Navigate to="/profile/products" replace />} />
                <Route path="/allposts" element={<AllPosts />} />
                <Route path="/posts/:id" element={<Posts />} />
                <Route path="/about" element={<About />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;
