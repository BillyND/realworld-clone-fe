import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../Context";
import {
  getListArticleByOffset,
  getPopularTag,
  getTag,
  getYouFeed,
} from "../services/apiServices";
import ArticleCard from "./ArticleCard";
import Paginate from "./Paginate";

function HomePage(props) {
  const [userLogin, setUserLogin, isLoading, setIsLoading] =
    useContext(Context);
  const infoUser = localStorage.getItem("userLogin");
  const [listArticle, setListArticle] = useState([]);
  const [popularTag, setPopularTag] = useState([]);
  const [tagActive, setTagActive] = useState("global");
  const [countArticle, setCountArticle] = useState(0);

  useEffect(() => {
    document.title = "Home ── Conduit";
    fetchListArticle();
  }, []);

  const handlePageClick = async (e) => {
    fetchListArticle(e.selected * 10);
  };

  const fetchListArticle = async (offsetTarget) => {
    setIsLoading(true);
    try {
      const resListArticle = getListArticleByOffset(
        offsetTarget || 0,
        userLogin?.user?.token || JSON.parse(infoUser)?.user?.token
      );
      const popularTag = getPopularTag(
        userLogin?.user?.token || JSON.parse(infoUser)?.user?.token
      );
      Promise.all([resListArticle, popularTag])
        .then((responses) => {
          const resListArticle = responses[0];
          const popularTag = responses[1];

          setListArticle(resListArticle.data.articles);
          setCountArticle(resListArticle.data.articlesCount);
          setPopularTag(popularTag.data.tags);

          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error);
        });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleSetPopularTag = async (data) => {
    setIsLoading(true);
    setTagActive(data);
    const resTagActive = await getTag(data);
    setListArticle(resTagActive.data.articles);
    setIsLoading(false);
  };

  const handleGetFeed = async () => {
    setIsLoading(true);
    const resFeed = await getYouFeed(userLogin?.user?.token);
    setListArticle(resFeed?.data?.articles);
    setIsLoading(false);
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page home-container">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {JSON.parse(infoUser)?.user?.token && (
                  <li
                    className="nav-item"
                    onClick={() => {
                      if (tagActive !== "yourfeed") {
                        setTagActive("yourfeed");
                        handleGetFeed();
                      }
                    }}
                  >
                    <a
                      className={`nav-link  ${
                        tagActive === "yourfeed" ? "active" : ""
                      }`}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li
                  className="nav-item"
                  onClick={() => {
                    if (tagActive !== "global") {
                      setTagActive("global");
                      fetchListArticle();
                    }
                  }}
                >
                  <a
                    className={`nav-link  ${
                      tagActive === "global" ? "active" : ""
                    }`}
                  >
                    Global Feed
                  </a>
                </li>

                {tagActive !== "global" && tagActive !== "yourfeed" && (
                  <li className="nav-item">
                    <a className={`nav-link ${tagActive ? "active" : ""}`}>
                      # {tagActive}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {listArticle &&
              listArticle.map((article, index) => {
                return (
                  <ArticleCard
                    key={index + "-" + article?.favoritesCount}
                    article={article}
                    listArticle={listArticle}
                    setListArticle={setListArticle}
                  />
                );
              })}
            <br />
            {listArticle && listArticle.length == 0 && (
              <div className="no-article">No articles are here... yet.</div>
            )}
            {tagActive === "global" &&
              listArticle &&
              listArticle.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Paginate
                    countArticle={countArticle}
                    limit={10}
                    handlePageClick={handlePageClick}
                  />
                </div>
              )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {popularTag &&
                  popularTag.map((tag, index) => {
                    return (
                      <NavLink
                        key={index + "-" + tag}
                        onClick={() => {
                          if (tagActive !== tag) {
                            handleSetPopularTag(tag);
                          }
                        }}
                        className={`tag-pill tag-default `}
                      >
                        {tag}
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
