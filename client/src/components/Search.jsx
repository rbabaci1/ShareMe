import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useSelector } from 'react-redux';

const Search = ({ searchTerm }) => {
  const posts = useSelector(state => state.posts);
  const [filteredPosts, setFilteredPost] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPost(posts);
    } else {
      setLoading(true);

      const res = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPost(res);

      setLoading(false);
    }
  }, [searchTerm, posts]);

  return (
    <div className='mt-24'>
      {loading ? (
        <Spinner message='Searching pins' />
      ) : filteredPosts?.length ? (
        <MasonryLayout posts={filteredPosts} />
      ) : (
        <h2 className='mt-10 text-center text-2xl'>No Posts Found!</h2>
      )}
    </div>
  );
};

export default Search;
