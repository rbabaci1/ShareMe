import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { relatedPostsQuery, postDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PostDetail = ({ user }) => {
  const [posts, setPosts] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { postId } = useParams();

  const fetchPostDetails = () => {
    let query = postDetailQuery(postId);

    if (query) {
      client.fetch(`${query}`).then(data => {
        setPostDetail(data[0]);

        if (data[0]) {
          query = relatedPostsQuery(data[0]);

          client.fetch(query).then(res => {
            setPosts(res);
          });
        }
      });
    }
  };

  console.log(postDetail);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: 'postedBy', _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPostDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  if (!postDetail) {
    return <Spinner message='Loading post...' />;
  }

  return (
    <>
      {postDetail && (
        <div
          className='flex xl:flex-row flex-col m-auto bg-white'
          style={{
            maxWidth: '1500px',
            borderRadius: '32px',
            marginTop: '100px',
          }}
        >
          <div className='flex justify-center items-center md:items-start flex-initial'>
            <img
              className='lg:rounded-2xl sm:rounded-t-2xl'
              src={postDetail.image && urlFor(postDetail.image).url()}
              alt='user-post'
            />
          </div>

          <div className='w-full p-5 flex-1 xl:min-w-620'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 items-center'>
                <a
                  href={`${postDetail?.image.asset.url}?dl=`}
                  download
                  className='bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100'
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              <a
                href={postDetail?.destination}
                target='_blank'
                rel='noreferrer'
                className='bg-gray-100 flex items-center gap-2 text-black font-bold p-1 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
              >
                <BsFillArrowUpRightCircleFill />
                {postDetail?.destination?.slice(8, 28)} ...
              </a>
            </div>

            <div>
              <h1 className='text-4xl font-bold break-words mt-3'>
                {postDetail?.title}
              </h1>
              <p className='mt-3'>{postDetail?.about}</p>
            </div>

            <Link
              to={`/user_profile/${postDetail?.postedBy._id}`}
              className='flex gap-2 mt-5 items-center bg-white rounded-lg '
            >
              <img
                src={postDetail?.postedBy.image}
                className='w-10 h-10 rounded-full'
                alt='user-profile'
              />
              <p className='font-bold'>{postDetail?.postedBy.userName}</p>
            </Link>

            <h2 className='mt-5 text-2xl'>Comments</h2>

            <div className='max-h-370 overflow-y-auto'>
              {postDetail?.comments?.map(item => (
                <div
                  className='flex gap-2 mt-5 items-center bg-white rounded-lg'
                  key={item.comment}
                >
                  <Link to={`/user_profile/${item.postedBy._id}`}>
                    <img
                      src={item.postedBy?.image}
                      className='w-10 h-10 rounded-full cursor-pointer'
                      alt='user-profile'
                    />
                  </Link>

                  <div className='flex flex-col'>
                    <p className='font-bold'>{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex flex-wrap mt-6 gap-3'>
              <Link to={`/user_profile/${user._id}`}>
                <img
                  src={user?.image}
                  className='w-10 h-10 rounded-full cursor-pointer'
                  alt='user-profile'
                />
              </Link>

              <input
                className=' flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                type='text'
                placeholder='Add a comment'
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button
                type='button'
                className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                onClick={addComment}
              >
                {addingComment ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className='text-center w-full bg-white font-bold text-4xl rounded-2xl pt-4 pb-4 mt-14'>
        More like this
      </h1>

      {posts ? (
        posts.length ? (
          <MasonryLayout posts={posts} />
        ) : (
          <h2>No matching posts :(</h2>
        )
      ) : (
        <Spinner message='Loading more posts' />
      )}
    </>
  );
};

export default PostDetail;
