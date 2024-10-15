import { createContext, useState } from 'react';
import React from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isAddChannel, setIsAddChannel] = useState(false);
    const [isEditChannel, setIsEditChannel] = useState(false);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [isRecord, setIsRecord] = useState(false);
    const [isRunAuto, setIsRunAuto] = useState(false);
    const [isRunSpeed, setIsRunSpeed] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [recordOption, setRecordOption] = useState('audio');
    const [showInviteFriend, setShowInviteFriend] = useState(false);
    const [showDrawerFollow, setShowDrawerFollow] = useState(false);
    const [showDrawerBlockAccount, setShowDrawerBlockAccount] = useState(false);
    const [showDrawerNewDirect, setShowDrawerNewDirect] = useState(false);
    const [showDrawerNotification, setShowDrawerNotification] = useState(false);
    const [showDrawerChangePassword, setShowDrawerChangePassword] =
        useState(false);
    const [newMessageFromFooter, setNewMessageFromFooter] = useState('');

    const toggleIsAddChannel = () => setIsAddChannel((prev) => !prev);
    const toggleIsEditChannel = () => setIsEditChannel((prev) => !prev);
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
    const toggleShowDrawerNewDirect = () =>
        setShowDrawerNewDirect((prev) => !prev);
    const toggleShowDrawerNotification = () =>
        setShowDrawerNotification((prev) => !prev);
    const toggleShowDrawerChangePassword = () => {
        setShowDrawerChangePassword((prev) => !prev);
    };
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
                showDrawerNewDirect,
                toggleShowDrawerNewDirect,
                isEditChannel,
                toggleIsEditChannel,
                showDrawerNotification,
                toggleShowDrawerNotification,
                showDrawerChangePassword,
                toggleShowDrawerChangePassword,
                newMessageFromFooter,
                setNewMessageFromFooter,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
