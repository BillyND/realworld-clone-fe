import React, { useContext, useEffect, useRef, useState } from 'react';
import { deleteArticle, deleteComment, deleteFavoriteArticle, deleteUnfollowUser, favoriteArticle, getArticleBySlug, getComment, postCommentArticle, postFollowUser } from '../services/apiServices';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Context } from '../Context';
import { BsFillTrashFill, BsPencil } from 'react-icons/bs';
import { toast } from 'react-toastify';
import BackdropLoading from './BackDropLoading';

function ArticlePage(props) {
    const [userLogin, setUserLogin, isLoading, setIsLoading] = useContext(Context)
    const infoUser = localStorage.getItem("userLogin")

    const [article, setArticle] = useState({})
    const [comment, setComment] = useState('')
    const [listComment, setListComment] = useState([])
    const param = useParams()
    const navigate = useNavigate()
    const dateString = article?.createdAt;
    const date = new Date(dateString);
    const monthIndex = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const formattedDate = `${months[monthIndex]} ${day}, ${year}`;

    useEffect(() => {
        setIsLoading(true)
        const slug = param.slug
        fetchArticle(slug)
        JSON.parse(infoUser)?.user && fetchComment(slug)
    }, [])

    const fetchArticle = async (slug) => {
        setIsLoading(true)
        const resArticleBySlug = await getArticleBySlug(slug, JSON.parse(infoUser)?.user?.token)
        setArticle(resArticleBySlug?.data?.article)
        // setTimeout(() => {
        setIsLoading(false)
        // }, 5000)
    }

    const fetchComment = async (slug) => {
        setIsLoading(true)
        const resComment = await getComment(slug, JSON.parse(infoUser)?.user?.token)
        if (resComment.status === 200) {
            setListComment(resComment.data.comments)
        }
    }

    const handleFavorite = async () => {
        setIsLoading(true)
        if (!JSON.parse(infoUser)?.user) {
            navigate('/login')
            return
        }
        let resArticleUpdate
        if (article.favorited) {
            resArticleUpdate = await deleteFavoriteArticle(article?.slug, userLogin?.user?.token)
        } else {
            resArticleUpdate = await favoriteArticle(article?.slug, userLogin?.user?.token)
        }
        let cloneArticle = article
        cloneArticle.favorited = resArticleUpdate.data.article.favorited
        cloneArticle.favoritesCount = resArticleUpdate.data.article.favoritesCount
        setArticle({ ...cloneArticle })
        setIsLoading(false)
    }

    const handleFollow = async () => {

        if (!JSON.parse(infoUser)?.user) {
            navigate('/login')
            return
        }
        setIsLoading(true)
        let resFollowUpdate

        if (article?.author?.following) {
            resFollowUpdate = await deleteUnfollowUser(article?.author?.username, userLogin?.user?.token)
        } else {
            resFollowUpdate = await postFollowUser(article?.author?.username, userLogin?.user?.token)
        }
        let cloneArticle = article
        cloneArticle.author.following = resFollowUpdate.data.profile.following
        setArticle({ ...cloneArticle })
        setIsLoading(false)
    }

    const handlePostComment = async () => {

        let dataComment = {
            comment: {
                body: comment.trim()
            }
        }
        if (!comment.trim()) {
            toast.error("Fill in the blank!")
            return
        }
        setIsLoading(true)
        const resComment = await postCommentArticle(dataComment, article?.slug, userLogin?.user?.token)
        if (resComment.status === 200) {
            setComment('')
            setListComment([...listComment, resComment.data.comment])
        }
        setIsLoading(false)
    }

    const handleDeleteComment = async (idComment) => {
        setIsLoading(true)
        const resDeleteCmt = await deleteComment(article?.slug, idComment, userLogin?.user?.token)
        let cloneListComment = listComment
        cloneListComment = cloneListComment.filter(comment => comment.id !== idComment)
        setListComment(cloneListComment)
        setIsLoading(false)
    }

    const handleEditArticle = () => {
        navigate(`/editor/${article.slug}`)
    }

    const handleDeleteArticle = async () => {
        setIsLoading(true)
        const resDeleteArticle = await deleteArticle(article?.slug, userLogin?.user?.token || JSON.parse(infoUser)?.user?.token)
        if (resDeleteArticle.status === 204) {
            navigate('/')
        }
        setIsLoading(false)
    }

    return (
        <div className="article-page" >
            <div className="banner" >
                <div className="container" >
                    <h1>{article?.title} </h1>

                    <div className="article-meta"  >
                        <NavLink to={`/profile/${article?.author?.username || article?.author?.email}`}><img style={isLoading ? { opacity: "0" } : {}} src={article?.author?.image} /></NavLink>
                        <div className="info">
                            <NavLink to={`/profile/${article?.author?.username || article?.author?.email}`} className="author">{article?.author?.username}</NavLink>
                            <span className="date" >{isLoading ? formattedDate : "December 9, 2022"}</span>
                        </div>
                        {
                            userLogin?.user?.username === article?.author?.username ?
                                <>
                                    <button className={`btn btn-sm btn-outline-secondary `}
                                        onClick={handleEditArticle}
                                    >
                                        <BsPencil className='icon-article' />
                                        &nbsp;Edit Article
                                    </button>
                                    &nbsp;&nbsp;
                                    <button className={`btn btn-sm btn-outline-danger `}
                                        onClick={handleDeleteArticle}
                                    >
                                        <BsFillTrashFill className='icon-article' />
                                        &nbsp;Delete Article
                                    </button>
                                </>
                                :
                                <>
                                    <button className={`btn btn-sm ${article?.author?.following ? "btn-secondary" : "btn-outline-secondary"} `}
                                        onClick={handleFollow}
                                    >
                                        <i className="ion-plus-round"></i>
                                        &nbsp;{article?.author?.following ? "Unfollow" : "Follow"} {article?.author?.username}
                                    </button>
                                    &nbsp;&nbsp;


                                    <button className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={handleFavorite}
                                    >
                                        <i className="ion-heart"></i>
                                        &nbsp; {article.favorited ? "Unfavorite Article" : "Favorite Article"} <span className="counter">({article?.favoritesCount})</span>
                                    </button>
                                </>
                        }
                    </div>
                </div>
            </div>

            <div className="container page">
                <div className="row article-content">
                    <div className="col-md-12">
                        <p>
                            <span style={{ whiteSpace: 'pre-line' }}>
                                {article?.body}
                            </span>
                        </p>
                        <div className='article-tagList'>
                            {
                                article?.tagList?.map((tag, index) => (
                                    <span key={index + "-" + tag} className='tagList'>{tag}</span>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <hr />

                {
                    userLogin?.user?.token ?
                        <div className='comment-article'>

                            <div className="article-actions">
                                <div className="article-meta">
                                    <NavLink to={`/profile/${article?.author?.username || article?.author?.email}`}><img src={article?.author?.image} /></NavLink>
                                    <div className="info">
                                        <NavLink to={`/profile/${article?.author?.username || article?.author?.email}`} className="author">{article?.author?.username}</NavLink>
                                        <span className="date">{formattedDate}</span>
                                    </div>

                                    {
                                        userLogin?.user?.username === article?.author?.username ?
                                            <>
                                                <button className={`btn btn-sm btn-outline-secondary `}
                                                    onClick={handleEditArticle}
                                                >
                                                    <BsPencil className='icon-article' />
                                                    &nbsp;Edit Article
                                                </button>
                                                &nbsp;&nbsp;
                                                <button className={`btn btn-sm btn-outline-danger `}
                                                    onClick={handleDeleteArticle}
                                                >
                                                    <BsFillTrashFill className='icon-article' />
                                                    &nbsp;Delete Article
                                                </button>
                                            </>
                                            :
                                            <>
                                                <button className={`btn btn-sm ${article?.author?.following ? "btn-secondary" : "btn-outline-secondary"} `}
                                                    onClick={handleFollow}
                                                >
                                                    <i className="ion-plus-round"></i>
                                                    &nbsp;{article?.author?.following ? "Unfollow" : "Follow"} {article?.author?.username}
                                                </button>
                                                &nbsp;&nbsp;


                                                <button className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
                                                    onClick={handleFavorite}
                                                >
                                                    <i className="ion-heart"></i>
                                                    &nbsp; {article.favorited ? "Unfavorite Article" : "Favorite Article"} <span className="counter">({article?.favoritesCount})</span>
                                                </button>
                                            </>
                                    }
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-md-8 offset-md-2">
                                    <form className="card comment-form">
                                        <div className="card-block">
                                            <textarea className="form-control" placeholder="Write a comment..." rows="3"
                                                value={comment}
                                                onChange={e => {
                                                    setComment(e.target.value)
                                                }}
                                            ></textarea>

                                        </div>
                                        <div className="card-footer">
                                            <img src={userLogin?.user?.image} className="comment-author-img" />
                                            <button className="btn btn-sm btn-primary" type="button" onClick={handlePostComment}>Post Comment</button>
                                        </div>
                                    </form>



                                    {
                                        listComment && listComment.length > 0 && listComment.map((comment, index) => {
                                            const dateString = comment?.createdAt;
                                            const date = new Date(dateString);
                                            const monthIndex = date.getMonth();
                                            const day = date.getDate();
                                            const year = date.getFullYear();
                                            const months = [
                                                "January", "February", "March", "April", "May", "June",
                                                "July", "August", "September", "October", "November", "December"
                                            ];
                                            const formattedDate = `${months[monthIndex]} ${day}, ${year}`;

                                            return (
                                                <div key={index + Math.random()} className="card" >
                                                    <div className="card-block">
                                                        <div className="card-text">
                                                            <div style={{ whiteSpace: 'pre-line' }}>
                                                                {comment.body}
                                                            </div>
                                                            {/* <div dangerouslySetInnerHTML={{ __html: comment.body }}></div> */}
                                                        </div>
                                                    </div>
                                                    <div className="card-footer card-footer-comment">
                                                        <span>
                                                            <NavLink to={`/profile/${comment?.author?.username}`} className="comment-author">
                                                                <img src={comment?.author?.image} className="comment-author-img" />
                                                            </NavLink>
                                                            &nbsp;
                                                            <NavLink to={`/profile/${comment?.author?.username}`} className="comment-author">{comment?.author?.username}</NavLink>
                                                            <span className="date-posted">{formattedDate}</span>
                                                        </span>
                                                        {
                                                            userLogin?.user?.username === comment?.author?.username &&
                                                            <div className='icon-delete' onClick={() => handleDeleteComment(comment.id)}>
                                                                <BsFillTrashFill />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }

                                        )

                                    }


                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <NavLink to="/login">Sign in</NavLink> or <NavLink to="/register">sign up</NavLink> to add comments on this article.
                        </div>
                }
            </div>
        </div >
    );
}

export default ArticlePage;