import axios from "axios";
import dotenv from "dotenv";
// dotenv.config();

const baseUrl = "https://social-media-server-tau-seven.vercel.app/api";
// const baseUrl = "https://api.realworld.io/api";

// const baseUrl = "http://localhost:8000/api";

const tokenHeaders = (token) => ({
  headers: {
    Authorization: "Bearer " + token,
  },
});

const api = axios.create({
  baseURL: baseUrl,
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // showLoadingBackdrop();
    return config;
  },
  function (error) {
    // Do something with request error
    // hideLoadingBackdrop();
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Do something with response data
    // hideLoadingBackdrop();
    return response;
  },
  function (error) {
    // Do something with response error
    // hideLoadingBackdrop();
    return Promise.reject(error);
  }
);

const getListArticleByOffset = (offset, token) =>
  api.get(
    `/articles?limit=10&offset=${offset}`,
    token && token && tokenHeaders(token)
  );

const getArticleBySlug = (slug, token) =>
  api.get(`/articles/${slug}`, token && token && tokenHeaders(token));

const postLogin = (infoUser) => api.post(`/users/login`, infoUser);

const postRegister = (dataRegister) => api.post(`/users`, dataRegister);

const getArticleByUser = (username, offset, token) =>
  api.get(
    `/articles?author=${username}&limit=5&offset=${offset}`,
    token && token && tokenHeaders(token)
  );

const getPopularTag = (token) =>
  api.get("/tags", token && token && tokenHeaders(token));

const favoriteArticle = (slug, token) =>
  api.post(
    `/articles/${slug}/favorite`,
    null,
    token && token && tokenHeaders(token)
  );

const deleteFavoriteArticle = (slug, token) =>
  api.delete(
    `/articles/${slug}/favorite`,
    token && token && tokenHeaders(token)
  );

const getTag = (tag) => api.get(`/articles?tag=${tag}`);

const getYouFeed = (token) =>
  api.get("/articles/feed", token && token && tokenHeaders(token));

const updateInfoUser = (infoUser, token) =>
  api.put("/user", infoUser, token && tokenHeaders(token));

const getComment = (slug, token) =>
  api.get(`/articles/${slug}/comments`, token && tokenHeaders(token));

const postFollowUser = (username, token) =>
  api.post(
    `/profiles/${username}/follow`,
    null,
    token && token && tokenHeaders(token)
  );

const deleteUnfollowUser = (username, token) =>
  api.delete(
    `/profiles/${username}/follow`,
    token && token && tokenHeaders(token)
  );

const postCommentArticle = (comment, slug, token) =>
  api.post(
    `/articles/${slug}/comments`,
    comment,
    token && token && tokenHeaders(token)
  );

const deleteComment = (slug, idComment, token) =>
  api.delete(
    `/articles/${slug}/comments/${idComment}`,
    token && token && tokenHeaders(token)
  );

const postNewArticle = (article, token) => {
  api.post("/articles", article, token && tokenHeaders(token));
};

const editArticle = (slug, article, token) =>
  api.put(`/articles/${slug}`, article, token && tokenHeaders(token));

const deleteArticle = (slug, token) =>
  api.delete(`/articles/${slug}`, token && tokenHeaders(token));

const getFavoritedUser = (username, offset, token) =>
  api.get(
    `/articles?favorited=${username}&limit=5&offset=${offset}`,
    token && token && tokenHeaders(token)
  );

function showLoadingBackdrop() {
  // Hiển thị backdrop loading
}

function hideLoadingBackdrop() {
  // Ẩn backdrop loading
}

export {
  deleteArticle,
  deleteComment,
  deleteFavoriteArticle,
  deleteUnfollowUser,
  editArticle,
  favoriteArticle,
  getArticleBySlug,
  getArticleByUser,
  getComment,
  getFavoritedUser,
  getListArticleByOffset,
  getPopularTag,
  getTag,
  getYouFeed,
  postCommentArticle,
  postFollowUser,
  postLogin,
  postNewArticle,
  postRegister,
  updateInfoUser,
};
