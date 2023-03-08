import React from 'react';
import Masonry from 'react-masonry-css';
import Post from './Post';

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ posts }) => {
  return posts?.length ? (
    <Masonry
      className='flex animate-slide-fwd mt-8'
      breakpointCols={breakpointColumnsObj}
    >
      {posts.map(post => (
        <Post key={post._id} post={post} className='w-max' />
      ))}
    </Masonry>
  ) : (
    <h1 className='text-center text-2xl'>No Created Posts Found!</h1>
  );
};

export default MasonryLayout;
