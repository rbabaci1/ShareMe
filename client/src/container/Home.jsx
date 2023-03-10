import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Sidebar, UserProfile } from '../components';
import Posts from './Posts';
import logo from '../assets/logo.png';
import Spinner from '../components/Spinner';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const scrollRef = useRef(null);

  const User = useSelector(state => state.user);

  useEffect(() => {
    if (User) {
      scrollRef.current.scrollTo(0, 0);
    }
  });

  if (User) {
    return (
      <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
        {/* Desktop sidebar */}
        <div className='hidden md:flex h-screen flex-initial'>
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        <div className='flex md:hidden flex-row'>
          <div className='p-2 relative top-0   bg-white w-full flex flex-row justify-between h-15 items-center shadow-md'>
            <HiMenu
              fontSize={40}
              className='cursor-pointer'
              onClick={() => setToggleSidebar(true)}
            />

            <Link to='/'>
              <img src={logo} alt='logo' className='w-28' />
            </Link>

            <Link to={`user_profile/${User?.googleId}`}>
              <img
                src={User?.imageUrl}
                alt='user-pic'
                className='w-10 h-10 mr-4 rounded-full '
              />
            </Link>
          </div>

          {toggleSidebar && (
            <div className='fixed w-full bg-white h-screen overflow-y-auto shadow-md z-40 animate-slide-in'>
              <div className=' absolute w-full flex justify-end items-center p-2'>
                <AiFillCloseCircle
                  fontSize={36}
                  className='cursor-pointer mt-2 mr-2'
                  onClick={() => setToggleSidebar(false)}
                />
              </div>

              <Sidebar closeSideBar={() => setToggleSidebar(false)} />
            </div>
          )}
        </div>

        <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
          <Routes>
            <Route path='/user_profile/:userId' element={<UserProfile />} />
            <Route path='/*' element={<Posts />} />
          </Routes>
        </div>
      </div>
    );
  } else {
    return <Spinner message='Loading...' />;
  }
};

export default Home;
