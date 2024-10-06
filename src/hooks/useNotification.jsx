import React, { useState, useCallback } from 'react';

export const useNotification = (duration = 1200) => {
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');

    const showNotification = useCallback(
        (message) => {
            setNotifyMessage(message);
            setShowNotify(true);
            setTimeout(() => setShowNotify(false), duration);
        },
        [duration],
    );

    const NotificationComponent = () => (
        <div
            className={`bg-black absolute left-1/2 transform -translate-x-1/2 w-auto z-50 dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
                showNotify ? 'translate-y-0 mt-3' : '-translate-y-full'
            }`}
        >
            <h6 className="text-black dark:text-white">{notifyMessage}</h6>
        </div>
    );

    return { showNotification, NotificationComponent };
};
