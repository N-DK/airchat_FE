import React, { useEffect, useRef, useState } from 'react';
import { IoEyeOffSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { LANGUAGE } from '../constants/language.constant';
import { BASE_URL } from '../constants/api.constant';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { setPostActive } from '../redux/actions/PostActions';
import { setObjectActive } from '../redux/actions/SurfActions';

function HiddenPostComponent({
    handleUndo,
    data,
    userInfo,
    className = '',
    contentsChattingRef,
}) {
    const dispatch = useDispatch();

    const [isVisible, setIsVisible] = useState(false);

    const { language } = useSelector((state) => state.userLanguage);

    const divRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                threshold: [0.1],
                rootMargin: `-${Math.max(
                    window.innerHeight * 0.1,
                    100,
                )}px 0px -${Math.max(window.innerHeight * 0.75, 400)}px 0px`,
            },
        );

        if (divRef?.current) {
            observer.observe(divRef.current);
        }

        return () => {
            if (divRef?.current) {
                observer.unobserve(divRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            dispatch(setPostActive(null));
            dispatch(
                setObjectActive({
                    post: null,
                    audio: null,
                    element: divRef.current,
                    parent: contentsChattingRef?.current,
                    video: null,
                    bonus: 0,
                }),
            );
        }
    }, [isVisible, contentsChattingRef]);

    return (
        <div ref={divRef} className={`w-full ${className}`}>
            <p className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <IoEyeOffSharp className="mr-2 text-bluePrimary" />
                {LANGUAGE[language].HIDDEN}
            </p>
            <div className="flex items-center dark:text-white mt-1 pb-2 border-b dark:border-dark2Primary">
                <p className="flex-1">
                    {LANGUAGE[language].HIDDEN_POST_DESCRIPTION}
                </p>
                <button
                    onClick={handleUndo}
                    className="w-20 ml-1 py-2 px-3 rounded-lg bg-gray-300 dark:bg-dark2Primary"
                >
                    {LANGUAGE[language].UNDO}
                </button>
            </div>
            <div className="flex items-center mt-2">
                <Link
                    to={
                        data?.user_id === userInfo?.id
                            ? '/profile'
                            : `/profile/${data?.user_id}`
                    }
                >
                    <Avatar
                        src={`${BASE_URL}${data?.avatar}`}
                        alt="avatar"
                        className="mr-2"
                    />
                </Link>
                <p className="dark:text-white">
                    {LANGUAGE[language].SNOOZE}{' '}
                    <span className="font-medium">{data?.name}</span>{' '}
                    {LANGUAGE[language].FOR} 30 {LANGUAGE[language].DAY}
                </p>
            </div>
        </div>
    );
}
export default HiddenPostComponent;
