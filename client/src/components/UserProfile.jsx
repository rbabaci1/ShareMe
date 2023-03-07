import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import {
  userCreatedPostsQuery,
  userQuery,
  userSavedPostsQuery,
} from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../state';

const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';
const randomImage =
  'https://source.unsplash.com/1600x900/?nature,photography,technology';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const User = useSelector(state => state.user);

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then(data => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPostsQuery = userCreatedPostsQuery(userId);

      client.fetch(createdPostsQuery).then(data => {
        setPosts(data);
      });
    } else {
      const savedPostsQuery = userSavedPostsQuery(userId);

      client.fetch(savedPostsQuery).then(data => {
        setPosts(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    dispatch(setLogout());

    navigate('/login');
  };

  if (!user) return <Spinner message='Loading profile' />;

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              className=' w-full h-370 2xl:h-510 shadow-lg object-cover'
              src={randomImage}
              alt='user-background-pic'
            />
            <img
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
              src={user.image}
              alt='user-pic'
            />
          </div>

          <h1 className='font-bold text-3xl text-center mt-3'>
            {user.userName}
          </h1>

          <div className='absolute top-0 z-1 right-0 p-2'>
            {userId === User?.googleId && (
              <GoogleLogout
                clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                render={renderProps => (
                  <button
                    type='button'
                    className=' bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <AiOutlineLogout color='red' fontSize={21} />
                  </button>
                )}
                onLogoutSuccess={logout}
                cookiePolicy='single_host_origin'
              />
            )}
          </div>
        </div>

        <div className='text-center mb-7'>
          <button
            type='button'
            onClick={e => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${
              activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>

          <button
            type='button'
            onClick={e => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${
              activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>

        {posts?.length ? (
          <div className='px-2'>
            <MasonryLayout posts={posts} />
          </div>
        ) : (
          <h2 className='flex justify-center items-center text-2xl'>
            No {text} Posts Found!
          </h2>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
