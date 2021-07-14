import './App.css';

import React, {useState, useEffect, createContext} from 'react';
import Profile from './components/profile/Profile';
import Feeds from './components/feed/Feeds';

import styles from './Header.module.css';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import {storage,db, auth} from './firebase';

// import SignInUp from '../user/SignInUp';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #d55844',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  fields: {
      display:'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems:'center',
  }
  
}));

export const CounterContext = createContext();

function App() {

  const [openSignUp,setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');

  const [user, setUser] = useState(null);   
  const [userInfo, setUserInfo] = useState(null); 

  const [count, setCount] = useState(0);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const showSignIn = () => {
      setOpenSignIn(true);
      setOpenSignUp(false);
  }

  const profileChange = (e) => {
    if(e.target.files[0]){
      setProfile(e.target.files[0]);
    }
  }

    useEffect(() => {



    },[mobileNavOpen])

    useEffect(() => {
    
     const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser){
              db.collection("users").doc(authUser.uid).get().then( doc => {
                setUserInfo(doc.data())
              })
              setUser(authUser);
             }
            else{
                setUser(null);
                setUserInfo(null);
                setUsername('');
                setEmail('');
                setPassword('');
                setBio('');
            }
           
      })
        return () => {
            //perform some cleanup
            unsubscribe(); //every after firing it will clean up the listener or the effect to avoid lots of running listener
          }
      
    },[user])

    const signIn = (event) => {
      event.preventDefault();
      
      auth
      .signInWithEmailAndPassword(email,password)
      .then(() => setOpenSignIn(false))
      .catch((err) => alert(err.message))
    }

    const signUp = (event) => {
        // auth.createUserWithEmailAndPassword(email,password)
        // .then((authUser) => {
        //   console.log('signup?')
        //   return db.collection("users").doc(authUser.user.uid).set({
        //     biography: bio,
        //     displayName: username,
        //     postIds: []
        //   })  
        // })
        // .catch((err) => alert(err.message));
        if (!profile){
          return alert('Please upload your profile picture.')
        }
        const uploadUser = storage.ref(`profiles/${profile.name}`).put(profile);
        uploadUser.on(
          "state_changed",
          snapshot => {},
          error => {
              //Error function...
              console.log(error);
              alert(error.message);
          },
          () => {
              //compile function...
              storage
                  .ref("profiles")
                  .child(profile.name)
                  .getDownloadURL()
                  .then(url => {
                      //post evrything inside db...
                      auth.createUserWithEmailAndPassword(email,password)
                      .then((authUser) => {
                        console.log('signup?')
                        return db.collection("users").doc(authUser.user.uid).set({
                          biography: bio,
                          displayName: username,
                          profilePicture: url,
                          postIds: []
                        })  
                      })
                      .catch((err) => alert(err.message));
                      setProfile(null);
                  })
          }

      )
    }

  return(
    <div className='App'>
      {/* <Header/> */}
        <div className = {styles.header}>
            <div className="menuToggle">
                <input type="checkbox" onChange={()=> setMobileNavOpen(!mobileNavOpen)} onBlur={mobileNavOpen ? ()=> setMobileNavOpen(false) : ''}/>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className={styles.header__logo}>MEmer</p>
            {user?
            <Button className={styles.header__button} onClick = {() => auth.signOut()}>Log Out</Button>
            :
            <Button className={styles.header__button} onClick={() => setOpenSignUp(true)}>Log In</Button>
            }
           
       
            {/* for signup */}
            <Modal
                open={openSignUp}
                onClose={() => setOpenSignUp(false)}
            >
                <div style={modalStyle} className={classes.paper}>

                <form className={classes.fields}>
                    <center>
                        <img 
                        className='app__headerImage'
                        src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                        alt=''/>
                    </center>

                        <Input
                        placeholder='Username'
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        />
                        <Input
                        placeholder='Email'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />
                        <Input
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                        <Input
                        placeholder='One line bio'
                        type='text'
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        />

                        <div className={styles.Profile_picture}>
                        <label>Set your profile pgiticture</label>
                        <input type='file' id="profile-upload" onChange={profileChange}/>
                        </div>
                        <Button onClick={signUp}>Sign Up</Button>
                        <p style={{fontSize:'12px'}}>Already have account?<button className={styles.Header__sigin} onClick={showSignIn}>Sign in here</button></p>
                </form> 
                </div>
            </Modal>
            
                {/* for signin */}
                <Modal
                    open={openSignIn}
                    onClose={() => setOpenSignIn(false)}
                >
                    <div style={modalStyle} className={classes.paper}>

                    <form className={classes.fields}>
                        <center>
                            <img 
                            className='app__headerImage'
                            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                            alt=''/>
                        </center>

                            <Input
                            placeholder='Email'
                            type='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            />
                            <Input
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />

                            <Button onClick={signIn}>Sign In</Button>
                     
                    </form> 
                    </div>
                </Modal>
            
        </div>
      
    
      <div className='App__body'>
        <CounterContext.Provider value={[count,setCount]}> 
          <Profile cName = {mobileNavOpen} id='Profile' userInfo={userInfo ? userInfo: '' } user={user ? auth.currentUser : ''} />
          <Feeds username={userInfo ? userInfo.displayName : ''} user={user ? auth.currentUser : ''} userInfo={userInfo ? userInfo : ''} />
          <div className='ads'></div>
        </CounterContext.Provider>
      </div>
    </div>
  );
}


export default App;
