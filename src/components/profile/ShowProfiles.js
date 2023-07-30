import React from 'react';
import defaultProfile from '../default_profile.png';

const ShowProfiles  = () => {
    return (
        <div className="flex items-center gap-3 mb-4">
            <img className="w-10 h-10" src={defaultProfile}/>
            <p className="flex-grow text-left capitalize    ">
                <h3 className="font-semibold">Leo Paul</h3>
                <p className="text-sm font-semibold text-gray">memerist</p>
            </p>
            <button className="text-center px-2 border border-white-10 rounded-xl text-2xl text-gray">+</button>
        </div>
    )
}

export default ShowProfiles