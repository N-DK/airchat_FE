import { FaAngleLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { IoMicOutline } from "react-icons/io5";
import { HiOutlineCamera } from "react-icons/hi";
import { TiContacts } from "react-icons/ti";
import { SiAudiomack } from "react-icons/si";
import React from "react";
export default function SelectPermissions() {
  const [permissionArr, setPermissionsArr] = useState([
    {
      icon: <IoMicOutline size="1.7rem" />,
      name: "Microphone",
      id: "microphone",
      isSelect: false,
    },
    {
      icon: <HiOutlineCamera size="1.7rem" />,
      name: "Camera",
      id: "camera",
      isSelect: false,
    },
    {
      icon: <TiContacts size="1.7rem" />,
      name: "Contacts",
      id: "contacts",
      isSelect: false,
    },
    {
      icon: <SiAudiomack size="1.7rem" />,
      name: "Live Transcriptions",
      id: "liveTranscriptions",
      isSelect: false,
    },
  ]);
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();

  const navigateHandle = () => {
    if (isContinue) {
      navigate(`/selectinterested`);
    }
  };

  const skipHandle = () => {
    navigate("/selectinterested");
  };

  const toggleSelect = (id) => {
    const updatedArr = permissionArr.map((item) =>
      item.id === id ? { ...item, isSelect: !item.isSelect } : item
    );
    setPermissionsArr(updatedArr);
  };

  const allPermissionsGranted = () => {
    return permissionArr.every((item) => item.isSelect);
  };

  useEffect(() => {
    setIsContinue(allPermissionsGranted());
  }, [permissionArr]);

  return (
    <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
      <div className="px-6">
        <div className="grid grid-cols-5 mt-12 text-black dark:text-white">
          <button
            onClick={() => navigate("/selectavatar")}
            className="flex justify-center items-center col-span-1 h-7 md:ml-6 md:h-10 w-7 md:w-10 bg-grayPrimary dark:bg-dark2Primary rounded-full"
          >
            <FaAngleLeft className="md:text-xl" />
          </button>
          <div className="flex justify-center col-span-3">
            <h5 className="md:text-2xl">Permissions Needed</h5>
          </div>
          <button
            onClick={() => skipHandle()}
            className="col-span-1 md:mr-6 flex justify-end items-center text-[15px] md:text-lg text-gray-400"
          >
            Skip
          </button>
        </div>

        <div className="flex flex-col items-center gap-7 mt-28">
          {permissionArr.map((item, i) => (
            <label
              key={i}
              className="text-black dark:text-white flex justify-between items-center bg-grayPrimary dark:bg-dark2Primary w-full md:w-2/3 lg:w-1/3 rounded-full px-5 py-3"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              <input
                className="bg-inherit border-none outline-none text-[17px] font-medium"
                type="checkbox"
                hidden
                onChange={() => toggleSelect(item.id)}
              />
              <div
                className={`flex justify-center items-center h-[22px] w-[22px] rounded-full ${
                  item.isSelect
                    ? "bg-bluePrimary dark:bg-darkPrimary"
                    : "bg-gray-300 dark:bg-darkPrimary"
                }`}
              >
                {item.isSelect && (
                  <FaCheck className="text-[12px] text-white" />
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center px-6 mb-9">
        <button
          onClick={() => navigateHandle()}
          className={`text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4 ${
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
