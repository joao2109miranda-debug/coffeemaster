// Header e Footer
import Header from "pages/Header";
import Footer from "pages/Footer";

// useParams
import { useParams } from "react-router-dom";

// Hooks
import { useState, useEffect } from "react";

// Supabase
import supabase from "../../services/supabase";

// Componentes
import StarRating from "./StarRating";
import Comments from "./Comments";


const Posts = () => {
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from("posts")
                .select("*, profiles(*)")
                .eq("id", id)
                .single();

            if (error || !data) {
                console.error("Erro ao buscar dados:", error);
                setPosts({});
                setUsers({});
                return;
            }

            setPosts(data);
            setUsers(data.profiles || {});
        };

        fetchData();
    }, [id]);

    if (posts === null || users === null) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <Header />

            <section className="container-post">
                <h6 className="uppercase color-primary text-center">{posts.category}</h6>
                <h3 className="text-center"> {posts.title} </h3>

                <div className="flex-center my-3">
                    <div className="profile">
                        <img src={users.image_profile} className="profile-img" alt="" />
                    </div>
                    <div className="ml-2">
                        <h6 className="color-primary">{users.name}</h6>
                        <h6 className="color-gray">{users.username}</h6>
                    </div>
                    <p className="ml-4">{posts.date} - {posts.duration} min read</p>
                </div>

                <div className="img-banner hidden">
                    <img src={posts.image_url} alt="" />
                </div>

                <div className="row my-3">
                    <h4>{posts.resume}</h4>
                    <p className="mt-1">
                        {posts.content}
                    </p>
                </div>

                {/* Avaliação anônima por estrela */}
                <div className="row">
                    <StarRating postId={posts.id} />
                </div>

                <div className="row">
                    <div className="grid-3 disappear"></div>
                    <div className="grid-6 card">
                        <div className="row">
                            <div className="grid-3 flex-center pl-1">
                                <div className="profile-big">
                                    <img src={users.image_profile} className="profile-img" alt="" />
                                </div>
                            </div>
                            <div className="grid-9">
                                <h6 className="color-primary">{users.name} {users.surname}</h6>
                                <h6 className="color-gray">{users.username}</h6>
                                <p className="mt-1">
                                    {users.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid-3 disappear"></div>
                </div>

                {/* Comentários anônimos */}
                <Comments postId={posts.id} />

            </section>

            <Footer />

        </>
    );
};

export default Posts;
