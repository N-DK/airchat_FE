// Component SkeletonLoader
import React from "react";
const LoaderSkeletonPosts = () => {
  return (
    <div className="flex flex-col w-screen">
      <div className="flex pt-6 md:pt-10 pb-12 md:pb-14 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary animate-pulse">
        {/* Avatar and Ping Animation */}
        <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-gray-200 dark:bg-dark2Primary"></div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="relative bg-white dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3">
            <div className="flex gap-3">
              <div className="h-4 w-20 md:w-32 bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-16 md:w-28 bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-14 md:w-24 bg-gray-200 dark:bg-darkPrimary rounded"></div>
            </div>

            <div className="mt-3 flex flex-col gap-2 md:gap-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
            </div>

            <div className="absolute bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
              <div className="opacity-50 flex items-center gap-3 md:gap-5">
                <div className="h-4 w-12 md:w-20 bg-gray-200 dark:bg-darkPrimary rounded"></div>
                <div className="h-4 w-12 md:w-20 bg-gray-200 dark:bg-darkPrimary rounded"></div>
                <div className="h-4 w-12 md:w-20 bg-gray-200 dark:bg-darkPrimary rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-[6px] border-gray-200 dark:border-dark2Primary flex pt-6 md:pt-10 pb-12 md:pb-14 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary animate-pulse">
        {/* Avatar and Ping Animation */}
        <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-gray-200 dark:bg-dark2Primary"></div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="relative bg-white dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3">
            <div className="flex gap-3">
              <div className="h-4 w-20 md:w-32 bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-16 md:w-28 bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-14 md:w-24 bg-gray-200 dark:bg-darkPrimary rounded"></div>
            </div>

            <div className="mt-3 flex flex-col gap-2 md:gap-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-darkPrimary rounded"></div>
            </div>

            <div className="absolute bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
              <div className="opacity-50 flex items-center gap-3 md:gap-5">
                <div className="h-4 w-12 md:w-20 bg-gray-200 dark:bg-darkPrimary rounded"></div>
                <div className="h-4 w-12 md:w-20 bg-gray-200 dark:bg-darkPrimary rounded"></div>
                <div className="h-4 w-12 md:w-20 bg-gray-200 dark:bg-darkPrimary rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderSkeletonPosts;
