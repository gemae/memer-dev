import React,{useEffect,useState,useContext} from 'react';
import defaultProfile from '../default_profile.png';
import classes from './Profile.module.css';
import {db} from '../../firebase';
import { CounterContext } from "../../App.js";




const Profile = ({userInfo,user}) => {
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
        
        <div className={classes.Profile__wrapper}>
            <div className={classes.Profile__container}>
                <div className={classes.Profile__header}>
                </div>
                <img className={classes.Profile__picture} src={userInfo ? userInfo.profilePicture : defaultProfile} alt='profile_picture'/>
                <div className={classes.Profile__data}>
                <p className={classes.Profile__name}>{userInfo.displayName}</p>
                    <p className={classes.Profile__bio}>{userInfo.biography}</p>
                </div>
            </div>
            
            <div className={classes.Profile__likes}>
                    <p style={{margin:'5px',fontSize:'18px',color:'#222222'}}>Likes</p>
                    <p style={{margin:'5px',fontSize:'16px',color:'gray'}}>{count}</p>
            </div>
        </div>
     
    )
}

export default Profile
