import React, { useContext, useEffect, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Context } from "../Context";
import {
  deleteUnfollowUser,
  getArticleByUser,
  getFavoritedUser,
  postFollowUser,
} from "../services/apiServices";
import ArticleCard from "./ArticleCard";
import Paginate from "./Paginate";

function ProfilePage(props) {
  const [userLogin, setUserLogin, isLoading, setIsLoading] =
    useContext(Context);
  const [listArticle, setListArticle] = useState([]);
  const infoUser = localStorage.getItem("userLogin");
  const [profileUser, setProfileUser] = useState("");
  const [typeArticle, setTypeArticle] = useState("my");
  const [countArticle, setCountArticle] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    fetchArticleByUsername();
  }, [params.username]);

  const fetchArticleByUsername = async (offset) => {
    setTypeArticle("my");
    const userPrf = params.username;
    setIsLoading(true);
    const resArticle = await getArticleByUser(
      userPrf,
      offset || 0,
      JSON.parse(infoUser)?.user?.token
    );
    setListArticle(resArticle?.data?.articles);
    setProfileUser(resArticle?.data?.articles[0]?.author);
    setCountArticle(resArticle?.data?.articlesCount);
    setIsLoading(false);
  };

  const fetchFavoriteArticle = async (offset) => {
    // if (!JSON.parse(infoUser)?.user) {
    //     navigate('/login')
    //     return
    // }
    setIsLoading(true);
    const resFavorited = await getFavoritedUser(
      params?.username,
      offset || 0,
      JSON.parse(infoUser)?.user?.token
    );
    setListArticle(resFavorited?.data?.articles);
    setCountArticle(resFavorited?.data?.articlesCount);
    setIsLoading(false);
  };

  const handleChangeTypeArticle = async (type) => {
    setTypeArticle(type);
    if (type === "my") {
      fetchArticleByUsername();
    } else {
      fetchFavoriteArticle();
    }
  };

  const handlePageClick = async (e) => {
    if (typeArticle === "my") {
      fetchArticleByUsername(e.selected * 5);
    } else {
      fetchFavoriteArticle(e.selected * 5);
    }
  };

  const handleFollow = async () => {
    setIsLoading(true);
    if (!JSON.parse(infoUser)?.user) {
      navigate("/login");
      return;
    }

    let resFollowUpdate;

    if (profileUser?.following) {
      resFollowUpdate = await deleteUnfollowUser(
        profileUser?.username,
        userLogin?.user?.token
      );
    } else {
      resFollowUpdate = await postFollowUser(
        profileUser?.username,
        userLogin?.user?.token
      );
    }
    let cloneProfile = profileUser;
    cloneProfile.following = resFollowUpdate.data.profile.following;
    setProfileUser({ ...cloneProfile });
    setIsLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={
                  params?.username === JSON.parse(infoUser)?.user?.username
                    ? JSON.parse(infoUser)?.user?.image
                    : profileUser?.image
                }
                className="user-img"
              />
              <h4>
                {params?.username === JSON.parse(infoUser)?.user?.username
                  ? JSON.parse(infoUser)?.user?.username
                  : profileUser?.username}
              </h4>
              <p>
                <span style={{ whiteSpace: "pre-line" }}>
                  {params?.username === JSON.parse(infoUser)?.user?.username
                    ? userLogin?.user?.bio
                    : profileUser?.bio}
                </span>
              </p>
              {params?.username === JSON.parse(infoUser)?.user?.username ? (
                <NavLink
                  className="btn btn-sm btn-outline-secondary action-btn"
                  to="/settings"
                >
                  <AiFillSetting className="icon-setting-profile" />
                  &nbsp; Edit Profile Settings
                </NavLink>
              ) : (
                <button
                  className={`btn btn-sm action-btn ${
                    profileUser?.following
                      ? "btn-secondary"
                      : "btn-outline-secondary"
                  } `}
                  onClick={handleFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp;{profileUser?.following ? "Unfollow" : "Follow"}{" "}
                  {profileUser?.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      typeArticle === "my" ? "active" : ""
                    }`}
                    onClick={() => handleChangeTypeArticle("my")}
                  >
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      typeArticle === "favorite" ? "active" : ""
                    }`}
                    onClick={() => handleChangeTypeArticle("favorite")}
                  >
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            {listArticle &&
              listArticle.map((article, index) => {
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

                return (
                  <ArticleCard
                    key={index + "-" + article?.favoritesCount}
                    article={article}
                    listArticle={listArticle}
                    setListArticle={setListArticle}
                  />
                );
              })}
            {listArticle && listArticle.length === 0 && (
              <>
                <br />
                No articles are here... yet.
              </>
            )}
          </div>
        </div>
        <Paginate
          countArticle={countArticle}
          limit={5}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
}

export default ProfilePage;
