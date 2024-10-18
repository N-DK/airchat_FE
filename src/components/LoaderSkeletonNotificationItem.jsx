import React from 'react';

export default function LoaderSkeletonNotificationItem() {
    return (
        <div className="flex flex-col w-full">
            <div className="skeleton-loader p-3 px-4 border-b border-gray-200 w-full dark:border-darkPrimary animate-pulse appear-animation duration-300">
                <div className="flex items-start">
                    {/* Skeleton Icon */}
                    <div className="w-5 h-5 mr-4 mt-1 bg-gray-300 dark:bg-darkPrimary rounded-full"></div>

                    <div>
                        {/* Skeleton Avatar */}
                        <div className="w-10 h-10 mb-1 bg-gray-300 dark:bg-darkPrimary rounded-full"></div>

                        {/* Skeleton Name and Content */}
                        <div className="w-48 h-4 bg-gray-300 dark:bg-darkPrimary rounded mb-2"></div>
                        <div className="w-64 h-4 bg-gray-300 dark:bg-darkPrimary rounded"></div>

                        {/* Skeleton Timestamp */}
                        <div className="w-20 h-3 bg-gray-300 dark:bg-darkPrimary rounded mt-2"></div>
                    </div>
                </div>
            </div>
            <div className="skeleton-loader p-3 px-4 border-b border-gray-200 w-full dark:border-darkPrimary animate-pulse appear-animation duration-300">
                <div className="flex items-start">
                    {/* Skeleton Icon */}
                    <div className="w-5 h-5 mr-4 mt-1 bg-gray-300 dark:bg-darkPrimary rounded-full"></div>

                    <div>
                        {/* Skeleton Avatar */}
                        <div className="w-10 h-10 mb-1 bg-gray-300 dark:bg-darkPrimary rounded-full"></div>

                        {/* Skeleton Name and Content */}
                        <div className="w-48 h-4 bg-gray-300 dark:bg-darkPrimary rounded mb-2"></div>
                        <div className="w-64 h-4 bg-gray-300 dark:bg-darkPrimary rounded"></div>

                        {/* Skeleton Timestamp */}
                        <div className="w-20 h-3 bg-gray-300 dark:bg-darkPrimary rounded mt-2"></div>
                    </div>
                </div>
            </div>
            <div className="skeleton-loader p-3 px-4 border-b border-gray-200 w-full dark:border-darkPrimary animate-pulse">
                <div className="flex items-start">
                    {/* Skeleton Icon */}
                    <div className="w-5 h-5 mr-4 mt-1 bg-gray-300 dark:bg-darkPrimary rounded-full"></div>

                    <div>
                        {/* Skeleton Avatar */}
                        <div className="w-10 h-10 mb-1 bg-gray-300 dark:bg-darkPrimary rounded-full"></div>

                        {/* Skeleton Name and Content */}
                        <div className="w-48 h-4 bg-gray-300 dark:bg-darkPrimary rounded mb-2"></div>
                        <div className="w-64 h-4 bg-gray-300 dark:bg-darkPrimary rounded"></div>

                        {/* Skeleton Timestamp */}
                        <div className="w-20 h-3 bg-gray-300 dark:bg-darkPrimary rounded mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
