import { FaAngleLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { RiAddLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAvatar } from "../redux/actions/UserActions";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
} from "../redux/constants/UserConstants";
import React from "react";
export default function SelectAvatar() {
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const dispatch = useDispatch();
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: loadingProfile, isSuccess } = userUpdateProfile;
  const userUpdateAvatar = useSelector((state) => state.userUpdateAvatar);
  const { loading: loadingAvatar } = userUpdateAvatar;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleChangeImg = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    setImageUrl(file);
  };

  const navigateHandle = async () => {
    if (isContinue && imageUrl) {
      dispatch(updateUserAvatar(imageUrl));
    } else if (isContinue) {
      dispatch({ type: USER_UPDATE_PROFILE_SUCCESS });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      navigate(`/selectpermissions`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (image || (userInfo && userInfo?.avatar)) {
      setIsContinue(true);
    }
  }, [image, userInfo]);

  return (
    <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
      <div className="grid grid-cols-3 mt-12 px-6 text-black dark:text-white">
        <button
          onClick={() => navigate("/aboutyou")}
          className="col-span-1 z-10 h-7 md:ml-6 md:h-10 w-7 md:w-10 flex items-center justify-center bg-grayPrimary dark:bg-dark2Primary rounded-full"
        >
          <FaAngleLeft className="md:text-xl" />
        </button>
        <div className="col-span-1 w-full flex justify-center">
          <h5 className="md:text-2xl">Your avatar</h5>
        </div>
      </div>

      <form className="flex flex-col justify-center items-center px-6">
        <label htmlFor="file_input">
          {!image && !userInfo?.avatar ? (
            <div className="relative bg-grayPrimary dark:bg-dark2Primary rounded-full h-32 w-32 flex justify-center items-center">
              <FaUser size="2.3rem" className="text-gray-400" />
              <div className="absolute bottom-0 right-4 bg-bluePrimary rounded-full">
                <RiAddLine size="1.8rem" className=" p-[3px] text-white" />
              </div>
            </div>
          ) : (
            <img
              className="object-cover relative bg-grayPrimary rounded-full h-32 w-32 flex justify-center items-center"
              src={image ? image : userInfo?.avatar}
              alt="Avatar"
            />
          )}
        </label>
        <input onChange={handleChangeImg} hidden type="file" id="file_input" />

        <div className="mt-8 text-center text-[13px] md:text-lg text-gray-400">
          <p>A clear photo featuring your face works best on Airchat.</p>
        </div>
      </form>

      <div className="flex justify-center px-6 mb-9">
        <button
          onClick={() => navigateHandle()}
          className={`text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4 ${
            isContinue
              ? "text-white dark:text-darkPrimary bg-black dark:bg-white"
              : "text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary"
          }`}
        >
          {loadingProfile || loadingAvatar ? (
            <LoadingSpinner />
          ) : (
            <span>Continue</span>
          )}
        </button>
      </div>
    </div>
  );
}
