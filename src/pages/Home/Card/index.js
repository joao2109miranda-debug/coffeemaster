import { Link } from 'react-router-dom';

const Author = ({ author }) => {
  const name = [author.name, author.surname].filter(Boolean).join(' ') || author.username || 'Autor';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="blog-author">
      <div className="blog-author__avatar">
        {author.image_profile ? (
          <img src={author.image_profile} alt={`Foto de ${name}`} />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </div>
      <div className="blog-author__details">
        <h6 className="color-primary">{name}</h6>
        {author.username ? <span className="color-gray">@{author.username}</span> : null}
      </div>
    </div>
  );
};

const Metadata = ({ date, category }) => (
  <p className="blog-post-card__meta">
    {date ? <span>{date}</span> : null}
    {date && category ? <span aria-hidden="true">&nbsp;●&nbsp;</span> : null}
    {category ? <span className="blog-post-card__meta-category">{category}</span> : null}
  </p>
);

const Card = ({ content, variant = 'grid' }) => {
  const author = content.profiles || {};
  const postUrl = `/posts/${content.id}`;
  const className = `blog-post-card blog-post-card--${variant}`;
  const category = content.post_categories?.name || content.category;

  if (variant === 'compact') {
    return (
      <article className={className}>
        <Link to={postUrl} className="blog-post-card__compact-image" aria-label={content.title}>
          {content.image_url ? <img src={content.image_url} alt="" /> : <span>Sem imagem</span>}
        </Link>
        <div className="blog-post-card__compact-content">
          <Metadata date={content.date} category={category} />
          <Link to={postUrl} className="link-title">
            <h5>{content.title}</h5>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={className}>
      <Link to={postUrl} className="blog-post-card__image" aria-label={content.title}>
        {content.image_url ? <img src={content.image_url} alt="" /> : <span>Sem imagem</span>}
      </Link>
      <div className="blog-post-card__content">
        <Metadata date={content.date} category={category} />
        <Link to={postUrl} className="link-title">
          <h4>{content.title}</h4>
        </Link>
        <Author author={author} />
      </div>
    </article>
  );
};

export default Card;
