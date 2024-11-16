import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { BsGeoAlt } from 'react-icons/bs';
import { FaCloudRain, FaWind } from 'react-icons/fa6';
import { WiHumidity } from 'react-icons/wi';
import LoaderSkeletonWeather from './LoaderSkeletonWeather';

const WeatherInfoItem = ({ icon: Icon, value, unit, size = 16 }) => {
    return (
        <p className="font-medium flex flex-col items-center justify-center">
            <Icon size={size} />
            <span className="mt-1">
                <strong className="text-xl">{value}</strong>
                <span className="text-sm text-gray-300">{unit}</span>
            </span>
        </p>
    );
};

const WeatherInfo = ({ weather }) => {
    return (
        <div className="flex items-center justify-between w-full px-10 my-2 mt-3">
            <WeatherInfoItem
                icon={FaWind}
                value={weather?.maxwind_kph}
                unit={'km/h'}
            />
            <WeatherInfoItem
                icon={WiHumidity}
                value={weather?.avghumidity}
                unit={'%'}
                size={20}
            />
            <WeatherInfoItem
                icon={FaCloudRain}
                value={weather?.totalprecip_mm}
                unit={'mm'}
            />
        </div>
    );
};

function WeatherWidget() {
    const { weather, loading } = useSelector((state) => state.userGetWeather);

    const formatTime = (time) => {
        const date = new Date(time);
        const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày (dd)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (mm)
        return `${day}/${month}`; // Trả về dạng dd/mm
    };

    const statusWeather = (avgtemp_c) => {
        if (avgtemp_c >= 28) return 'hot';
        if (avgtemp_c >= 23) return 'warm';
        if (avgtemp_c >= 20) return 'cool';
        return 'hot';
    };

    if (loading || !weather) {
        return <LoaderSkeletonWeather />;
    }

    return (
        <div className="flex justify-center overflow-hidden mt-2 mb-2">
            <div className="">
                <div className="rounded-lg overflow-hidden bg-white shadow-xl">
                    <div
                        id="weather"
                        className={`${statusWeather(
                            weather?.avgtemp_c,
                        )} flex items-center justify-center flex-col`}
                    >
                        <p className="font-medium flex items-center mt-2">
                            <BsGeoAlt className="mr-1" />
                            Ho Chi Minh City
                        </p>
                        <div className="flex items-center my-2">
                            <Avatar
                                src={weather?.condition?.icon}
                                alt="weather"
                                className="w-10 h-10"
                            />
                            <p className="ml-2 font-medium text-xl">
                                <span>{weather?.mintemp_c}°C </span> -{' '}
                                <span className="text-3xl">
                                    {' '}
                                    {weather?.maxtemp_c}°C
                                </span>
                            </p>
                        </div>
                        <p className="font-medium">
                            {weather?.condition?.text}
                        </p>
                        <p>
                            Chance of rain: {weather?.daily_chance_of_rain}% -
                            UV: {weather?.uv}
                        </p>
                        <WeatherInfo weather={weather} />
                    </div>
                    <p className="font-medium text-[15px] px-3 py-3 bg-white dark:bg-darkPrimary dark:text-white">
                        Good day, Ho Chi Minh City weather today{' '}
                        {formatTime(Date.now())}: {weather?.condition?.text}.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WeatherWidget;
