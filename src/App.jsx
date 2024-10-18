import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import AboutYou from './screens/AboutYou';
import SelectAvatar from './screens/SelectAvatar';
import SelectPermissions from './screens/SelectPermissions';
import SelectInterested from './screens/SelectInterested';
import Details from './screens/Details';
import SeeAll from './screens/SeeAll';
import Notifications from './screens/Notifications';
import Messages from './screens/Messages';
import Profile from './screens/Profile';
import Chatting from './screens/Chatting';
import Settings from './screens/Settings';
import PostsChannel from './screens/PostsChannel';
import PrivateRouter from './PrivateRouter';
import { useSelector } from 'react-redux';
import LogInPhoneNumber from './screens/LogInPhoneNumber';
import LogInEmail from './screens/LogInEmail';
import EnterCodePhoneNumber from './screens/EnterCodePhoneNumber';
import EnterCodeEmail from './screens/EnterCodeEmail';
import Login from './screens/Login';
import React from 'react';
import ChatRoom from './screens/ChatRoom';
import SearchScreen from './screens/SearchScreen';
import PrivacyModal from './components/ModalPolicy';
import './App.css';

function App() {
    const userTheme = useSelector((state) => state.userTheme);
    const { theme } = userTheme;

    return (
        <>
            <div className={`${theme == 'dark' ? 'dark' : ''}`}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/login/phonenumber"
                            element={<LogInPhoneNumber />}
                        />
                        <Route path="/login/email" element={<LogInEmail />} />
                        <Route
                            path="/entercode/phonenumber"
                            element={<EnterCodePhoneNumber />}
                        />
                        <Route
                            path="/entercode/email"
                            element={<EnterCodeEmail />}
                        />

                        <Route
                            path="/aboutyou"
                            element={<PrivateRouter comp={AboutYou} />}
                        />
                        <Route
                            path="/selectavatar"
                            element={<PrivateRouter comp={SelectAvatar} />}
                        />
                        <Route
                            path="/selectpermissions"
                            element={<PrivateRouter comp={SelectPermissions} />}
                        />
                        <Route
                            path="/selectinterested"
                            element={<PrivateRouter comp={SelectInterested} />}
                        />
                        <Route
                            path="/chatting"
                            element={<PrivateRouter comp={Chatting} />}
                        />
                        <Route
                            path="/seeall"
                            element={<PrivateRouter comp={SeeAll} />}
                        />
                        <Route
                            path="/search"
                            element={<PrivateRouter comp={SearchScreen} />}
                        />
                        <Route
                            path="/notifications"
                            element={<PrivateRouter comp={Notifications} />}
                        />
                        <Route
                            path="/messages"
                            element={<PrivateRouter comp={Messages} />}
                        />
                        <Route
                            path="/messages/t/:id"
                            element={<PrivateRouter comp={ChatRoom} />}
                        />
                        <Route
                            path="/profile"
                            element={<PrivateRouter comp={Profile} />}
                        />
                        <Route
                            path="/profile/:stranger_id"
                            element={<PrivateRouter comp={Profile} />}
                        />
                        <Route
                            path="/settings"
                            element={<PrivateRouter comp={Settings} />}
                        />
                        <Route
                            path="/posts/details/:id"
                            element={<PrivateRouter comp={Details} />}
                        />
                        <Route
                            path="/channel/:id"
                            element={<PrivateRouter comp={PostsChannel} />}
                        />
                    </Routes>
                </BrowserRouter>
            </div>
            {/* <PrivacyModal /> */}
        </>
    );
}

export default App;
