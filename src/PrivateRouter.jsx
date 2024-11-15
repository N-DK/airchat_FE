import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import React from 'react';
import { profile } from './redux/actions/UserActions';
import useLocation from './hooks/useLocation';

function PrivateRouter({ comp: Component }) {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { userInfo: userInfoCode } = useSelector((state) => state.userCode);

    useLocation();

    if (!userInfo?.token && !userInfoCode?.token) {
        return <Navigate to="/" />;
    }

    return <Component />;
}

export default PrivateRouter;
