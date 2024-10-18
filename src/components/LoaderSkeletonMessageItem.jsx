import React from 'react';

export default function LoaderSkeletonMessageItem() {
    return (
        <>
            <div className="skeleton-loader flex items-center py-3 w-full relative appear-animation">
                {/* Skeleton Avatar */}
                <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-darkPrimary animate-pulse mr-2"></div>

                {/* Skeleton Text */}
                <div className="flex-1 space-y-2">
                    {/* Skeleton Name and Timestamp */}
                    <div className="flex items-center">
                        <div className="w-24 h-4 bg-gray-300 dark:bg-darkPrimary rounded animate-pulse"></div>
                        <div className="w-16 h-3 bg-gray-300 dark:bg-darkPrimary rounded animate-pulse ml-2"></div>
                    </div>

                    {/* Skeleton Message */}
                    <div className="w-[70%] h-5 bg-gray-300 dark:bg-darkPrimary rounded animate-pulse"></div>
                </div>
            </div>
            <div className="skeleton-loader flex items-center py-3 w-full relative appear-animation">
                {/* Skeleton Avatar */}
                <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-darkPrimary animate-pulse mr-2"></div>

                {/* Skeleton Text */}
                <div className="flex-1 space-y-2">
                    {/* Skeleton Name and Timestamp */}
                    <div className="flex items-center">
                        <div className="w-24 h-4 bg-gray-300 dark:bg-darkPrimary rounded animate-pulse"></div>
                        <div className="w-16 h-3 bg-gray-300 dark:bg-darkPrimary rounded animate-pulse ml-2"></div>
                    </div>

                    {/* Skeleton Message */}
                    <div className="w-[70%] h-5 bg-gray-300 dark:bg-darkPrimary rounded animate-pulse"></div>
                </div>
            </div>
        </>
    );
}
