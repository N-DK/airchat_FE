import { FaAngleLeft } from "react-icons/fa6";
import iconVietnam from "../assets/vietnam-icon.webp";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { useDispatch } from "react-redux";
import { CHECK_NUMBER_PHONE_SUCCESS } from "../redux/constants/UserConstants";
import React from "react";


export default function LogInPhoneNumber() {
  const inputRef = useRef(null);
  const [numberPhone, setNumberPhone] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] = useState("");
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const firebaseConfig = {
    apiKey: "AIzaSyAjFLBZ2mJ5qx6DsIv8Nt-KCSCI1Ejof1Y",
    authDomain: "airchat-fcd20.firebaseapp.com",
    projectId: "airchat-fcd20",
    storageBucket: "airchat-fcd20.appspot.com",
    messagingSenderId: "902104670916",
    appId: "1:902104670916:web:8794eccd5aa771ad791f91",
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleInputPhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.split("").length < 10) {
      setNumberPhone(value);
    }
  };

  const sendOTP = () => {
    const phoneNumber = `+84${numberPhone}`;
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        dispatch({ type: CHECK_NUMBER_PHONE_SUCCESS, payload: numberPhone });
        // navigate("/entercode");
      })
      .catch(function (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP");
      });
  };

  useEffect(() => {
    if (numberPhone.split("").length === 9) {
      setIsContinue(true);
    } else {
      setIsContinue(false);
    }
  }, [numberPhone]);

  useEffect(() => {
    const recaptcha = new RecaptchaVerifier(
      "send-otp",
      {
        size: "invisible",
        callback: function (response) {},
      },
      auth
    );
    setRecaptchaVerifier(recaptcha);
    return () => {
      recaptcha.clear();
    };
  }, []);

  return (
    <div className="flex flex-col justify-between h-screen bg-white dark:bg-darkPrimary">
      <div className="px-6">
        <div className="grid grid-cols-3 mt-12 text-black dark:text-white">
          <button
            onClick={() => navigate("/")}
            className="col-span-1 h-7 md:ml-6 md:h-10 w-7 md:w-10 flex items-center justify-center bg-grayPrimary dark:bg-dark2Primary rounded-full"
          >
            <FaAngleLeft className="md:text-xl" />
          </button>
          <div className="col-span-1 w-full flex justify-center">
            <h5 className="md:text-2xl">Welcome In</h5>
          </div>
        </div>

        <div className="flex flex-col gap-6 justify-center items-center mt-28">
          <div className="w-full md:w-2/3 lg:w-1/3 flex gap-3 md:gap-12 bg-grayPrimary dark:bg-dark2Primary justify-between items-center rounded-full px-12 md:px-16 py-4">
            <button className="flex items-center gap-2">
              <img src={iconVietnam} className="w-6" alt="" />
              <span className="font-medium text-lg text-black dark:text-white">
                +84
              </span>
            </button>
            <input
              className=" text-black dark:text-white bg-inherit w-3/5 border-none outline-none text-[17px] font-medium"
              placeholder="123 456 789"
              ref={inputRef}
              type="text"
              value={numberPhone}
              onChange={handleInputPhoneChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center px-6 mb-9">
        <button
          id="send-otp"
          onClick={() => isContinue && sendOTP()}
          className={`text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full py-4 ${
            isContinue
              ? "text-white dark:text-darkPrimary bg-black dark:bg-white"
              : "text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary"
          }`}
        >
          <span>Continue</span>
        </button>
      </div>
    </div>
  );
}
