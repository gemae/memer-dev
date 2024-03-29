import React, {useState,useEffect} from 'react';
import classes from './Feed.module.css';
import defaultProfile from '../default_profile.png';
// import { Button } from '@material-ui/core';
// import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';
import {storage,db} from '../../firebase';
import Feed from './Feed';


const Feeds = ({username,user,userInfo}) => {
    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    
    const [posts, setPosts] = useState([]);
    
   

    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
    if(user){
        if(image==null){
            return(alert('Please choose a meme you want to upload..'));
        }
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                //comple function...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post evrything inside db...
                        db.collection("posts").add({

                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                            uid:user.uid,
                            likes:0
                            
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    })
            }

        )
    }
    else{
        return(alert('Please Sign Up first'));
    }
    }

    useEffect(() => {
        
            db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc =>({
                    id: doc.id,
                    post: doc.data()
                })));
            });
            
        
    },[user]);


    return (
        <div className={classes.Feed__wrapper}>
            <div className="bg-white rounded-3xl p-6 flex items-center gap-6 border-t-4 border-width-2 border-yellow">
                {/* <progress className={classes.Feed__progress} value={progress} max='100'/> */}
                <img className="w-14" alt='profile' src={user ? userInfo.profilePicture : defaultProfile}/>
                <input 
                    className="outline-none flex-grow"
                    type='text'
                    value={caption}
                    placeholder='Post here...'
                    onChange={(e) => setCaption(e.target.value)}
                />
                <button className="h-fit bg-yellow text-white px-8 py-2 rounded-3xl" onClick={handleUpload}>Post</button>
            </div>
               {/* <div className={classes.Feed__import_button}>
                   <input type='file' id="file-upload" onChange={handleChange}/>  
                </div> */}
        
            {posts.map(({id,post}) => 
                <Feed
                key = {id}
                user={user}
                userInfo={userInfo}
                postId = {id}
                username={post.username} 
                imageUrl={post.imageUrl} 
                caption={post.caption}
                likes={post.likes}
                ppId={post.uid}
                    //timestamp={moment(post.timestamp.toDate()).subtract(10, 'days').calendar()}
                />
            )}
        </div>
    )
}

export default Feeds
