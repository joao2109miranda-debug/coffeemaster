import { useEffect, useState, useCallback } from 'react';
import supabase from 'services/supabase';

// Identificador anônimo por navegador (controle de 1 voto por navegador).
function getVoterId() {
  let id = localStorage.getItem('cm_voter_id');
  if (!id) {
    id = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('cm_voter_id', id);
  }
  return id;
}

const StarRating = ({ postId }) => {
  const [avg, setAvg] = useState(0);
  const [votes, setVotes] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadSummary = useCallback(async () => {
    const { data } = await supabase
      .from('post_rating_summary')
      .select('avg_rating, votes_count')
      .eq('post_id', postId)
      .single();
    if (data) {
      setAvg(Number(data.avg_rating) || 0);
      setVotes(Number(data.votes_count) || 0);
    }
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    loadSummary();
    const voterId = getVoterId();
    supabase
      .from('ratings')
      .select('rating')
      .eq('post_id', postId)
      .eq('voter_id', voterId)
      .maybeSingle()
      .then(({ data }) => { if (data) setMyRating(data.rating); });
  }, [postId, loadSummary]);

  const vote = async (value) => {
    setSaving(true);
    const voterId = getVoterId();
    const { error } = await supabase
      .from('ratings')
      .upsert(
        { post_id: postId, rating: value, voter_id: voterId },
        { onConflict: 'post_id,voter_id' }
      );
    setSaving(false);
    if (error) {
      console.error('Erro ao avaliar:', error);
      return;
    }
    setMyRating(value);
    loadSummary();
  };

  const display = hover || myRating;

  return (
    <div className="my-3">
      <div className="flex-start-row" style={{ alignItems: 'center', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            role="button"
            aria-label={`Avaliar com ${n} estrela(s)`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => !saving && vote(n)}
            style={{
              cursor: 'pointer',
              fontSize: '1.6rem',
              lineHeight: 1,
              color: n <= display ? '#e0a82e' : '#c9c9c9',
            }}
          >
            {n <= display ? '★' : '☆'}
          </span>
        ))}
        <h6 className="color-gray" style={{ marginLeft: '10px' }}>
          {avg.toFixed(1)} · {votes} {votes === 1 ? 'voto' : 'votos'}
        </h6>
      </div>
      {myRating ? (
        <h6 className="color-primary mt-1">Sua avaliação: {myRating} ★</h6>
      ) : (
        <h6 className="color-gray mt-1">Clique nas estrelas para avaliar</h6>
      )}
    </div>
  );
};

export default StarRating;
