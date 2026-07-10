import { useEffect, useState, useCallback } from 'react';
import supabase from 'services/supabase';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, author_name, content, created_at')
      .eq('post_id', postId)
      .eq('status', 1)
      .order('created_at', { ascending: false });
    if (!error) setComments(data || []);
  }, [postId]);

  useEffect(() => {
    if (postId) load();
  }, [postId, load]);

  const submit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) {
      setError('Escreva um comentário.');
      return;
    }
    setSending(true);
    setError('');
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_name: authorName.trim() || 'Anônimo',
      content: text,
    });
    setSending(false);
    if (error) {
      setError('Não foi possível enviar. Tente novamente.');
      return;
    }
    setContent('');
    setAuthorName('');
    load();
  };

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  return (
    <div className="row my-3">
      <h3 className="mb-2">Comentários ({comments.length})</h3>

      <form onSubmit={submit} className="mb-3">
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
          <div key={c.id} className="card p-2 mb-2">
            <h6 className="color-primary">
              {c.author_name} <span className="color-gray">· {fmt(c.created_at)}</span>
            </h6>
            <p className="mt-1">{c.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
