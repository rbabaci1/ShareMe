import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { setPosts } from '../state';

const Feed = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(false);

  const ideaName = categoryId || 'new';

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);

      client.fetch(query).then(data => {
        dispatch(setPosts(data));
        setLoading(false);
      });
    } else {
      setLoading(true);
      client.fetch(feedQuery).then(data => {
        dispatch(setPosts(data));

        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) {
    return <Spinner message={`Gathering ${ideaName} ideas to your feed!`} />;
  } else {
    return (
      <div className='mt-24'>
        <MasonryLayout />
      </div>
    );
  }
};

export default Feed;
