import './index.css'
import './App.css';
import defaultProfile from './components/default_profile.png';
import profileArrow from './components/profile-arrow.png';

import React, {useState, useEffect, createContext} from 'react';
import Profile from './components/profile/Profile';
import Feeds from './components/feed/Feeds';
import styles from './Header.module.css';
// import {makeStyles} from '@material-ui/core/styles';
// import Modal from '@material-ui/core/Modal';
// import {Button, Input} from '@material-ui/core';
import {storage,db, auth} from './firebase';
import { Menu, Transition } from '@headlessui/react'

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

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: 'absolute',
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #d55844',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
//   fields: {
//       display:'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems:'center',
//   }
  
// }));

export const CounterContext = createContext();

function App() {

  const [openSignUp,setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  // const classes = useStyles();
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
                        alert("You have Successfully Signed Up, Enjoy posting your memes!");
                        db.collection("users").doc(authUser.user.uid).set({
                          biography: bio,
                          displayName: username,
                          profilePicture: url,
                          postIds: []
                        })
                        return setOpenSignIn(false);
                      })
                      .catch((err) => alert(err.message));
                      setProfile(null);
                  })
          }

      )
    }

  return(
    <div className='App font-sans bg-white-10'>
      {/* <Header/> */}
        <div className="h-16 bg-yellow">
          <div className="flex justify-between h-full w-container m-auto">
            <div className="menuToggle">
                <input type="checkbox" onChange={()=> setMobileNavOpen(!mobileNavOpen)} onBlur={mobileNavOpen ? ()=> setMobileNavOpen(false) : ''}/>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className="flex items-center"><a href="#" className="no-underline text-white font-serif text-5xl"><span>Me</span><span className="text-black">mer</span></a></p>
            
            {user?
              <nav className="flex items-center font-semibold">
                {/* <button className="" onClick = {() => auth.signOut()}>Log Out</button> */}
                <ul className="text-base">
                  <li className="pr-5 inline"><a href="#">Feeds</a></li>
                  <li className="pr-5 inline"><a href="#">Message</a></li>
                  <li className="pr-5 inline"><a href="#">Notification</a></li>
                </ul>
                <Menu>
                  <div className="relative h-full px-3 border-r-2 border-l-2 border-solid border-yellow-10 flex items-center justify-between">
                    <img className="mr-2 w-10 h-10 rounded-full" src={userInfo ? userInfo.profilePicture : defaultProfile} alt=""/>
                    <Menu.Button><img className="w-6" src={profileArrow} alt=""/></Menu.Button> 
                        <Transition
                        enter="transition duration-200 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-100 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        >
                          <div className="absolute w-40 -right-0 -bottom-32 bg-yellow-10 rounded-xl">
                          <Menu.Items>
                            <Menu.Item>
                            <a id="dropdownProfileMenu" className="block p-4 border-b border-solid border-white text-left">Profile</a>
                            </Menu.Item>
                            <Menu.Item>
                            <a id="dropdownProfileMenu" className="block p-4 text-left">Logout</a>
                            </Menu.Item>
                          </Menu.Items>
                          </div>
                        </Transition>
                  </div>
                </Menu>
              </nav>
            :
              <button className="" onClick={() => setOpenSignUp(true)}>Log In</button>
            }

          </div>

            {/* for signup */}
            {openSignUp ?
            <div
                // open={openSignUp}
                // onClose={() => setOpenSignUp(false)}
            >
                <div style={modalStyle} className="">

                <form className="">
                    <center>
                        <img 
                        className='app__headerImage'
                        src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                        alt=''/>
                    </center>

                        <input
                        placeholder='Username'
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        />
                        <input
                        placeholder='Email'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />
                        <input
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                        <input
                        placeholder='One line bio'
                        type='text'
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        />

                        <div className={styles.Profile_picture}>
                        <label>Set your profile pgiticture</label>
                        <input type='file' id="profile-upload" onChange={profileChange}/>
                        </div>
                        <button onClick={signUp}>Sign Up</button>
                        <p style={{fontSize:'12px'}}>Already have account?<button className={styles.Header__sigin} onClick={showSignIn}>Sign in here</button></p>
                </form> 
                </div>
            </div>
            : null
            }
            
                {/* for signin */}
                {openSignUp ?
                <div
                    open={openSignIn}
                    onClose={() => setOpenSignIn(false)}
                >
                    <div style={modalStyle} className="">

                    <form className="">
                        <center>
                            <img 
                            className='app__headerImage'
                            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                            alt=''/>
                        </center>

                            <input
                            placeholder='Email'
                            type='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            />
                            <input
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />

                            <button onClick={signIn}>Sign In</button>
                     
                    </form> 
                    </div>
                </div>
                : null }
        </div>
      
    
      <div className='w-container max-w-full m-auto flex mt-16 gap-8'>
        <CounterContext.Provider value={[count,setCount]}> 
          <Profile cName = {mobileNavOpen} id='Profile' userInfo={userInfo ? userInfo: '' } user={user ? auth.currentUser : ''} />
          <Feeds username={userInfo ? userInfo.displayName : ''} user={user ? auth.currentUser : ''} userInfo={userInfo ? userInfo : ''} />
          <div className="w-72 bg-white"></div>
        </CounterContext.Provider>
      </div>
    </div>
  );
}


export default App;
