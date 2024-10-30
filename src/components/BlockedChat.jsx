import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { block, reportAcc } from '../redux/actions/UserActions';
import { LANGUAGE } from '../constants/language.constant';
import { USER_REPORT_ACC_RESET } from '../redux/constants/UserConstants';

const NotifyText = ({ message, show }) => {
    return (
        <div
            className={`bg-white z-[99999999] absolute left-1/2 transform -translate-x-1/2 w-auto dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
                show ? 'translate-y-0 mt-3' : '-translate-y-full'
            }`}
        >
            <h6 className="text-black dark:text-white">{message}</h6>
        </div>
    );
};

function BlockedChat({ user, isBlockYou }) {
    const dispatch = useDispatch();
    const { language } = useSelector((state) => state.userLanguage);
    const { report_acc } = useSelector((state) => state.userReportAcc);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');

    const handleUnblock = useCallback(
        (id) => {
            dispatch(block(id, 'unblock'));
        },
        [dispatch],
    );

    const handleReport = useCallback(
        (id) => {
            dispatch(reportAcc(id));
        },
        [dispatch],
    );

    useEffect(() => {
        if (report_acc?.results && report_acc?.message === 'report success') {
            dispatch({
                type: USER_REPORT_ACC_RESET,
            });
            setShowNotify(true);
            setNotifyMessage(LANGUAGE[language].REPORT_SUCCESS);
            setTimeout(() => setShowNotify(false), 1200);
        }
    }, [report_acc]);

    return (
        <>
            <div className="flex flex-col items-center justify-center py-4 bg-slatePrimary dark:bg-darkPrimary px-3">
                <p className="dark:text-white">
                    {!isBlockYou
                        ? LANGUAGE[language].YOU_HAVE_BLOCKED
                        : LANGUAGE[language].YOU_HAVE_BEEN_BLOCKED}{' '}
                    {user?.user_name || 'this user'}
                </p>
                <p className="text-sm text-gray-500 text-center mb-2">
                    {LANGUAGE[language].YOU_CANNOT_MESSAGE}
                </p>
                {!isBlockYou && (
                    <>
                        <button
                            className="bg-white dark:text-white px-4 py-2 rounded-xl dark:bg-dark2Primary w-full mb-3"
                            onClick={() => handleUnblock(user?.id)}
                        >
                            {LANGUAGE[language].UNBLOCK}
                        </button>
                        <button
                            className="bg-white dark:text-white px-4 py-2 rounded-xl dark:bg-dark2Primary w-full"
                            onClick={() => handleReport(user?.id)}
                        >
                            {LANGUAGE[language].REPORT}
                        </button>
                    </>
                )}
            </div>
            <NotifyText message={notifyMessage} show={showNotify} />
        </>
    );
}

export default BlockedChat;
