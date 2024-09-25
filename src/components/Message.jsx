import React, { useState, useEffect } from 'react';

export default function Message() {
    // hiện thị 2s sau mới ẩn
    const [show, setShow] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShow(false);
        }, 1500);
    }, []);

    return (
        <div
            className={`absolute z-50 w-[90%] mx-auto right-[10px] left-[10px] transition-all duration-300 ${
                show ? 'translate-y-0 bottom-5' : 'translate-y-full'
            }`}
        >
            <div className="bg-[#333333] dark:bg-dark2Primary h-[40px] rounded-sm">
                <div className="flex items-center justify-start h-full pl-4">
                    <div className="text-white">Profile updated</div>
                </div>
            </div>
        </div>
    );
}
