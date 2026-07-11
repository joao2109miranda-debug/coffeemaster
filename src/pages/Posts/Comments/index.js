import { useContext, useEffect, useState, useCallback } from 'react';
import supabase from 'services/supabase';
import Context from 'pages/Context';
import StarRating from '../StarRating';

const Comments = ({ postId }) => {
  const { user } = useContext(Context);
  const [isAdmin, setIsAdmin] = useState(false);
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from('profiles').select('is_admin').eq('id', user.id).single()
      .then(({ data }) => setIsAdmin(!!(data && data.is_admin)));
  }, [user]);

  const load = useCallback(async () => {
    let query = supabase
      .from('comments')
      .select('id, author_name, content, created_at, status')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    // Admin enxerga todos; visitante só os visíveis
    if (!isAdmin) query = query.eq('status', 1);
    const { data, error } = await query;
    if (!error) setComments(data || []);
  }, [postId, isAdmin]);

  useEffect(() => {
    if (postId) load();
  }, [postId, load]);

  const submit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) { setError('Escreva um comentário.'); return; }
    setSending(true);
    setError('');
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_name: authorName.trim() || 'Anônimo',
      content: text,
    });
    setSending(false);
    if (error) { setError('Não foi possível enviar. Tente novamente.'); return; }
    setContent('');
    setAuthorName('');
    load();
  };

  const setStatus = async (c, status) => {
    const { error } = await supabase.from('comments').update({ status }).eq('id', c.id);
    if (error) { console.error(error); return; }
    load();
  };

  const remove = async (c) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Excluir este comentário permanentemente?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', c.id);
    if (error) { console.error(error); return; }
    load();
  };

  const fmt = (iso) => {
    try { return new Date(iso).toLocaleDateString('pt-BR'); } catch { return ''; }
  };

  const visibleCount = comments.filter((c) => c.status === 1).length;

  return (
    <div className="row my-3">
      <h3 className="mb-2">Comentários ({visibleCount})</h3>

      {/* Avaliação por estrela logo abaixo da label de comentários */}
      <StarRating postId={postId} />

      <form onSubmit={submit} className="mb-3 mt-3">
        <div className="row p-0">
          <div className="grid-4 p-0">
            <label htmlFor="author_name"><h6 className="mb-1">Nome (opcional)</h6></label>
            <input
              type="text"
              id="author_name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Anônimo"
            />
          </div>
        </div>
        <div className="row p-0">
          <div className="grid-12 p-0">
            <label htmlFor="comment_content"><h6 className="mb-1">Comentário</h6></label>
            <textarea
              id="comment_content"
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Deixe seu comentário..."
            ></textarea>
          </div>
        </div>
        {error ? (
          <div className="card-danger p-2 mt-1">
            <h6 className="h7 color-red">{error}</h6>
          </div>
        ) : null}
        <div className="flex-end-row mt-2">
          <button type="submit" className="btn" disabled={sending}>
            {sending ? 'Enviando...' : 'Comentar'}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <h6 className="color-gray">Seja o primeiro a comentar.</h6>
      ) : (
        comments.map((c) => (
          <div key={c.id} className={`card p-2 mb-2 comment-item ${c.status !== 1 ? 'is-hidden' : ''}`}>
            <h6 className="color-primary">
              {c.author_name} <span className="color-gray">· {fmt(c.created_at)}</span>
              {c.status !== 1 ? <span className="comment-badge">oculto</span> : null}
            </h6>
            {/* Texto puro (React escapa) — protegido contra XSS */}
            <p className="mt-1">{c.content}</p>

            {isAdmin && (
              <div className="comment-mod">
                {c.status === 1 ? (
                  <button type="button" className="btn-outline btn-sm" onClick={() => setStatus(c, 0)}>Censurar</button>
                ) : (
                  <button type="button" className="btn-outline btn-sm" onClick={() => setStatus(c, 1)}>Reexibir</button>
                )}
                <button type="button" className="btn-danger btn-sm" onClick={() => remove(c)}>Excluir</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
