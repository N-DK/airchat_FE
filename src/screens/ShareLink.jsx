import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SET_LINK } from '../redux/constants/UserConstants';
import { setLink } from '../redux/actions/UserActions';

function ShareLink() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    useEffect(() => {
        const link = searchParams.get('link');
        if (link) {
            dispatch(setLink(link));
            // window.location.href = `talkieapp://url?link=${encodeURIComponent(
            //     link,
            // )}`;

            setTimeout(() => {
                // navigate('/chatting');
                // navigate(link);
                // window.open(`talkieapp://url?link=${encodeURIComponent(link)}`);
                // dispatch(setLink(null));
                const url = `talkieapp://url?link=${encodeURIComponent(
                    'https://izma.transtechvietnam.com' + link,
                )}`;
                window.location.href = url;
            }, 1000);
        } else {
            console.error('Không tìm thấy link để chia sẻ.');
        }
    }, [searchParams]);

    return (
        <div className="appear-animation duration-300 fixed top-0 flex bg-slatePrimary dark:bg-darkPrimary items-center justify-center w-screen h-screen z-50">
            <div className="flex items-center justify-center">
                <CgSpinner size={32} className="animate-spin" />
            </div>
        </div>
    );
}

export default ShareLink;
