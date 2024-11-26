import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useSearchParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { profile, setLink } from './redux/actions/UserActions';

function PrivateRouter({ comp: Component }) {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { userInfo: userInfoCode } = useSelector((state) => state.userCode);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    useEffect(() => {
        const link = searchParams.get('link');
        if (link) {
            dispatch(setLink(link));
        }
    }, [searchParams]);

    if (!userInfo?.token && !userInfoCode?.token) {
        return <Navigate to="/" />;
    }

    return <Component />;
}

export default PrivateRouter;
