import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Navbar, Feed, PostDetail, CreatePost, Search } from '../components';

const Posts = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <div className='flex z-30 bg-white md:ml-0.5 fixed md:top-0   right-0 md:left-52 sm:left-0 left-0'>
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>

      <div className='px-2 md:px-5'>
        <div className='h-full'>
          <Routes>
            <Route path='/' element={<Feed />} />

            <Route path='/category/:categoryId' element={<Feed />} />

            <Route
              path='/post_detail/:postId'
              element={<PostDetail user={user} />}
            />

            <Route path='/create_post' element={<CreatePost user={user} />} />

            <Route
              path='/search'
              element={
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Posts;
