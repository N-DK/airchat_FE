import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updatePost } from '../redux/actions/PostActions';
import { IoCloseCircleOutline } from 'react-icons/io5';

const LinkPreviewComponent = ({ post_id, url, setData }) => {
    const [preview, setPreview] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isFirstRender = useRef(true);
    useEffect(() => {
        const fetchLinkPreview = async (url) => {
            const apiKey = '757012f243f5896e3548199d85b8108b';
            const response = await fetch(
                `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(
                    url,
                )}`,
            );
            const data = await response.json();
            if (data.error) return;
            if (isFirstRender.current) {
                isFirstRender.current = false;
            } else {
                dispatch(updatePost(post_id, { url }));
            }
            setPreview(data);
        };

        fetchLinkPreview(url);
    }, [url]);

    return (
        preview && (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = preview.url;
                }}
                className="grid"
            >
                <div className="rounded-lg dark:bg-darkPrimary overflow-hidden mt-1 relative">
                    <figure>
                        <img src={preview.image} alt="Preview" />
                    </figure>
                    <div className="p-2 border-t border-gray-500">
                        <p className="dark:text-white text-[12px]">
                            {preview.title}
                        </p>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-2">
                            {preview.description}
                        </p>
                    </div>
                    <button
                        className="absolute top-3 right-3 p-1 dark:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(updatePost(post_id, { url: null }));
                            setData((prev) => ({ ...prev, url: null }));
                        }}
                    >
                        <IoCloseCircleOutline size={20} />
                    </button>
                </div>
            </div>
        )
    );
};

export default LinkPreviewComponent;
