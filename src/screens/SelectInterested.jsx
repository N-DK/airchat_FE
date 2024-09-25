import { FaAngleLeft } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
export default function SelectInterested() {
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
  const [interestedArr, setInterestedArr] = useState([
    { name: "TV & Movies", isSelect: false, id: "tv_and_movies" },
    { name: "Travel", isSelect: false, id: "travel" },
    { name: "Technology", isSelect: false, id: "technology" },
    {
      name: "Science & Education",
      isSelect: false,
      id: "science_and_education",
    },
    { name: "Health & Fitness", isSelect: false, id: "health_and_fitness" },
    { name: "Gaming", isSelect: false, id: "gaming" },
    { name: "Music", isSelect: false, id: "music" },
    { name: "Memes", isSelect: false, id: "memes" },
    { name: "Food & Drinks", isSelect: false, id: "food_and_drinks" },
    { name: "Fashion", isSelect: false, id: "fashion" },
    { name: "Chit chat", isSelect: false, id: "chit_chat" },
    { name: "Cars", isSelect: false, id: "cars" },
    { name: "Sports", isSelect: false, id: "sports" },
    { name: "Photography", isSelect: false, id: "photography" },
    { name: "Art & Design", isSelect: false, id: "art_and_design" },
    { name: "Books & Literature", isSelect: false, id: "books_and_literature" },
    { name: "Business", isSelect: false, id: "business" },
    { name: "Cooking", isSelect: false, id: "cooking" },
    { name: "DIY & Crafts", isSelect: false, id: "diy_and_crafts" },
    { name: "Fitness & Yoga", isSelect: false, id: "fitness_and_yoga" },
    { name: "History", isSelect: false, id: "history" },
    { name: "Home & Garden", isSelect: false, id: "home_and_garden" },
    { name: "Language Learning", isSelect: false, id: "language_learning" },
    { name: "Outdoors & Nature", isSelect: false, id: "outdoors_and_nature" },
    { name: "Parenting", isSelect: false, id: "parenting" },
    { name: "Pets & Animals", isSelect: false, id: "pets_and_animals" },
    { name: "Politics", isSelect: false, id: "politics" },
    { name: "Relationships", isSelect: false, id: "relationships" },
    { name: "Self Improvement", isSelect: false, id: "self_improvement" },
    { name: "Spirituality", isSelect: false, id: "spirituality" },
    { name: "Travel & Adventure", isSelect: false, id: "travel_and_adventure" },
    { name: "Writing", isSelect: false, id: "writing" },
    { name: "Fitness & Wellness", isSelect: false, id: "fitness_and_wellness" },
  ]);

  const navigateHandle = () => {
    if (isContinue) {
      navigate(`/chatting`);
    }
  };

  const toggleSelect = (id) => {
    const updatedArr = interestedArr.map((item) =>
      item.id === id ? { ...item, isSelect: !item.isSelect } : item
    );
    setInterestedArr(updatedArr);
    setIsContinue(updatedArr.some((item) => item.isSelect));
  };

  return (
    <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
      <div className="grid grid-cols-6 px-6 pt-12">
        <button
          onClick={() => navigate("/selectpermissions")}
          className="text-black dark:text-white flex justify-center items-center h-7 md:ml-6 md:h-10 w-7 md:w-10 col-span-1 bg-grayPrimary dark:bg-dark2Primary rounded-full"
        >
          <FaAngleLeft className="md:text-xl" />
        </button>
        <div className="text-black dark:text-white col-span-4 top-0 flex flex-col items-center">
          <h5 className="text-base md:text-2xl">
            What are you interested in ?
          </h5>
          <p className="text-gray-400 text-[15px] md:text-xl">
            Select at least 1 interest
          </p>
        </div>
        <button
          onClick={() => navigate("/chatting")}
          className="col-span-1 flex justify-end md:mr-6 text-[15px] md:text-lg text-gray-400"
        >
          Skip
        </button>
      </div>

      <div className="px-6 md:px-32 lg:px-60 mt-16 mb-2 overflow-auto scrollbar-none flex flex-wrap gap-x-5 gap-y-[11px]">
        {interestedArr.map((item, i) => (
          <button
            key={i}
            onClick={() => toggleSelect(item.id)}
            className={`px-5 py-[14px] rounded-full ${
              item.isSelect
                ? "text-grayPrimary bg-black dark:text-black dark:bg-white"
                : " text-black bg-grayPrimary dark:text-gray-200 dark:bg-dark2Primary"
            }`}
          >
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-center px-6">
        <button
          onClick={() => navigateHandle()}
          className={`mb-10 mt-2 text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4 ${
            isContinue
              ? "text-white dark:text-darkPrimary bg-black dark:bg-white"
              : "text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
