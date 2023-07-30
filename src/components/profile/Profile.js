import React,{useState,useContext} from 'react';
import defaultProfile from '../default_profile.png';
import classes from './Profile.module.css';
import { CounterContext } from "../../App.js";
import ShowProfiles from "./ShowProfiles";



const Profile = ({userInfo,user,cName}) => {


    const [count] = useContext(CounterContext);
    // const [userLikes,setUserLikes] = useState([]);

    // const [totalLikes, setTotalLikes] = useState(0);

    // useEffect(() => {
    //     let likes = 0;
    //     if(user){
    //     db.collection('posts').where('uid', "==", user.uid).get().then( querySnapshot => {
    //         querySnapshot.forEach((doc) => {
    //             likes += doc.data().likes;
    //         });
    //         setTotalLikes(likes);
    //     })}
          
    // },[]);
    
    return (
        <div className="h-fit grid grid-cols-1 gap-8">
            <div className="h-fit w-72 bg-white rounded-3xl">
                <div className="relative bg-yellow rounded-t-3xl">
                    <div className='w-full h-28'>
                    </div>
                    <img className="absolute top-14 left-1/2 -translate-x-2/4 w-32 rounded-full bg-white border-4 border-white" src={userInfo ? userInfo.profilePicture : defaultProfile} alt='profile_picture'/>
                </div>
                <div className="mt-24 capitalize">
                    <p className="text-2xl text-black font-bold">{userInfo.displayName}</p>
                    <p className="text-gray font-semibold">{userInfo.biography}</p>
                </div>
                { userInfo ? 
                // <div className={classes.Profile__likes}>
                //     <p style={{margin:'5px',fontSize:'18px',color:'#222222'}}>Likes</p>
                //     <p style={{margin:'5px',fontSize:'16px',color:'gray'}}>{count}</p>
                // </div>
                <div className="m-6 p-4 bg-gray-10 rounded-3xl grid grid-cols-2 gap-4">
                    <div className="p-2 text-center">
                        <h3 className="text-xl font-extrabold">89</h3>
                        <p className="text-gray">Posts</p>
                    </div>
                    <div className="p-2 text-center">
                        <h3 className="text-xl font-bold">{count}</h3>
                        <p className="text-gray font-semibold">Likes</p>
                    </div>
                    <div className="p-2 text-center">
                        <h3 className="text-xl font-bold">120</h3>
                        <p className="text-gray font-semibold">Followers</p>
                    </div>
                    <div className="p-2 text-center">
                        <h3 className="text-xl font-bold">25</h3>
                        <p className="text-gray font-semibold">Following</p>
                    </div>
                </div>
                :
                ''
                }
                <button className="text-yellow mb-6 font-semibold">View Profile</button>
            </div>

            <div className="h-fit w-72 bg-white rounded-3xl">
                <h2 className="text-left text-lg font-semibold p-6 border-b border-white-10">Suggestions</h2>
                <div className="p-6">
                    <ShowProfiles/>
                    <ShowProfiles/>
                    <ShowProfiles/>
                    <ShowProfiles/>
                    <ShowProfiles/>
                    <ShowProfiles/>
                </div>
            </div>
        </div>
     
    )
}

export default Profile
