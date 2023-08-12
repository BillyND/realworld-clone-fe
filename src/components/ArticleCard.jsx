import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../Context";
import {
  deleteFavoriteArticle,
  favoriteArticle,
} from "../services/apiServices";

function ArticleCard(props) {
  const { article, listArticle, setListArticle } = props;
  const [userLogin, setUserLogin, isLoading, setIsLoading] =
    useContext(Context);
  const infoUser = localStorage.getItem("userLogin");
  const navigate = useNavigate();
  const dateString = article.createdAt;
  const date = new Date(dateString);
  const monthIndex = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${months[monthIndex]} ${day}, ${year}`;

  const handleFavorite = async (slug, isFavorited) => {
    if (!JSON.parse(infoUser)?.user) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    let resArticleUpdate;
    if (isFavorited) {
      resArticleUpdate = await deleteFavoriteArticle(
        slug,
        userLogin?.user?.token
      );
    } else {
      resArticleUpdate = await favoriteArticle(slug, userLogin?.user?.token);
    }
    const idxArticleUpdate = listArticle.findIndex(
      (article) => article.slug === resArticleUpdate.data.article.slug
    );
    listArticle[idxArticleUpdate].favorited =
      resArticleUpdate.data.article.favorited;
    listArticle[idxArticleUpdate].favoritesCount =
      resArticleUpdate.data.article.favoritesCount;

    await setListArticle([...listArticle]);
    setIsLoading(false);
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <NavLink
          to={`/profile/${article?.author?.username}`}
          onClick={() => setIsLoading(true)}
        >
          <img src={article?.author?.image} />
        </NavLink>
        <div className="info" onClick={() => setIsLoading(true)}>
          <NavLink
            to={`/profile/${article?.author?.username}`}
            className="author"
          >
            {article?.author?.username}
          </NavLink>
          <span className="date">{formattedDate}</span>
        </div>

        <button
          className={`btn  btn-sm pull-xs-right ${
            article.favorited ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleFavorite(article.slug, article.favorited)}
        >
          <i className="ion-heart"></i> {article?.favoritesCount}
        </button>
      </div>
      <NavLink to={`/article/${article?.slug}`} className="preview-link">
        <h1>{article?.title}</h1>
        <p>{article?.description}</p>
        <div className="read-more-article">
          <span> Read more...</span>
          <div className="article-tagList">
            {article?.tagList?.map((tag, index) => (
              <div key={index + "-" + tag} className="tagList">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </NavLink>
    </div>
  );
}

export default ArticleCard;
