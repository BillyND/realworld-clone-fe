import React, { useContext, useEffect, useState } from 'react';
import { editArticle, getArticleBySlug, postNewArticle } from '../services/apiServices';
import { Context } from '../Context';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GrClose } from 'react-icons/gr';

function EditArticlePage(props) {
    const [userLogin, setUserLogin, isLoading, setIsLoading] = useContext(Context)
    const infoUser = localStorage.getItem("userLogin")
    const navigate = useNavigate()
    const param = useParams()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [description, setDescription] = useState('')
    const [tagList, setTagList] = useState('')
    const [tagListPost, setTagListPost] = useState([])


    useEffect(() => {
        const slug = param.slug
        param.slug && fetchEditArticle(slug)
    }, [])

    const fetchEditArticle = async (slug) => {
        setIsLoading(true)
        const resEditArticle = await getArticleBySlug(slug, JSON.parse(infoUser)?.user?.token)
        if (resEditArticle?.status === 200) {
            setTitle(resEditArticle?.data?.article?.title)
            setBody(resEditArticle?.data?.article?.body)
            setDescription(resEditArticle?.data?.article?.description)
            setTagListPost(resEditArticle?.data?.article?.tagList)
            setIsLoading(false)
        }
    }

    const handlePostArticle = async () => {
        setIsLoading(true)
        let dataPostArticle = {
            article: {
                title: title.trim(),
                body: body.trim(),
                description: description.trim(),
                tagList: tagListPost
            }
        }

        if (!title.trim() || !body.trim() || !description.trim()) {
            toast.error("Fill in the blank!")
            setIsLoading(false)
            return
        }
        if (param.slug) {
            const resEdit = await editArticle(param.slug, dataPostArticle, JSON.parse(infoUser)?.user?.token)
            if (resEdit?.status === 200) {
                setIsLoading(false)
                navigate(`/article/${resEdit.data.article.slug}`)
            }
        } else {
            const resPostNew = await postNewArticle(dataPostArticle, JSON.parse(infoUser)?.user?.token)
            setIsLoading(false)
            if (resPostNew.status === 200) {
                navigate(`/article/${resPostNew.data.article.slug}`)
            }
        }
        setIsLoading(false)
    }

    const handlePushTagList = (e) => {
        if (e && e.key && e.key === "Enter" && tagList.trim()) {
            let findItem = tagListPost.findIndex(item => item === tagList.trim())
            if (findItem === -1) {
                setTagListPost([...tagListPost, tagList.trim()])
                setTagList('')
            }
        }
    }

    const handleDeleteTagList = (tagPost) => {
        let cloneTagListPost = tagListPost
        cloneTagListPost = cloneTagListPost.filter(tag => tag !== tagPost)
        setTagListPost(cloneTagListPost)
    }

    return (
        <div className="editor-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-10 offset-md-1 col-xs-12">
                        <form>
                            <fieldset>
                                <fieldset className="form-group">
                                    <input type="text" className="form-control form-control-lg" placeholder="Article Title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <input type="text" className="form-control" placeholder="What's this article about?"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <textarea
                                        className="form-control"
                                        rows="8"
                                        placeholder="Write your article (in markdown)"
                                        value={body}
                                        onChange={e => setBody(e.target.value)}
                                    ></textarea>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter tags"
                                        value={tagList}
                                        onChange={e => setTagList(e.target.value)}
                                        onKeyUp={e => handlePushTagList(e)}
                                    />
                                    <div className="tag-list"></div>
                                </fieldset>
                                <div className='tag-list-new-article'>
                                    {
                                        tagListPost && tagListPost.length > 0 && tagListPost.map((tag, index) => {
                                            return (
                                                <span key={tag + index} className='tag-post'>
                                                    <GrClose className='icon-close-tag'
                                                        onClick={() => handleDeleteTagList(tag)}
                                                    />
                                                    {tag}
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                                <button className="btn btn-lg pull-xs-right btn-primary btn-push-article" type="button"
                                    onClick={handlePostArticle}
                                >
                                    Publish Article
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditArticlePage;