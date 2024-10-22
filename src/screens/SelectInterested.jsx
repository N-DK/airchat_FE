import { FaAngleLeft } from 'react-icons/fa6';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { LANGUAGE } from '../constants/language.constant';
export default function SelectInterested() {
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const [interestedArr, setInterestedArr] = useState([
        {
            'name-en-US': 'TV & Movies',
            'name-vi-VN': 'Phim & TV',
            isSelect: false,
            id: 'tv_and_movies',
        },
        {
            'name-en-US': 'Travel',
            'name-vi-VN': 'Du lịch',
            isSelect: false,
            id: 'travel',
        },
        {
            'name-en-US': 'Science & Education',
            'name-vi-VN': 'Khoa học & Giáo dục',
            isSelect: false,
            id: 'science_and_education',
        },
        {
            'name-en-US': 'Health & Fitness',
            'name-vi-VN': 'Sức khỏe & Thể hình',
            isSelect: false,
            id: 'health_and_fitness',
        },
        {
            'name-en-US': 'Gaming',
            'name-vi-VN': 'Trò chơi',
            isSelect: false,
            id: 'gaming',
        },
        {
            'name-en-US': 'Music',
            'name-vi-VN': 'Âm nhạc',
            isSelect: false,
            id: 'music',
        },
        {
            'name-en-US': 'Memes',
            'name-vi-VN': 'Memes',
            isSelect: false,
            id: 'memes',
        },
        {
            'name-en-US': 'Food & Drinks',
            'name-vi-VN': 'Đồ ăn & Uống',
            isSelect: false,
            id: 'food_and_drinks',
        },
        {
            'name-en-US': 'Art & Design',
            'name-vi-VN': 'Nghệ thuật & Thiết kế',
            isSelect: false,
            id: 'art_and_design',
        },
        {
            'name-en-US': 'Books & Literature',
            'name-vi-VN': 'Sách & Văn học',
            isSelect: false,
            id: 'books_and_literature',
        },
        {
            'name-en-US': 'Home & Garden',
            'name-vi-VN': 'Nhà & Vườn',
            isSelect: false,
            id: 'home_and_garden',
        },
        {
            'name-en-US': 'Language Learning',
            'name-vi-VN': 'Học ngoại ngữ',
            isSelect: false,
            id: 'language_learning',
        },
        {
            'name-en-US': 'Self Improvement',
            'name-vi-VN': 'Tự cải thiện',
            isSelect: false,
            id: 'self_improvement',
        },
        {
            'name-en-US': 'Spirituality',
            'name-vi-VN': 'Tâm linh',
            isSelect: false,
            id: 'spirituality',
        },
        {
            'name-en-US': 'Travel & Adventure',
            'name-vi-VN': 'Du lịch & Thám hiểm',
            isSelect: false,
            id: 'travel_and_adventure',
        },
        {
            'name-en-US': 'Fitness & Wellness',
            'name-vi-VN': 'Sức khỏe & Thể hình',
            isSelect: false,
            id: 'fitness_and_wellness',
        },
    ]);

    const navigateHandle = () => {
        if (isContinue) {
            navigate(`/chatting`);
        }
    };

    const toggleSelect = (id) => {
        const updatedArr = interestedArr.map((item) =>
            item.id === id ? { ...item, isSelect: !item.isSelect } : item,
        );
        setInterestedArr(updatedArr);
        setIsContinue(updatedArr.some((item) => item.isSelect));
    };

    const { language } = useSelector((state) => state.userLanguage);

    return (
        <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
            <div className="grid grid-cols-6 px-6 pt-12">
                <button
                    onClick={() => navigate('/selectpermissions')}
                    className="text-black dark:text-white flex justify-center items-center h-7 md:ml-6 md:h-10 w-7 md:w-10 col-span-1 bg-grayPrimary dark:bg-dark2Primary rounded-full"
                >
                    <FaAngleLeft className="md:text-xl" />
                </button>
                <div className="text-black dark:text-white col-span-4 top-0 flex flex-col items-center">
                    <h5 className="text-base md:text-2xl">
                        {LANGUAGE[language].WHAT_ARE_YOU_INTERESTED_IN}
                    </h5>
                    <p className="text-gray-400 text-[15px] md:text-xl">
                        {LANGUAGE[language].SELECT_AT_LEAST_1_INTEREST}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/chatting')}
                    className="col-span-1 flex justify-end md:mr-6 text-[15px] md:text-lg text-gray-400"
                >
                    {LANGUAGE[language].SKIP}
                </button>
            </div>

            <div className="px-6 md:px-32 lg:px-60 mt-16 mb-2 overflow-auto scrollbar-none flex flex-wrap gap-x-5 gap-y-[11px]">
                {interestedArr.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => toggleSelect(item.id)}
                        className={`px-5 py-[14px] rounded-full ${
                            item.isSelect
                                ? 'text-grayPrimary bg-black dark:text-black dark:bg-white'
                                : ' text-black bg-grayPrimary dark:text-gray-200 dark:bg-dark2Primary'
                        }`}
                    >
                        <span className="font-medium">
                            {item[`name-${language}`]}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex justify-center px-6">
                <button
                    onClick={() => navigateHandle()}
                    className={`mb-10 mt-2 text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4 ${
                        isContinue
                            ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                            : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                    }`}
                >
                    {LANGUAGE[language].CONTINUE}
                </button>
            </div>
        </div>
    );
}
