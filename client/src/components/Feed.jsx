import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  const ideaName = categoryId || 'new';

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);

      client.fetch(query).then(data => {
        setPosts(data);
        setLoading(false);
      });
    } else {
      setLoading(true);

      client.fetch(feedQuery).then(data => {
        setPosts(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) {
    return <Spinner message={`Gathering ${ideaName} ideas to your feed!`} />;
  } else {
    return (
      <div className='mt-24'>
        {posts.length ? (
          <MasonryLayout posts={posts} />
        ) : (
          <h1 className='text-center text-2xl'>No Created Posts Found!</h1>
        )}
      </div>
    );
  }
};

export default Feed;
