import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../App.css';
import {
    FaBookmark,
    FaCopy,
    FaFlag,
    FaHeart,
    FaRegBookmark,
    FaRegHeart,
} from 'react-icons/fa';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import {
    PiArrowsClockwiseBold,
    PiArrowsCounterClockwiseBold,
} from 'react-icons/pi';
import { bookMark, heart, reportPost } from '../redux/actions/PostActions';
import { useDispatch, useSelector } from 'react-redux';
import { sharePost } from '../redux/actions/UserActions';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CustomContextMenu = ({
    isVisible,
    onClose,
    targetElement,
    data,
    setData,
    isHeart,
    isShare,
    isBookMark,
    rect,
}) => {
    const dispatch = useDispatch();
    // const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    // const showMessage = (message) => {
    //     messageApi.open({
    //         type: 'success',
    //         content: message,
    //         duration: 1,
    //     });
    // };
    const { success: reportSuccess } = useSelector((state) => state.reportPost);

    const [interactionState, setInteractionState] = useState({
        isHeart: isHeart,
        isShare: isShare,
        isBookmark: isBookMark,
    });

    const [initialLoad, setInitialLoad] = useState(true);

    const [elementPosition, setElementPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    const postDetailsUrl = useMemo(() => {
        const baseUrl = `/posts/details/${data?.id}`;
        return baseUrl;
    }, [data?.id, data?.reply]);

    const handleAction = useCallback(
        (action, id, interactionType) => {
            dispatch(action(id));
            setInteractionState((prevState) => ({
                ...prevState,
                [interactionType]: !prevState[interactionType],
            }));
            setData((prev) => {
                const field =
                    interactionType === 'isHeart'
                        ? 'heart'
                        : interactionType === 'isShare'
                        ? 'share'
                        : 'bookmark';

                if (interactionType === 'isBookmark') {
                    return {
                        ...prev,
                        [field]: !prev[field],
                    };
                }

                const countField = `number_${field}`;
                return {
                    ...prev,
                    [field]: !prev[field],
                    [countField]: prev[countField] + (prev[field] ? -1 : 1),
                };
            });
        },
        [dispatch],
    );

    const handleCopy = useCallback(
        (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(data?.content);
            // showMessage('Copied to clipboard');
        },
        [data],
    );

    const handleSharePost = useCallback(
        (e) => {
            e.stopPropagation();
            if (navigator.share) {
                navigator
                    .share({
                        title: 'Chia sẻ bài viết',
                        text: 'Hãy xem bài viết này!',
                        url: postDetailsUrl,
                    })
                    .then(() => console.log('Chia sẻ thành công!'))
                    .catch((error) =>
                        console.error('Chia sẻ không thành công:', error),
                    );
            } else {
                window.open(postDetailsUrl, '_blank');
            }
        },
        [postDetailsUrl],
    );

    const handleReport = useCallback(
        (e) => {
            e.stopPropagation();
            dispatch(reportPost(data?.id));
            setData((prev) => {
                if (prev.id === data.id) {
                    return {
                        ...prev,
                        report: !prev.report,
                    };
                }
                return prev;
            });
        },
        [dispatch, data],
    );

    useEffect(() => {
        if (reportSuccess) {
            // showMessage('Reported post');
            onClose();
        }
    }, [reportSuccess]);

    useEffect(() => {
        if (!interactionState.isHeart) {
            setInitialLoad(interactionState.isHeart);
        }
    }, [interactionState.isHeart]);

    useEffect(() => {
        if (rect) {
            setElementPosition({
                top: rect.top - 200 < 0 ? rect.top : rect.top - 200,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
        }
    }, [rect]);

    useEffect(() => {
        setInteractionState(() => ({
            isHeart: isHeart,
            isShare: isShare,
            isBookmark: isBookMark,
        }));
    }, [isHeart, isShare, isBookMark]);

    const renderButton = useCallback(
        (text, icon, onClick, borderClass = '') => (
            <button
                className={`w-full flex items-center justify-between dark:text-white px-2 py-3 ${borderClass}`}
                onClick={onClick}
            >
                {text}
                {icon}
            </button>
        ),
        [],
    );

    const renderActionButton = useCallback(
        (Icon, action, interactionType, IconActive) => (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleAction(action, data?.id, interactionType);
                }}
                className="dark:text-white"
            >
                {interactionState[interactionType] ? (
                    <IconActive
                        color={(() => {
                            switch (interactionType) {
                                case 'isHeart':
                                    return 'red';
                                case 'isShare':
                                    return 'green';
                                case 'isBookmark':
                                    return 'purple';
                                default:
                                    return 'purple';
                            }
                        })()}
                    />
                ) : (
                    <Icon />
                )}
            </button>
        ),
        [handleAction, data, interactionState],
    );

    const memoizedContent = useMemo(() => {
        if (
            !isVisible ||
            !targetElement ||
            elementPosition.top <= 0 ||
            elementPosition.left <= 0
        ) {
            return null;
        }

        const { tagName, id, dataset } = targetElement;
        const className = 'bg-white dark:bg-dark2Primary p-3 rounded-lg';

        return (
            <>
                {/* {contextHolder} */}
                <div
                    onClick={onClose}
                    className="fixed top-0 left-0 w-full h-full backdrop-blur-xl bg-black/30 z-[99999999]"
                >
                    <div
                        style={{
                            position: 'absolute',
                            ...elementPosition,
                        }}
                    >
                        <div className="dark:bg-darkPrimary w-[250px] bg-white rounded-lg p-2 mb-3">
                            {renderButton(
                                `Copy text`,
                                <FaCopy />,
                                handleCopy,
                                'border-b-[1px] border-gray-200 dark:border-dark2Primary',
                            )}
                            {renderButton(
                                'Share post',
                                <HiMiniArrowUpTray />,
                                handleSharePost,
                                'border-b-[1px] border-gray-200 dark:border-dark2Primary',
                            )}
                            {renderButton('Report', <FaFlag />, handleReport)}
                        </div>
                        {React.createElement(tagName.toLowerCase(), {
                            className,
                            id,
                            ...dataset,
                            dangerouslySetInnerHTML: {
                                __html: targetElement.innerHTML,
                            },
                            onClick: (e) => {
                                e.stopPropagation();
                                navigate(postDetailsUrl);
                            },
                        })}
                        <div className="flex items-center m-auto w-[90px] py-2 justify-evenly rounded-full bg-white dark:bg-darkPrimary mt-2">
                            <div className={`flex items-center text-gray-400`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction(
                                            heart,
                                            data?.id,
                                            'isHeart',
                                        );
                                    }}
                                    className={`btn heart ${
                                        interactionState.isHeart
                                            ? initialLoad
                                                ? 'initial-active'
                                                : 'active'
                                            : ''
                                    } flex items-center justify-center text-white text-xl w-10 h-10 text-primary-color rounded-full`}
                                ></button>
                            </div>
                            {renderActionButton(
                                PiArrowsClockwiseBold,
                                sharePost,
                                'isShare',
                                PiArrowsCounterClockwiseBold,
                            )}
                            {renderActionButton(
                                FaRegBookmark,
                                bookMark,
                                'isBookmark',
                                FaBookmark,
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }, [
        isVisible,
        targetElement,
        elementPosition,
        interactionState,
        data,
        handleAction,
        onClose,
        renderButton,
        renderActionButton,
    ]);

    return memoizedContent;
};

export default React.memo(CustomContextMenu);
