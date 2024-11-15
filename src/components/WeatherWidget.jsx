import React from 'react';
import { useSelector } from 'react-redux';

function WeatherWidget() {
    const { coords } = useSelector((state) => state.userGetWeather);

    return (
        <div>
            WeatherWidget lat: {coords?.lat}, lng: {coords?.lng}
        </div>
    );
}

export default WeatherWidget;
