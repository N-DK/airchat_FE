// Component SkeletonLoader
import React from "react";
const LoaderSkeletonMenuBar = () => {
  return (
    <div className="flex gap-3 h-9">
      <div className="bg-gray-200 dark:bg-dark2Primary w-24 rounded-full"></div>
      <div className="bg-gray-200 dark:bg-dark2Primary w-24 rounded-full"></div>
      <div className="bg-gray-200 dark:bg-dark2Primary w-24 rounded-full"></div>
      <div className="bg-gray-200 dark:bg-dark2Primary w-24 rounded-full"></div>
    </div>
  );
};

export default LoaderSkeletonMenuBar;
