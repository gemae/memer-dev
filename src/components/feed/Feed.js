import React, {useEffect,useState,useContext} from 'react';
import classes from './Feed.module.css';
import Avatar from '@material-ui/core/Avatar';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import {db} from '../../firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { CounterContext } from "../../App.js";

const Feed = ({username,imageUrl,caption,postId,likes,user,ppId}) => {
    // let timestampDate = new Date(timestamp.seconds);
    const [userInfos,setUserInfos] = useState(null);
    const [isBoxLiked,setIsBoxLiked] = useState(false);
    const [count, setCount] = useContext(CounterContext);
    const [profileURl,setProfileUrl] = useState('');
    
    const likePost = () => {
    
        if(!(userInfos.postIds).includes(postId)){
            db.collection('posts').doc(postId).update(
                "likes", firebase.firestore.FieldValue.increment(1)
            )
            db.collection('users').doc(user.uid).update(
                'postIds', firebase.firestore.FieldValue.arrayUnion(postId)
            )
            console.log('increment')
        }
        else{
            db.collection('users').doc(user.uid).update(
                'postIds', firebase.firestore.FieldValue.arrayRemove(postId)
            )
            db.collection('posts').doc(postId).update(
                "likes", firebase.firestore.FieldValue.increment(-1)
            )
            console.log(count)
        }

    }
    // const fetchData = async() => {
    //     const response = db.collection("users").doc(user.uid);
    //     const data=await response.get();
    //     setUserInfos(data.data());
    // }

    useEffect(() => {
        if(user){
            db.collection("users").doc(user.uid).get().then( doc => {
                setUserInfos(doc.data());
                if(!(doc.data().postIds).includes(postId)){
                    setIsBoxLiked(true);
                }else{
                    setIsBoxLiked(false);
                }
            });
            let likes = 0;
 
            db.collection('posts').where('uid', "==", user.uid).get().then( querySnapshot => {
                querySnapshot.forEach((doc) => {
                    likes += doc.data().likes;
                });
                setCount(likes);
            })
            db.collection("users").doc(ppId).get().then( doc => {
                setProfileUrl(doc.data().profilePicture)
            })
        }
    },[userInfos,user])

   

    return (
            <div className={classes.Feed__posted}>
                <div className={classes.Feed__post_head}>
                    <Avatar alt='profile' src={profileURl}/>
                    <p className={classes.Feed__post_head_username}>{username}</p>
                    <p className={classes.Feed__post_date}><small>{'today'}</small></p>
                </div>
                <p className={classes.Feed__posted_caption}>{caption}</p>
                <img className={classes.Feed__posted_picture} src={imageUrl} alt='Posted pictures'/>
                <div className={classes.Feed__posted_like_comment}>
                    <span className={classes.Feed__posted_likes}>
                        <button disabled={!user ? true : false} onClick={likePost}><WhatshotIcon className={isBoxLiked || !user ? classes.Feed__posted_liked : classes.Feed__posted_notLike}/></button>
                        <p><small>{likes}{likes > 1 ? ' likes' : ' like'} </small></p>
                    </span>
                <span className={classes.Feed__posted_comment}>
                <input placeholder='Comment here...'/>
                <button>Go!</button>
                </span>
                    
            </div>
        </div>
    )
}

export default Feed
