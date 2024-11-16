import React from 'react';
import { Skeleton } from 'antd';

const LoaderSkeletonWeather = () => {
    return (
        <div className="flex justify-center overflow-hidden my-2 w-full">
            <div className="w-full">
                <div className="rounded-lg w-full overflow-hidden bg-white dark:bg-darkPrimary shadow-xl">
                    <div
                        id="weather"
                        className="flex w-full items-center justify-center flex-col py-6 bg-gray-200 animate-pulse"
                    >
                        <div className="font-medium flex items-center mt-2">
                            <Skeleton.Input
                                style={{ width: 150 }}
                                active
                                size="small"
                            />
                        </div>
                        <div className="flex items-center my-2">
                            <Skeleton.Avatar active size={40} shape="circle" />
                            <Skeleton.Input
                                style={{ width: 120, marginLeft: 10 }}
                                active
                                size="small"
                            />
                        </div>
                        <div className="font-medium">
                            <Skeleton.Input
                                style={{ width: 180 }}
                                active
                                size="small"
                            />
                        </div>
                        <div>
                            <Skeleton.Input
                                style={{ width: 220 }}
                                active
                                size="small"
                            />
                        </div>
                        <div className="flex items-center justify-between px-10 my-2 mt-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <Skeleton.Avatar
                                        active
                                        size={30}
                                        shape="circle"
                                    />
                                    <Skeleton.Input
                                        style={{ width: 60, marginTop: 10 }}
                                        active
                                        size="small"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="font-medium text-[15px] px-3 py-2 bg-white dark:bg-darkPrimary dark:text-white">
                        <Skeleton.Input
                            style={{ width: 200 }}
                            active
                            size="small"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoaderSkeletonWeather;
