import { createContext, useState } from 'react';
import React from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isAddChannel, setIsAddChannel] = useState(false);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [isRecord, setIsRecord] = useState(false);
    const [isRunAuto, setIsRunAuto] = useState(false);
    const [isRunSpeed, setIsRunSpeed] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [recordOption, setRecordOption] = useState('audio');
    const [showInviteFriend, setShowInviteFriend] = useState(false);
    const [showDrawerFollow, setShowDrawerFollow] = useState(false);
    const [showDrawerBlockAccount, setShowDrawerBlockAccount] = useState(false);

    const toggleIsAddChannel = () => setIsAddChannel((prev) => !prev);
    const toggleIsRecord = () => setIsRecord((prev) => !prev);
    const toggleIsEditProfile = () => setIsEditProfile((prev) => !prev);
    const toggleIsRunAuto = () => setIsRunAuto((prev) => !prev);
    const toggleIsFullScreen = () => setIsFullScreen((prev) => !prev);
    const toggleIsRunSpeed = () =>
        setIsRunSpeed((prev) => (prev < 3 ? prev + 1 : 1));
    const toggleRecordOption = (type) => () => setRecordOption(type);
    const toggleShowInviteFriend = () => setShowInviteFriend((prev) => !prev);
    const toggleShowDrawerFollow = () => setShowDrawerFollow((prev) => !prev);
    const toggleShowDrawerBlockAccount = () =>
        setShowDrawerBlockAccount((prev) => !prev);
    return (
        <AppContext.Provider
            value={{
                isAddChannel,
                toggleIsAddChannel,
                isRecord,
                toggleIsRecord,
                isEditProfile,
                toggleIsEditProfile,
                isRunAuto,
                toggleIsRunAuto,
                isRunSpeed,
                toggleIsRunSpeed,
                isFullScreen,
                toggleIsFullScreen,
                recordOption,
                toggleRecordOption,
                showInviteFriend,
                toggleShowInviteFriend,
                showDrawerFollow,
                toggleShowDrawerFollow,
                showDrawerBlockAccount,
                toggleShowDrawerBlockAccount,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
