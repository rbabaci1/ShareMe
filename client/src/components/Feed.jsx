import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { client } from '../client';
import { feedQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { setPosts } from '../state';

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(false);

  const ideaName = categoryId || 'new';

  useEffect(() => {
    if (categoryId) {
      setLoading(true);

      const res = posts?.filter(post => post.category === categoryId);

      setFilteredPosts(res);
      setLoading(false);
    } else {
      if (!posts.length) {
        setLoading(true);

        client.fetch(feedQuery).then(data => {
          dispatch(setPosts(data));

          setLoading(false);
        });
      }
    }
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Spinner message={`Gathering ${ideaName} ideas to your feed!`} />;
  } else {
    return (
      <div className='mt-24'>
        <MasonryLayout posts={categoryId ? filteredPosts : posts} />
      </div>
    );
  }
};

export default Feed;
