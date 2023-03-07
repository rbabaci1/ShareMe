import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm !== '') {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query).then(data => {
        setPosts(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then(data => {
        setPosts(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div className='mt-24'>
      {loading ? (
        <Spinner message='Searching pins' />
      ) : posts?.length ? (
        <MasonryLayout posts={posts} />
      ) : (
        <h2 className='mt-10 text-center text-2xl'>No Posts Found!</h2>
      )}
    </div>
  );
};

export default Search;
