import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getWeather,
    sendWeather,
    setCoords,
} from '../redux/actions/UserActions';

const useLocation = () => {
    const dispatch = useDispatch();
    const { weather, coords } = useSelector((state) => state.userGetWeather);

    useEffect(() => {
        const getCoordinates = () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude: lat, longitude: lng } =
                            position.coords;
                        dispatch(setCoords({ lat, lng }));
                    },
                    (error) => console.error('Lỗi lấy vị trí:', error),
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                    },
                );
            }
        };

        getCoordinates();

        const geoInterval = setInterval(() => {
            getCoordinates();
        }, 10000);

        return () => clearInterval(geoInterval);
    }, [dispatch]);

    useEffect(() => {
        if (coords?.lat && coords?.lng) {
            if (!weather) dispatch(getWeather(coords?.lat, coords?.lng));
        }
    }, [coords?.lat, coords?.lng, dispatch, weather]);

    // useEffect(() => {
    //     if (coords?.lat && coords?.lng) {
    //         console.log('coords', coords);

    //         // Thiết lập một interval để gửi dữ liệu mỗi 10 giây
    //         const interval = setInterval(() => {
    //             dispatch(sendWeather(coords));
    //         }, 10000); // 10 giây

    //         // Dọn dẹp interval khi `coords` thay đổi hoặc khi component bị hủy
    //         return () => clearInterval(interval);
    //     }
    // }, [coords?.lat, coords?.lng, dispatch]);

    // useEffect(() => {
    //     if (coords) {
    //         console.log('coords', coords);

    //         const now = new Date();
    //         let sevenAm = new Date(
    //             now.getFullYear(),
    //             now.getMonth(),
    //             now.getDate(),
    //             7,
    //         );

    //         // Nếu đã qua 7h sáng, thiết lập cho 7h sáng ngày hôm sau
    //         if (now >= sevenAm) {
    //             sevenAm = new Date(sevenAm.getTime() + 24 * 60 * 60 * 1000);
    //         }

    //         const timeToSevenAm = sevenAm.getTime() - now.getTime();
    //         console.log('timeToSevenAm', timeToSevenAm);

    //         const timeout = setTimeout(() => {
    //             dispatch(sendWeather(coords));
    //         }, timeToSevenAm);

    //         // Dọn dẹp timeout khi `coords` thay đổi
    //         return () => clearTimeout(timeout);
    //     }
    // }, [coords, dispatch]);
};

export default useLocation;
