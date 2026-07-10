// Link
import { Link } from 'react-router-dom';

const Card = ({ content }) => {
    // Autor vem embutido na query de posts (profiles)
    const author = content.profiles || {};

    return (
        <div className="grid-4 card hidden p-0">
            <div className="thumb hidden">
                <Link to={"/posts/" + content.id} className="p-0">
                    <img src={content.image_url} alt="" />
                </Link>
            </div>

            <div className="p-2">
                <Link to={"/posts/" + content.id} className="link-title">
                    <h6 className="color-primary">{content.date}</h6>
                    <h4 className="mt-1">{content.title}</h4>
                </Link>

                <div className="mt-2 flex-space">
                    <div className="flex-start-row">
                        <div className="profile">
                            <img src={author.image_profile} className="profile-img" alt="" />
                        </div>
                        <div className="ml-2">
                            <h6 className="color-primary">{author.name} {author.surname}</h6>
                            <h6 className="color-gray">{author.username}</h6>
                        </div>
                    </div>
                </div>

                <p className="my-2">
                    {content.resume}
                </p>
            </div>
        </div>
    );
}

export default Card;
