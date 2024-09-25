import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

function DrawerFollower() {
    const { showDrawerFollow, toggleShowDrawerFollow } = useContext(AppContext);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 ${
                showDrawerFollow ? 'block' : 'hidden'
            }`}
        >
            <div className="bg-white w-full h-full">
                <h1>DrawerFollower</h1>
            </div>
        </div>
    );
}

export default DrawerFollower;
