import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LANGUAGE } from '../constants/language.constant';

const CustomContextMenuDeletePhoto = ({
    isVisible,
    onClose,
    targetElement,
    rect,
    handle,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { language } = useSelector((state) => state.userLanguage);
    const [elementPosition, setElementPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

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

        return (
            <>
                <div
                    onClick={onClose}
                    className="fixed top-0 left-0 w-full h-full backdrop-blur-xl bg-black/30 z-50"
                >
                    <div
                        style={{
                            position: 'absolute',
                            ...elementPosition,
                        }}
                    >
                        <button
                            onClick={() =>
                                handle(id.split('-')[id.split('-').length - 1])
                            }
                            className="dark:bg-dark2Primary flex items-center text-red-500 rounded-xl py-2 px-4 mb-3 float-right"
                        >
                            {LANGUAGE[language]['TITLE_DELETE_PHOTO']}
                            <FaRegTrashAlt className="ml-2" />
                        </button>
                        {React.createElement(tagName.toLowerCase(), {
                            id,
                            ...dataset,
                            dangerouslySetInnerHTML: {
                                __html: targetElement.innerHTML,
                            },
                        })}
                    </div>
                </div>
            </>
        );
    }, [isVisible, targetElement, elementPosition, onClose]);

    return memoizedContent;
};

export default React.memo(CustomContextMenuDeletePhoto);
