import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import SettingPage from './components/SettingPage';
import EditArticlePage from './components/EditArticlePage'
import ArticlePage from './components/ArticlePage'

function Layout() {

    return (
        <div className='content-app'>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/register' element={<AuthPage />} />
                <Route path='/login' element={<AuthPage />} />
                <Route path='/profile/:username' element={<ProfilePage />} />
                <Route path='/profile/:username/favorites' element={<ProfilePage />} />
                <Route path='/settings' element={<SettingPage />} />
                <Route path='/editor' element={<EditArticlePage />} />
                <Route path='/editor/:slug' element={<EditArticlePage />} />
                <Route path='/article/:slug' element={<ArticlePage />} />
            </Routes>
        </div>
    );
}

export default Layout;