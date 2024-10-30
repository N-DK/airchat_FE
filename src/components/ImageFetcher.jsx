import React, { useEffect, useState } from 'react';
import { fetchImageFromUrl } from '../utils/fetchImageFromUrl.utils';

const ImageFetcher = ({ imageUrl }) => {
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        const getImage = async () => {
            const fetchedImage = await fetchImageFromUrl(imageUrl);
            setImgSrc(fetchedImage);
        };

        getImage();
    }, [imageUrl]);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden my-3">
            {imgSrc ? (
                <img
                    className="appear-animation duration-300"
                    src={imgSrc}
                    alt="Fetched from URL"
                />
            ) : (
                <div className="animate-pulse w-[200px] h-[85px] rounded-xl bg-gray-300 dark:bg-grayPrimary" />
            )}
        </div>
    );
};

export default ImageFetcher;
